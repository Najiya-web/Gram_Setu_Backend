const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  postedBy: { type: String, required: true }, // Admin ID ya Dept ID
  targetPincode: { type: String }, // Specific area ke liye alert
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', announcementSchema);
