import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    // Step 1
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },

    // Step 2
    country: { type: String, default: '' },
    education: { type: String, default: '' },
    height: { type: String, default: '' },
    weight: { type: String, default: '' },
    dateOfBirth: { type: String, default: '' },
    maritalStatus: { type: String, default: '' },
    gender: { type: String, enum: ['Male', 'Female', ''], default: '' },
    ethnicity: { type: String, default: '' },
    religion: { type: String, default: '' },
    hobbies: { type: String, default: '' },
    qualifications: { type: String, default: '' },
    occupation: { type: String, default: '' },

    // Step 3 - Cloudinary URLs
    profilePhotoUrl: { type: String, default: '' },
    profilePhotoPublicId: { type: String, default: '' },
    identityDocumentUrl: { type: String, default: '' },
    identityDocumentPublicId: { type: String, default: '' },
    aboutMe: { type: String, default: '' },
    
    // Legacy fields for backward compatibility
    profilePhotoName: { type: String, default: '' },
    identityDocumentName: { type: String, default: '' },

    // Role
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    // Membership Plan
    membershipPlan: { 
      type: String, 
      enum: ['basic', 'standard', 'premium', 'elite'], 
      default: 'basic' 
    },
    subscriptionEndsAt: { type: Date, default: null },
    subscriptionType: {
      type: String,
      enum: ['one-time', 'monthly', null],
      default: null
    },
    
    // Upgrade Request System
    upgradeRequest: {
      requestedPlan: {
        type: String,
        enum: ['standard', 'premium', 'elite', null],
        default: null
      },
      subscriptionType: {
        type: String,
        enum: ['one-time', 'monthly', null],
        default: null
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', null],
        default: null
      },
      requestedAt: { type: Date, default: null },
      reviewedAt: { type: Date, default: null },
      reviewedBy: { type: String, default: null }, // Admin user ID
      rejectionReason: { type: String, default: null },
      paymentProof: { type: String, default: null }, // URL to payment proof document
    },
    
    // Profile visibility settings
    profileVisibility: {
      type: String,
      enum: ['public', 'members-only', 'premium-only'],
      default: 'public'
    },
    isVerified: { type: Boolean, default: false },

    // Like System
    likedProfiles: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }], // Array of user IDs that this user has liked
    likedBy: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }], // Array of user IDs who liked this user

    // Daily like tracking for Basic users (5 likes per day limit)
    dailyLikes: {
      date: { type: String, default: '' }, // Format: YYYY-MM-DD
      count: { type: Number, default: 0 }
    },

    // Daily message tracking for Standard users (5 messages per day limit)
    dailyMessages: {
      date: { type: String, default: '' }, // Format: YYYY-MM-DD
      count: { type: Number, default: 0 }
    },
  },
  { timestamps: true }
);

// Virtual to check if user has active premium subscription
UserSchema.virtual('isPremium').get(function() {
  if (this.membershipPlan === 'basic') return false;
  if (!this.subscriptionEndsAt) return true; // No expiry means lifetime subscription
  return new Date() < this.subscriptionEndsAt;
});

// Ensure virtuals are included in JSON
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

// Explicitly set collection name to 'users'
UserSchema.set('collection', 'users');

export default mongoose.models.User || mongoose.model('User', UserSchema);

// Export the schema for use in other databases (e.g., test database)
export { UserSchema };


