const registerModel = require('../models/register'); // For Citizens
const userModel = require('../models/User');   // For Admin/Road Dept
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        let user;
        if (role === 'CITIZEN') {
            // Search in registers collection
            user = await registerModel.findOne({ aadhar: username, role: role });
        } else {
            // 🚀 Search in 'users' collection (Admin/Road Dept)
            user = await userModel.findOne({ username: username, role: role });
        }
        
        if (!user) {
            return res.status(404).json({ message: "User not found in " + (role === 'CITIZEN' ? "Registers" : "Users") });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid Password!" });

        const token = jwt.sign({ id: user._id, role: user.role }, "GramSetu_Secret_Key_2024", { expiresIn: '24h' });

        res.status(200).json({
            token: token,
            role: user.role,
            userId: user.aadhar || user.username,
            userName: user.fullName || user.username
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};
