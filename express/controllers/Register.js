const registerModel = require('../models/register');
const bcryptjs = require('bcryptjs');

const saveCitizen = async (req, res) => {
    try {
        const { aadhar, password, fullName, mobile, village, taluka, pincode } = req.body;

        // 1. Validation
        if (!aadhar || !password) {
            return res.status(400).json({ Message: "Aadhar and Password are required" });
        }

        // 2. Duplicate Check (Model mein 'aadhar' hai)
        const existingUser = await registerModel.findOne({ aadhar });
        if (existingUser) {
            return res.status(409).json({ Message: "User already exists" });
        }

        // 3. Password Hashing
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // 4. Save User (Manually specify fields to exclude confirmPassword)
        const newUser = new registerModel({ 
            fullName,
            mobile,
            aadhar,
            village,
            taluka,
            pincode,
            password: hashedPassword,
            role: 'CITIZEN' // 👈 Role manually set karein
        });
        
        await newUser.save();
        return res.status(201).json({ Message: "New user account created" });

    } catch (err) {
        console.error("Backend Error:", err); 
        return res.status(500).json({ Message: "Server Error", Detail: err.message });
    }
}

module.exports = saveCitizen;
