// server/controllers/athleteAssessmentController.js
const AthleteAssessment = require('../models/AthleteAssessment');
const asyncHandler = require('express-async-handler');

// @desc    Get all athlete assessments
// @route   GET /api/assessments
exports.getAssessments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skipIndex = (page - 1) * limit;
  
  const query = {};
  
  // Add search functionality
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };
  }
  
  // Add date range filter
  if (req.query.startDate && req.query.endDate) {
    query.assessmentDate = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }

  const total = await AthleteAssessment.countDocuments(query);
  const assessments = await AthleteAssessment.find(query)
    .sort({ assessmentDate: -1 })
    .limit(limit)
    .skip(skipIndex);

  res.status(200).json({
    success: true,
    count: assessments.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: assessments
  });
});

// @desc    Get single athlete assessment
// @route   GET /api/assessments/:id
exports.getAssessment = asyncHandler(async (req, res) => {
  const assessment = await AthleteAssessment.findById(req.params.id);

  if (!assessment) {
    res.status(404);
    throw new Error('Assessment not found');
  }

  res.status(200).json({
    success: true,
    data: assessment
  });
});

// @desc    Create athlete assessment
// @route   POST /api/assessments
exports.createAssessment = asyncHandler(async (req, res) => {
  const assessment = await AthleteAssessment.create(req.body);

  res.status(201).json({
    success: true,
    data: assessment
  });
});

// @desc    Update athlete assessment
// @route   PUT /api/assessments/:id
exports.updateAssessment = asyncHandler(async (req, res) => {
  let assessment = await AthleteAssessment.findById(req.params.id);

  if (!assessment) {
    res.status(404);
    throw new Error('Assessment not found');
  }

  assessment = await AthleteAssessment.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: assessment
  });
});

// @desc    Delete athlete assessment
// @route   DELETE /api/assessments/:id
exports.deleteAssessment = asyncHandler(async (req, res) => {
  const assessment = await AthleteAssessment.findById(req.params.id);

  if (!assessment) {
    res.status(404);
    throw new Error('Assessment not found');
  }

  await assessment.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});