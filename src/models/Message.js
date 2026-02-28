import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: {
      type: Date,
      default: null
    },
  },
  { timestamps: true }
);

// Compound index for efficient querying of conversations
MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
MessageSchema.index({ receiverId: 1, isRead: 1 });

// Ensure collection name
MessageSchema.set('collection', 'messages');

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
export { MessageSchema };

