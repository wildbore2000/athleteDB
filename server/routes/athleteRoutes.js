
// server/routes/athleteRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAthletes,
  getAthlete,
  createAthlete,
  updateAthlete,
  deleteAthlete,
  getAthleteStats,
  getAthleteTrends
} = require('../controllers/athleteController');

// Base athlete CRUD routes
router.route('/')
  .get(getAthletes)
  .post(createAthlete);

router.route('/:id')
  .get(getAthlete)
  .put(updateAthlete)
  .delete(deleteAthlete);

// Analytics routes
router.get('/:id/statistics', getAthleteStats);
router.get('/:id/trends', getAthleteTrends);

module.exports = router;