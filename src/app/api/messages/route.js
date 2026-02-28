import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserSchema } from '@/models/User';
import { MessageSchema } from '@/models/Message';
import mongoose from 'mongoose';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET - Get conversations list for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const testDb = mongoose.connection.useDb('test');

    // Get or create models
    let TestUser, TestMessage;
    if (testDb.models.User) {
      TestUser = testDb.models.User;
    } else {
      TestUser = testDb.model('User', UserSchema);
    }
    if (testDb.models.Message) {
      TestMessage = testDb.models.Message;
    } else {
      TestMessage = testDb.model('Message', MessageSchema);
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Get all conversations where user is sender or receiver
    const conversations = await TestMessage.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(userId) },
            { receiverId: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', new mongoose.Types.ObjectId(userId)] },
              '$receiverId',
              '$senderId'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiverId', new mongoose.Types.ObjectId(userId)] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          userId: '$_id',
          firstName: '$user.firstName',
          lastName: '$user.lastName',
          profilePhotoUrl: '$user.profilePhotoUrl',
          membershipPlan: '$user.membershipPlan',
          lastMessage: {
            content: '$lastMessage.content',
            createdAt: '$lastMessage.createdAt',
            isRead: '$lastMessage.isRead'
          },
          unreadCount: 1
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    return NextResponse.json({
      conversations: conversations || []
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations', message: error?.message },
      { status: 500 }
    );
  }
}

// POST - Send a message
export async function POST(request) {
  try {
    const body = await request.json();
    const { senderId, receiverId, content } = body;

    if (!senderId || !receiverId || !content) {
      return NextResponse.json(
        { error: 'Sender ID, receiver ID, and content are required' },
        { status: 400 }
      );
    }

    if (senderId === receiverId) {
      return NextResponse.json(
        { error: 'You cannot message yourself' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const testDb = mongoose.connection.useDb('test');

    // Get or create models
    let TestUser, TestMessage;
    if (testDb.models.User) {
      TestUser = testDb.models.User;
      TestMessage = testDb.models.Message;
    } else {
      TestUser = testDb.model('User', UserSchema);
      TestMessage = testDb.model('Message', MessageSchema);
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Get sender to check plan and daily limits
    const sender = await TestUser.findById(senderId);
    if (!sender) {
      return NextResponse.json(
        { error: 'Sender not found' },
        { status: 404 }
      );
    }

    // Check receiver exists
    const receiver = await TestUser.findById(receiverId);
    if (!receiver) {
      return NextResponse.json(
        { error: 'Receiver not found' },
        { status: 404 }
      );
    }

    const membershipPlan = sender.membershipPlan || 'basic';

    // Check plan restrictions
    if (membershipPlan === 'basic') {
      return NextResponse.json(
        { 
          error: 'Messaging not available',
          message: 'Upgrade to Standard or higher plan to send messages.',
          limitReached: true
        },
        { status: 403 }
      );
    }

    // Check daily limit for Standard users (5 messages per day)
    if (membershipPlan === 'standard') {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Reset counter if it's a new day
      if (sender.dailyMessages?.date !== today) {
        sender.dailyMessages = { date: today, count: 0 };
      }

      // Check if limit reached
      if (sender.dailyMessages.count >= 5) {
        return NextResponse.json(
          { 
            error: 'Daily message limit reached',
            message: 'Standard members can send up to 5 messages per day. Upgrade to Premium or Elite for unlimited messaging.',
            limitReached: true,
            dailyMessagesRemaining: 0
          },
          { status: 429 }
        );
      }

      // Increment daily message count
      sender.dailyMessages.count += 1;
      await sender.save();
    }

    // Create message
    const message = new TestMessage({
      senderId,
      receiverId,
      content: content.trim()
    });

    await message.save();

    // Populate sender info for response
    const populatedMessage = await TestMessage.findById(message._id)
      .populate('senderId', 'firstName lastName profilePhotoUrl')
      .populate('receiverId', 'firstName lastName profilePhotoUrl')
      .lean();

    return NextResponse.json({
      success: true,
      message: populatedMessage,
      dailyMessagesRemaining: membershipPlan === 'standard' 
        ? 5 - sender.dailyMessages.count 
        : null
    });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message', message: error?.message },
      { status: 500 }
    );
  }
}

