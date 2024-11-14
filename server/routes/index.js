// server/routes/index.js
const express = require('express');
const router = express.Router();

const athleteRoutes = require('./athleteRoutes');
const assessmentRoutes = require('./assessmentRoutes');

// Mount routes
router.use('/athletes', athleteRoutes);
router.use('/assessments', assessmentRoutes);

module.exports = router;