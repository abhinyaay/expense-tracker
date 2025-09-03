import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#3b82f6',
  },
  icon: {
    type: String,
    default: '💰',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Create compound index for user and category name uniqueness
CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
