import mongoose, { Schema } from 'mongoose';

const BlogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: '' },
    category: { type: String, default: 'General' },
    tags: [{ type: String }],
    featuredImage: { type: String, default: '' },
    author: { type: String, default: 'Admin' },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

BlogSchema.pre('save', function (next) {
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
