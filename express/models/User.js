const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'ROAD_DEPT'], default: 'ROAD_DEPT' }
});

module.exports = mongoose.model('User', UserSchema);
