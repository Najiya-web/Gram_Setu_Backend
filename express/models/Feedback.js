const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  reportId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Report', 
    required: true 
  },
  citizenId: { type: String, required: true },
  rating: { type: Number, required: true }, // 1 to 5
  comment: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
