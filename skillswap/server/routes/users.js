const router = require('express').Router();
const User = require('../models/User');
const Review = require('../models/Review');
const norm = require('../utils/normalizeSkill');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Browse: ?q=name &skill=python &page=1
router.get('/', asyncHandler(async (req, res) => {
  const { q, skill } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1), limit = 12;
  const filter = {};
  if (q) filter.name = new RegExp(escapeRe(q), 'i');
  if (skill) filter.offeredNames = norm(skill);
  const [users, total] = await Promise.all([
    User.find(filter).select('-email').sort('-ratingAvg -createdAt').skip((page - 1) * limit).limit(limit),
    User.countDocuments(filter),
  ]);
  res.json({ users, total, pages: Math.ceil(total / limit) || 1 });
}));

router.put('/me', protect, asyncHandler(async (req, res) => {
  const u = req.user;
  const { name, bio, location, availability, skillsOffered, skillsWanted } = req.body;
  if (name !== undefined) u.name = name;
  if (bio !== undefined) u.bio = bio;
  if (location !== undefined) u.location = location;
  if (Array.isArray(availability)) u.availability = availability;
  const clean = (arr) => (arr || []).filter((s) => s && norm(s.name));
  if (Array.isArray(skillsOffered)) u.skillsOffered = clean(skillsOffered).map((s) => ({ name: s.name.trim(), level: s.level || 'intermediate' }));
  if (Array.isArray(skillsWanted)) u.skillsWanted = clean(skillsWanted).map((s) => ({ name: s.name.trim() }));
  await u.save(); // pre-save hook syncs offeredNames / wantedNames
  res.json(u);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-email');
  if (!user) return res.status(404).json({ message: 'User not found' });
  const reviews = await Review.find({ reviewee: user._id }).populate('reviewer', 'name avatar').sort('-createdAt').limit(10);
  res.json({ user, reviews });
}));

module.exports = router;
