const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken'); // Login ke liye zaroori hai

const app = express();
const JWT_SECRET = "GramSetu_Security_Key_2024"; // Kuch bhi secret string rakhein

app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 1. Cloudinary Configuration
cloudinary.config({ 
  cloud_name: 'dnd1uz2do', 
  api_key: '638671574514371', 
  api_secret: 'mGECELOnWOV617ZPznl8sCNHJ9k' 
});

const atlasURI = "mongodb+srv://najiyashaikhthinkify_db_user:0AR7PEBIsmAwYY9Y@cluster0.pugcnzi.mongodb.net/GramSetu?retryWrites=true&w=majority";

mongoose.connect(atlasURI)
  .then(() => console.log("Cloud MongoDB (Atlas) Connected!"))
  .catch(err => console.error("Atlas Connection Error:", err));

// --- SCHEMAS ---

// User Schema for Login
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'ROAD_DEPT'], default: 'ROAD_DEPT' }
});
const User = mongoose.model('User', UserSchema);

// Updated Report Schema
const ReportSchema = new mongoose.Schema({
  ticketId: String,
  village: String,
  description: String,
  severity: String,
  status: { type: String, default: 'Pending' }, // Pending, Under Review, In Progress, Fixed, Resolved
  image: String,        // Before Photo
  afterImage: String,   // After Photo (Repair Proof)
  contractor: String,
  adminRemarks: String,
  lat: Number,
  lng: Number,
  date: String
});
const Report = mongoose.model('Report', ReportSchema);

// --- ROUTES ---

// 1. LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password }); // Simple check (Production mein bcrypt use karein)
    if (!user) return res.status(401).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
    res.json({ token, role: user.role, username: user.username });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. POST REPORT (Citizen Side)
app.post('/api/reports', async (req, res) => {
  try {
    const { image, ...restOfData } = req.body;
    const uploadRes = await cloudinary.uploader.upload(image, { folder: 'gram_setu_reports' });

    const newReport = new Report({
      ...restOfData,
      image: uploadRes.secure_url 
    });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. GET ALL REPORTS
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find().sort({ date: -1 });
    res.json(reports);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. ADVANCED PATCH ROUTE (For Admin & Road Dept)
app.patch('/api/reports/:id', async (req, res) => {
  try {
    const { status, contractor, adminRemarks, afterImage } = req.body;
    let updateData = { status, contractor, adminRemarks };

    // Agar Road Dept ne 'After Image' (Base64) bheji hai toh Cloudinary par upload karein
    if (afterImage && afterImage.startsWith('data:image')) {
      const uploadRes = await cloudinary.uploader.upload(afterImage, { folder: 'repair_proofs' });
      updateData.afterImage = uploadRes.secure_url;
    }

    const updatedReport = await Report.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedReport);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(5000, () => console.log("Server running on port 5000"));
