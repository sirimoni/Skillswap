require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const SwapRequest = require('./models/SwapRequest');
const Review = require('./models/Review');
const recalcRating = require('./utils/rating');

// [name, location, offered ("Skill:level"), wanted]
const DATA = [
  ['Aarav', 'Bengaluru', ['Guitar:expert', 'Python:intermediate'], ['Spanish', 'Photoshop', 'Yoga']],
  ['Diya', 'Mysuru', ['Photoshop:expert', 'Figma:intermediate'], ['Guitar', 'Python']],
  ['Rohan', 'Chennai', ['Spanish:expert', 'Chess:intermediate'], ['Python', 'Public Speaking']],
  ['Meera', 'Pune', ['Yoga:expert', 'Cooking:intermediate'], ['Guitar', 'Figma']],
  ['Kabir', 'Hyderabad', ['React:expert', 'Python:expert'], ['Photography', 'Chess']],
  ['Ananya', 'Bengaluru', ['Photography:expert', 'Excel:intermediate'], ['React', 'Spanish']],
  ['Vikram', 'Delhi', ['Public Speaking:expert', 'Chess:expert'], ['Excel', 'Cooking']],
  ['Ishita', 'Mumbai', ['Figma:expert', 'Photoshop:intermediate'], ['React', 'Yoga']],
  ['Arjun', 'Kochi', ['Excel:expert', 'Cooking:beginner'], ['Guitar', 'Photography']],
  ['Sara', 'Goa', ['Cooking:expert', 'Spanish:intermediate'], ['Python', 'Public Speaking']],
  ['Neel', 'Bengaluru', ['Guitar:intermediate', 'Chess:beginner'], ['Figma', 'Excel']],
  ['Tara', 'Pune', ['Python:intermediate', 'Yoga:intermediate'], ['Photoshop', 'Cooking']],
  ['Yash', 'Jaipur', ['Photoshop:intermediate', 'Photography:intermediate'], ['Guitar', 'Chess']],
  ['Priya', 'Chennai', ['Spanish:expert', 'Public Speaking:intermediate'], ['Photography', 'Figma']],
  ['Dev', 'Bengaluru', ['React:intermediate', 'Excel:intermediate'], ['Spanish', 'Yoga']],
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany(), SwapRequest.deleteMany(), Review.deleteMany()]);
  const users = [];
  for (const [name, location, off, want] of DATA) {
    users.push(await User.create({
      name, location, email: `${name.toLowerCase()}@demo.com`, password: 'password123',
      bio: `Hi, I'm ${name}. Happy to trade skills over a coffee or a call.`,
      availability: ['Weekday evenings', 'Weekends'],
      skillsOffered: off.map((s) => ({ name: s.split(':')[0], level: s.split(':')[1] })),
      skillsWanted: want.map((name) => ({ name })),
    }));
  }
  const [aarav, diya, rohan, , kabir, ananya] = users;
  const done1 = await SwapRequest.create({ from: aarav._id, to: diya._id, skillOffered: 'Guitar', skillWanted: 'Photoshop', status: 'completed', completedBy: [aarav._id], message: 'Guitar basics for Photoshop tips?' });
  const done2 = await SwapRequest.create({ from: kabir._id, to: ananya._id, skillOffered: 'React', skillWanted: 'Photography', status: 'completed', completedBy: [kabir._id] });
  await SwapRequest.create({ from: rohan._id, to: aarav._id, skillOffered: 'Spanish', skillWanted: 'Python', status: 'pending', message: 'Let us swap Spanish for Python!' });
  await SwapRequest.create({ from: aarav._id, to: kabir._id, skillOffered: 'Guitar', skillWanted: 'Python', status: 'accepted', meetingLink: 'https://meet.google.com/demo' });
  await Review.insertMany([
    { swap: done1._id, reviewer: aarav._id, reviewee: diya._id, rating: 5, comment: 'Patient and very clear teacher.' },
    { swap: done1._id, reviewer: diya._id, reviewee: aarav._id, rating: 4, comment: 'Fun session, learned my first chords.' },
    { swap: done2._id, reviewer: kabir._id, reviewee: ananya._id, rating: 5, comment: 'Great photography tips.' },
  ]);
  for (const u of [aarav, diya, ananya]) await recalcRating(u._id);
  console.log('Seeded 15 users. Log in with aarav@demo.com / password123');
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
