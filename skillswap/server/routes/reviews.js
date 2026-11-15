const router = require('express').Router();
const Review = require('../models/Review');
const SwapRequest = require('../models/SwapRequest');
const recalcRating = require('../utils/rating');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');

router.post('/', protect, asyncHandler(async (req, res) => {
  const { swap, rating, comment } = req.body;
  const s = await SwapRequest.findById(swap);
  if (!s) return res.status(404).json({ message: 'Swap not found' });
  const me = String(req.user._id);
  if (![String(s.from), String(s.to)].includes(me)) return res.status(403).json({ message: 'Only participants can review' });
  if (s.status !== 'completed') return res.status(409).json({ message: 'You can only review completed swaps' });
  const reviewee = me === String(s.from) ? s.to : s.from;
  const review = await Review.create({ swap: s._id, reviewer: req.user._id, reviewee, rating, comment }); // duplicate -> 409
  await recalcRating(reviewee);
  res.status(201).json(review);
}));

router.get('/user/:id', asyncHandler(async (req, res) => {
  res.json(await Review.find({ reviewee: req.params.id }).populate('reviewer', 'name avatar').sort('-createdAt'));
}));

module.exports = router;
