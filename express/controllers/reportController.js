const Report = require('../models/Report');
const cloudinary = require('cloudinary').v2;
const StatusHistory = require('../models/StatusHistory'); // Import karein

exports.createReport = async (req, res) => {
  try {
    const { image, ...restOfData } = req.body;
    const uploadRes = await cloudinary.uploader.upload(image, { folder: 'gram_setu_reports' });
    const newReport = new Report({ ...restOfData, image: uploadRes.secure_url });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ date: -1 });
    res.json(reports);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateReport = async (req, res) => {
  try {
    const { status, contractor, adminRemarks, afterImage } = req.body;
    let updateData = { status, contractor, adminRemarks };

    if (afterImage && afterImage.startsWith('data:image')) {
      const uploadRes = await cloudinary.uploader.upload(afterImage, { folder: 'repair_proofs' });
      updateData.afterImage = uploadRes.secure_url;
    }

    const updatedReport = await Report.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedReport);
  } catch (err) { res.status(500).json({ error: err.message }); }
};


// 🚀 Naya Function: Citizen ki apni reports fetch karne ke liye
exports.getMyReports = async (req, res) => {
  try {
    const { id } = req.params; // Frontend se aane wali citizenId (Aadhar/Username)

    if (!id) {
      return res.status(400).json({ message: "User ID missing!" });
    }

    // Database mein wahi reports dhundo jinki citizenId match kare
    const reports = await Report.find({ citizenId: id }).sort({ date: -1 });

    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user reports: " + err.message });
  }
};




exports.updateReport = async (req, res) => {
  try {
    const { status, contractor, adminRemarks, afterImage, changedBy, role } = req.body;
    
    // 1. Report update karein
    const updatedReport = await Report.findByIdAndUpdate(req.params.id, { status, contractor, adminRemarks, afterImage }, { new: true });

    // 2. 🚀 AUTO-HISTORY LOG: History mein entry save karein
    const historyEntry = new StatusHistory({
      reportId: req.params.id,
      status: status,
      changedBy: changedBy || "System", 
      role: role || "ADMIN",
      remarks: adminRemarks || "Status updated"
    });
    await historyEntry.save();

    res.json(updatedReport);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
