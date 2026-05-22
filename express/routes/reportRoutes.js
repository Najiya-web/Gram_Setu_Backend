const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// 1. New Report create karne ke liye
router.post('/', reportController.createReport);

// 2. Admin/Road Dept ke liye saari reports dekhne ke liye
router.get('/', reportController.getAllReports);

// 🚀 3. Naya Route: Sirf Login Citizen ki apni reports ke liye
router.get('/my-reports/:id', reportController.getMyReports);

// 4. Report status update karne ke liye (Patch method)
router.patch('/:id', reportController.updateReport);

// routes/reportRoutes.js
router.get('/history/:id', async (req, res) => {
  try {
    const history = await (require('../models/StatusHistory')).find({ reportId: req.params.id }).sort({ timestamp: -1 });
    res.json(history);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
