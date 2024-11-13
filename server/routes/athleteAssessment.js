// server/routes/athleteAssessment.js
const express = require('express');
const router = express.Router();
const {
  getAssessments,
  getAssessment,
  createAssessment,
  updateAssessment,
  deleteAssessment
} = require('../controllers/athleteAssessmentController');

router.route('/')
  .get(getAssessments)
  .post(createAssessment);

router.route('/:id')
  .get(getAssessment)
  .put(updateAssessment)
  .delete(deleteAssessment);

module.exports = router;