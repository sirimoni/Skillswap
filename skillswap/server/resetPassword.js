require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const u = await User.findOne({ email: 'aarav@demo.com' });
  if (!u) { console.log('User not found'); process.exit(1); }
  u.password = 'newpass123';
  await u.save();
  console.log('Password updated for', u.email);
  process.exit(0);
})();