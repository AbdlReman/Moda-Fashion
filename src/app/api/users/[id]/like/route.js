import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserSchema } from '@/models/User';
import mongoose from 'mongoose';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// POST - Like a profile
export async function POST(request, { params }) {
  try {
    const { id: targetUserId } = params;
    const body = await request.json();
    const { userId: currentUserId } = body; // The user who is liking

    if (!currentUserId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Switch to 'test' database
    const testDb = mongoose.connection.useDb('test');
    
    // Get or create User model for test database
    let TestUser;
    if (testDb.models.User) {
      TestUser = testDb.models.User;
    } else {
      TestUser = testDb.model('User', UserSchema);
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(currentUserId) || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Can't like yourself
    if (currentUserId === targetUserId) {
      return NextResponse.json(
        { error: 'You cannot like your own profile' },
        { status: 400 }
      );
    }

    // Get current user to check membership plan and daily limits
    const currentUser = await TestUser.findById(currentUserId);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if target user exists
    const targetUser = await TestUser.findById(targetUserId);
    if (!targetUser) {
      return NextResponse.json(
        { error: 'Target user not found' },
        { status: 404 }
      );
    }

    // Check if already liked
    const alreadyLiked = currentUser.likedProfiles?.some(
      id => id.toString() === targetUserId
    );

    if (alreadyLiked) {
      return NextResponse.json(
        { error: 'You have already liked this profile' },
        { status: 400 }
      );
    }

    // Check daily limit for Basic users (5 likes per day)
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const membershipPlan = currentUser.membershipPlan || 'basic';
    
    if (membershipPlan === 'basic') {
      // Reset counter if it's a new day
      if (currentUser.dailyLikes?.date !== today) {
        currentUser.dailyLikes = { date: today, count: 0 };
      }

      // Check if limit reached
      if (currentUser.dailyLikes.count >= 5) {
        return NextResponse.json(
          { 
            error: 'Daily like limit reached',
            message: 'Basic members can like up to 5 profiles per day. Upgrade to Standard or higher for unlimited likes.',
            limitReached: true
          },
          { status: 429 }
        );
      }

      // Increment daily like count
      currentUser.dailyLikes.count += 1;
    }

    // Add like
    if (!currentUser.likedProfiles) {
      currentUser.likedProfiles = [];
    }
    currentUser.likedProfiles.push(targetUserId);

    if (!targetUser.likedBy) {
      targetUser.likedBy = [];
    }
    targetUser.likedBy.push(currentUserId);

    // Save both users
    await currentUser.save();
    await targetUser.save();

    return NextResponse.json({
      success: true,
      message: 'Profile liked successfully',
      dailyLikesRemaining: membershipPlan === 'basic' ? 5 - currentUser.dailyLikes.count : null,
      likedCount: currentUser.likedProfiles.length,
      targetUserLikedByCount: targetUser.likedBy.length
    });

  } catch (error) {
    console.error('Error liking profile:', error);
    return NextResponse.json(
      { error: 'Failed to like profile', message: error?.message },
      { status: 500 }
    );
  }
}

// DELETE - Unlike a profile
export async function DELETE(request, { params }) {
  try {
    const { id: targetUserId } = params;
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('userId');

    if (!currentUserId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Switch to 'test' database
    const testDb = mongoose.connection.useDb('test');
    
    // Get or create User model for test database
    let TestUser;
    if (testDb.models.User) {
      TestUser = testDb.models.User;
    } else {
      TestUser = testDb.model('User', UserSchema);
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(currentUserId) || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Get both users
    const currentUser = await TestUser.findById(currentUserId);
    const targetUser = await TestUser.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove like
    currentUser.likedProfiles = currentUser.likedProfiles?.filter(
      id => id.toString() !== targetUserId
    ) || [];

    targetUser.likedBy = targetUser.likedBy?.filter(
      id => id.toString() !== currentUserId
    ) || [];

    // Save both users
    await currentUser.save();
    await targetUser.save();

    return NextResponse.json({
      success: true,
      message: 'Profile unliked successfully',
      likedCount: currentUser.likedProfiles.length,
      targetUserLikedByCount: targetUser.likedBy.length
    });

  } catch (error) {
    console.error('Error unliking profile:', error);
    return NextResponse.json(
      { error: 'Failed to unlike profile', message: error?.message },
      { status: 500 }
    );
  }
}

