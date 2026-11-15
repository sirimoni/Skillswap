const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const norm = require('../utils/normalizeSkill');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  avatar: String,
  bio: { type: String, maxlength: 300, default: '' },
  location: { type: String, default: '' },
  skillsOffered: [{ _id: false, name: String, level: { type: String, enum: ['beginner', 'intermediate', 'expert'], default: 'intermediate' } }],
  skillsWanted: [{ _id: false, name: String }],
  offeredNames: { type: [String], index: true }, // normalized, used for matching
  wantedNames: { type: [String], index: true },
  availability: [String],
  ratingAvg: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  this.offeredNames = [...new Set(this.skillsOffered.map((s) => norm(s.name)).filter(Boolean))];
  this.wantedNames = [...new Set(this.skillsWanted.map((s) => norm(s.name)).filter(Boolean))];
  if (!this.avatar) this.avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(this.name)}`;
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (plain) { return bcrypt.compare(plain, this.password); };
userSchema.set('toJSON', { transform: (_d, ret) => { delete ret.password; delete ret.__v; return ret; } });

module.exports = mongoose.model('User', userSchema);
