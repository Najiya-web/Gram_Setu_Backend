const mongoose = require('mongoose'); 

const ReportSchema = new mongoose.Schema({
  ticketId: String,
  citizenId: String,
  village: String,
  description: String,
  severity: String,
  status: { type: String, default: 'Pending' },
  image: String,        
  afterImage: String,   
  contractor: String,
  adminRemarks: String,
  lat: Number,
  lng: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
