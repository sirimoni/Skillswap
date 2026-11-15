const Review = require('../models/Review');
const User = require('../models/User');
// Recalculate a user's average rating from all their reviews
module.exports = async function recalcRating(userId) {
  const [r] = await Review.aggregate([
    { $match: { reviewee: userId } },
    { $group: { _id: null, avg: { $avg: '$rating' }, n: { $sum: 1 } } },
  ]);
  await User.findByIdAndUpdate(userId, {
    ratingAvg: r ? Math.round(r.avg * 10) / 10 : 0,
    ratingCount: r ? r.n : 0,
  });
};
