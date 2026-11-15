const mongoose = require('mongoose');
const ref = (r) => ({ type: mongoose.Schema.Types.ObjectId, ref: r, required: true });

const reviewSchema = new mongoose.Schema({
  swap: ref('SwapRequest'),
  reviewer: ref('User'),
  reviewee: ref('User'),
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, maxlength: 300, default: '' },
}, { timestamps: true });

reviewSchema.index({ swap: 1, reviewer: 1 }, { unique: true }); // one review per person per swap
module.exports = mongoose.model('Review', reviewSchema);
