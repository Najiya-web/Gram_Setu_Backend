const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    mobile: { type: Number, required: true },
    aadhar: { type: String, required: true, unique: true }, // String is better
    village: { type: String, required: true },
    taluka: { type: String, required: true },
    pincode: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'CITIZEN' } // 👈 Ye add karna zaroori hai
});

module.exports = mongoose.model('RegisterModel', registerSchema);
