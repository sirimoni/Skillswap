const router = require('express').Router();
const User = require('../models/User');
const SwapRequest = require('../models/SwapRequest');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');

const intersect = (a, b) => a.filter((x) => b.includes(x));

// GET /api/matches?mutualOnly=true&hideActive=true&page=1&limit=12
router.get('/', protect, asyncHandler(async (req, res) => {
  const me = req.user;
  const offered = me.offeredNames, wanted = me.wantedNames;
  if (!offered.length && !wanted.length) return res.json({ matches: [], total: 0 });

  const exclude = [me._id];
  if (req.query.hideActive === 'true') {
    const active = await SwapRequest.find({ status: { $in: ['pending', 'accepted'] }, $or: [{ from: me._id }, { to: me._id }] });
    active.forEach((s) => exclude.push(s.from, s.to));
  }

  // 1. Candidates: they teach what I want OR they want what I teach
  const candidates = await User.find({
    _id: { $nin: exclude },
    $or: [{ offeredNames: { $in: wanted } }, { wantedNames: { $in: offered } }],
  }).select('-email');

  // 2. Score each candidate
  let matches = candidates.map((v) => {
    const theyCanTeachMe = intersect(v.offeredNames, wanted);
    const iCanTeachThem = intersect(offered, v.wantedNames);
    const isMutual = theyCanTeachMe.length > 0 && iCanTeachThem.length > 0;
    const score = (isMutual ? 100 : 0) + theyCanTeachMe.length * 10 + iCanTeachThem.length * 10 + v.ratingAvg * 2;
    return { user: v, theyCanTeachMe, iCanTeachThem, isMutual, score };
  });

  if (req.query.mutualOnly === 'true') matches = matches.filter((m) => m.isMutual);
  matches.sort((a, b) => b.score - a.score);

  const total = matches.length;
  const limit = parseInt(req.query.limit) || 50, page = Math.max(parseInt(req.query.page) || 1, 1);
  res.json({ matches: matches.slice((page - 1) * limit, page * limit), total });
}));

module.exports = router;
