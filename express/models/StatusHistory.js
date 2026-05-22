const mongoose = require('mongoose');

const StatusHistorySchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
  status: { type: String, required: true }, // Naya status (e.g., 'Fixed')
  changedBy: { type: String, required: true }, // Kisne badla (Admin ya Road Dept ka ID)
  role: { type: String }, // 'ADMIN' ya 'ROAD_DEPT'
  remarks: { type: String }, // Kuch extra info
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StatusHistory', StatusHistorySchema);
