// server/routes/index.js

const express = require('express');
const router = express.Router();

const athleteRoutes = require('./athleteRoutes');
const assessmentRoutes = require('./assessmentRoutes');
const measurementTypeRoutes = require('./measurementTypeRoutes');

// Mount routes
router.use('/athletes', athleteRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/measurement-types', measurementTypeRoutes);  // Add this line

module.exports = router;