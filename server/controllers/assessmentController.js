// controllers/assessmentController.js
const { Assessment } = require('../models/Assessment');
const asyncHandler = require('express-async-handler');

exports.getAssessments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skipIndex = (page - 1) * limit;
  
  const query = {};
  if (req.query.athleteId) {
    query.athlete = req.query.athleteId;
  }
  
  if (req.query.startDate && req.query.endDate) {
    query.assessmentDate = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }

  const total = await Assessment.countDocuments(query);
  const assessments = await Assessment.find(query)
    .populate('athlete', 'name')
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

exports.getAssessment = asyncHandler(async (req, res) => {
  console.log('Fetching assessment with ID:', req.params.id);
  
  const assessment = await Assessment.findById(req.params.id)
    .populate('athlete', 'name height weight dateOfBirth age team')
    .select('assessmentDate measurements generalComments athlete')
    .lean();

  if (!assessment) {
    console.log('Assessment not found');
    res.status(404);
    throw new Error('Assessment not found');
  }

  console.log('Raw assessment data:', JSON.stringify(assessment, null, 2));

  // Ensure measurements is always at least an empty object
  if (!assessment.measurements) {
    assessment.measurements = {};
  }

  // If measurements is a Map, convert it to an object
  if (assessment.measurements instanceof Map) {
    assessment.measurements = Object.fromEntries(assessment.measurements);
  }

  console.log('Processed assessment data:', JSON.stringify(assessment, null, 2));

  res.status(200).json({
    success: true,
    data: assessment
  });
});


exports.createAssessment = asyncHandler(async (req, res) => {
  console.log('Creating assessment with data:', JSON.stringify(req.body, null, 2));
  
  const assessment = await Assessment.create(req.body);
  
  console.log('Created assessment:', JSON.stringify(assessment, null, 2));
  
  res.status(201).json({
    success: true,
    data: assessment
  });
});

exports.updateAssessment = asyncHandler(async (req, res) => {
  const assessment = await Assessment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('athlete');

  if (!assessment) {
    res.status(404);
    throw new Error('Assessment not found');
  }

  res.status(200).json({
    success: true,
    data: assessment
  });
});

exports.deleteAssessment = asyncHandler(async (req, res) => {
  const assessment = await Assessment.findById(req.params.id);

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