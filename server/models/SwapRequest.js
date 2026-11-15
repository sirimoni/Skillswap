const mongoose = require('mongoose');
const ref = { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true };

const swapSchema = new mongoose.Schema({
  from: ref,
  to: ref,
  skillOffered: { type: String, required: true }, // what "from" teaches
  skillWanted: { type: String, required: true },  // what "from" wants to learn from "to"
  message: { type: String, maxlength: 500, default: '' },
  proposedTime: Date,
  mode: { type: String, enum: ['online', 'in-person'], default: 'online' },
  meetingLink: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'], default: 'pending' },
  completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('SwapRequest', swapSchema);
