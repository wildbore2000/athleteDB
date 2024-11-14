// server/routes/assessmentRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAssessments,
  getAssessment,
  createAssessment,
  updateAssessment,
  deleteAssessment
} = require('../controllers/assessmentController');

// Assessment CRUD routes
router.route('/')
  .get(getAssessments)
  .post(createAssessment);

router.route('/:id')
  .get(getAssessment)
  .put(updateAssessment)
  .delete(deleteAssessment);

module.exports = router;