// server/controllers/athleteController.js
const { Athlete } = require('../models/Athlete');
const { Assessment } = require('../models/Assessment');
const asyncHandler = require('express-async-handler');

// @desc    Get all athletes
// @route   GET /api/athletes
exports.getAthletes = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skipIndex = (page - 1) * limit;
  
  const query = {};
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };
  }

  const total = await Athlete.countDocuments(query);
  const athletes = await Athlete.find(query)
    .populate({
      path: 'assessments',
      select: '_id' // Only populate IDs to keep response size small
    })
    .sort({ name: 1 })
    .limit(limit)
    .skip(skipIndex);

  res.status(200).json({
    success: true,
    count: athletes.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: athletes
  });
});

// @desc    Get single athlete
// @route   GET /api/athletes/:id
exports.getAthlete = asyncHandler(async (req, res) => {
  const athlete = await Athlete.findById(req.params.id)
    .populate('assessments');

  if (!athlete) {
    res.status(404);
    throw new Error('Athlete not found');
  }

  res.status(200).json({
    success: true,
    data: athlete
  });
});

// @desc    Create athlete
// @route   POST /api/athletes
exports.createAthlete = asyncHandler(async (req, res) => {
  const athlete = await Athlete.create(req.body);
  
  res.status(201).json({
    success: true,
    data: athlete
  });
});

// @desc    Update athlete
// @route   PUT /api/athletes/:id
exports.updateAthlete = asyncHandler(async (req, res) => {
  const athlete = await Athlete.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!athlete) {
    res.status(404);
    throw new Error('Athlete not found');
  }

  res.status(200).json({
    success: true,
    data: athlete
  });
});

// @desc    Delete athlete
// @route   DELETE /api/athletes/:id
exports.deleteAthlete = asyncHandler(async (req, res) => {
  const athlete = await Athlete.findById(req.params.id);

  if (!athlete) {
    res.status(404);
    throw new Error('Athlete not found');
  }

  // Delete associated assessments
  await Assessment.deleteMany({ athlete: req.params.id });

  await athlete.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get athlete statistics
// @route   GET /api/athletes/:id/statistics
exports.getAthleteStats = asyncHandler(async (req, res) => {
  const athlete = await Athlete.findById(req.params.id);

  if (!athlete) {
    res.status(404);
    throw new Error('Athlete not found');
  }

  const assessments = await Assessment.find({ athlete: req.params.id })
    .sort({ assessmentDate: -1 });

  const stats = {
    totalAssessments: assessments.length,
    latestAssessment: assessments[0],
    performanceHistory: assessments.map(a => ({
      date: a.assessmentDate,
      verticalJump: a.performance?.verticalJump?.value,
      broadJump: a.performance?.broadJump?.value,
      tenYardSprint: a.performance?.tenYardSprint?.value,
      ohmbThrow: a.performance?.ohmbThrow?.value,
      mbShotput: a.performance?.mbShotput?.value,
      mbLeadArm: a.performance?.mbLeadArm?.value
    }))
  };

  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Get athlete performance trends
// @route   GET /api/athletes/:id/trends
exports.getAthleteTrends = asyncHandler(async (req, res) => {
  const { metric } = req.query;
  if (!metric) {
    res.status(400);
    throw new Error('Metric parameter is required');
  }

  const athlete = await Athlete.findById(req.params.id);
  if (!athlete) {
    res.status(404);
    throw new Error('Athlete not found');
  }

  const assessments = await Assessment.find({ 
    athlete: req.params.id,
    [`performance.${metric}.value`]: { $exists: true }
  })
  .sort('assessmentDate')
  .select(`assessmentDate performance.${metric}`);

  const trends = assessments.map(a => ({
    date: a.assessmentDate,
    value: a.performance[metric].value
  }));

  res.status(200).json({
    success: true,
    data: trends
  });
});