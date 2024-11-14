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
  const assessment = await Assessment.findById(req.params.id)
    .populate('athlete');

  if (!assessment) {
    res.status(404);
    throw new Error('Assessment not found');
  }

  res.status(200).json({
    success: true,
    data: assessment
  });
});

exports.createAssessment = asyncHandler(async (req, res) => {
  const assessment = await Assessment.create(req.body);
  
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