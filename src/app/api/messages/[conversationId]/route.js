import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { MessageSchema } from '@/models/Message';
import mongoose from 'mongoose';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET - Get messages between two users
export async function GET(request, { params }) {
  try {
    const { conversationId } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // conversationId should be the other user's ID
    const otherUserId = conversationId;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(otherUserId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const testDb = mongoose.connection.useDb('test');

    // Get or create Message model
    let TestMessage;
    if (testDb.models.Message) {
      TestMessage = testDb.models.Message;
    } else {
      TestMessage = testDb.model('Message', MessageSchema);
    }

    // Get all messages between these two users
    const messages = await TestMessage.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    })
      .populate('senderId', 'firstName lastName profilePhotoUrl')
      .populate('receiverId', 'firstName lastName profilePhotoUrl')
      .sort({ createdAt: 1 })
      .lean();

    // Mark messages as read if user is the receiver
    await TestMessage.updateMany(
      {
        senderId: otherUserId,
        receiverId: userId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    return NextResponse.json({
      messages: messages || []
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages', message: error?.message },
      { status: 500 }
    );
  }
}

