import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for efficient querying by user and date
ExpenseSchema.index({ userId: 1, date: -1 });
ExpenseSchema.index({ userId: 1, category: 1 });

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
