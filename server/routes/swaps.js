const router = require('express').Router();
const SwapRequest = require('../models/SwapRequest');
const Review = require('../models/Review');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');

router.use(protect);
const fail = (res, code, message) => res.status(code).json({ message });
const POP = 'name avatar ratingAvg';

router.post('/', asyncHandler(async (req, res) => {
  const { to, skillOffered, skillWanted, message, proposedTime, mode } = req.body;
  if (!to || !skillOffered || !skillWanted) return fail(res, 400, 'Choose both skills for the swap');
  if (String(to) === String(req.user._id)) return fail(res, 400, 'You cannot swap with yourself');
  if (!(await User.exists({ _id: to }))) return fail(res, 404, 'User not found');
  const dup = await SwapRequest.findOne({ from: req.user._id, to, skillOffered, skillWanted, status: 'pending' });
  if (dup) return fail(res, 409, 'You already sent this request');
  const swap = await SwapRequest.create({ from: req.user._id, to, skillOffered, skillWanted, message, proposedTime: proposedTime || undefined, mode });
  res.status(201).json(swap);
}));

router.get('/', asyncHandler(async (req, res) => {
  const me = req.user._id, { type = 'all', status } = req.query;
  const filter = type === 'incoming' ? { to: me } : type === 'outgoing' ? { from: me } : { $or: [{ from: me }, { to: me }] };
  if (status) filter.status = status;
  const swaps = await SwapRequest.find(filter).populate('from', POP).populate('to', POP).sort('-createdAt').lean();
  const mine = await Review.find({ reviewer: me, swap: { $in: swaps.map((s) => s._id) } }).select('swap');
  const reviewed = new Set(mine.map((r) => String(r.swap)));
  res.json(swaps.map((s) => ({ ...s, reviewedByMe: reviewed.has(String(s._id)) })));
}));

// Generic status transition with authorization checks
const transition = (path, { who, from, to, extra }) =>
  router.patch(path, asyncHandler(async (req, res) => {
    const s = await SwapRequest.findById(req.params.id);
    if (!s) return fail(res, 404, 'Swap not found');
    const me = String(req.user._id);
    const allowed = who === 'to' ? String(s.to) === me : who === 'from' ? String(s.from) === me : [String(s.from), String(s.to)].includes(me);
    if (!allowed) return fail(res, 403, 'You are not allowed to do this');
    if (s.status !== from) return fail(res, 409, `Swap must be ${from}, but it is ${s.status}`);
    s.status = to;
    if (extra) extra(s, req);
    await s.save();
    res.json(s);
  }));

transition('/:id/accept', { who: 'to', from: 'pending', to: 'accepted', extra: (s, req) => { if (req.body.meetingLink) s.meetingLink = req.body.meetingLink; } });
transition('/:id/reject', { who: 'to', from: 'pending', to: 'rejected' });
transition('/:id/cancel', { who: 'from', from: 'pending', to: 'cancelled' });
transition('/:id/complete', { who: 'either', from: 'accepted', to: 'completed', extra: (s, req) => s.completedBy.push(req.user._id) });

module.exports = router;
