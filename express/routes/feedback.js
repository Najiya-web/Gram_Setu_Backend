const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST: Feedback Save karne ke liye
router.post('/', async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    await newFeedback.save();
    res.status(201).json({ message: "Feedback Submitted Successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Admin ke liye saare feedbacks dekhne ke liye (Optional)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('reportId');
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
