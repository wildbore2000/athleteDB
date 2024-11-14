// server/controllers/statisticsController.js
const { Assessment } = require('../models/Assessment');
const { Athlete } = require('../models/Athlete');
const asyncHandler = require('express-async-handler');

// Get dashboard statistics
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const [totalAthletes, totalAssessments, recentAssessments] = await Promise.all([
    Athlete.countDocuments(),
    Assessment.countDocuments(),
    Assessment.find()
      .sort({ assessmentDate: -1 })
      .limit(5)
      .populate('athlete', 'name')
  ]);

  // Get this month's assessments
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const assessmentsThisMonth = await Assessment.countDocuments({
    assessmentDate: { $gte: startOfMonth }
  });

  res.status(200).json({
    success: true,
    data: {
      totalAthletes,
      totalAssessments,
      assessmentsThisMonth,
      recentAssessments,
      averageAssessmentsPerAthlete: totalAthletes > 0 
        ? (totalAssessments / totalAthletes).toFixed(1) 
        : 0
    }
  });
});

// Get performance trends across all athletes
exports.getPerformanceTrends = asyncHandler(async (req, res) => {
  const { metric = 'verticalJump', timeframe = '1y' } = req.query;
  
  // Calculate date range based on timeframe
  const endDate = new Date();
  const startDate = new Date();
  
  switch(timeframe) {
    case '1m':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case '3m':
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case '6m':
      startDate.setMonth(startDate.getMonth() - 6);
      break;
    case '1y':
    default:
      startDate.setFullYear(startDate.getFullYear() - 1);
  }

  // Fetch assessments within date range
  const assessments = await Assessment.find({
    assessmentDate: { $gte: startDate, $lte: endDate },
    [`performance.${metric}.value`]: { $exists: true }
  })
  .select(`assessmentDate performance.${metric}.value`)
  .sort('assessmentDate');

  // Group data by month for trending
  const trendData = assessments.reduce((acc, assessment) => {
    const month = new Date(assessment.assessmentDate).toLocaleString('default', { month: 'short' });
    const value = assessment.performance[metric].value;
    
    if (!acc[month]) {
      acc[month] = { values: [], average: 0 };
    }
    
    acc[month].values.push(value);
    acc[month].average = acc[month].values.reduce((a, b) => a + b) / acc[month].values.length;
    
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    data: Object.entries(trendData).map(([month, data]) => ({
      month,
      average: Number(data.average.toFixed(2)),
      count: data.values.length
    }))
  });
});

// Get comparative statistics for athletes
exports.getComparativeStats = asyncHandler(async (req, res) => {
  const { athletes, metrics } = req.query;
  
  if (!athletes || !metrics) {
    res.status(400);
    throw new Error('Athletes and metrics parameters are required');
  }

  const athleteIds = athletes.split(',');
  const metricsList = metrics.split(',');

  // Get latest assessment for each athlete
  const latestAssessments = await Promise.all(
    athleteIds.map(async (athleteId) => {
      const assessment = await Assessment.findOne({ athlete: athleteId })
        .sort({ assessmentDate: -1 })
        .populate('athlete', 'name')
        .select(`athlete performance ${metricsList.join(' ')}`);
      return assessment;
    })
  );

  // Format comparative data
  const comparativeData = latestAssessments.map(assessment => {
    const data = {
      athleteId: assessment.athlete._id,
      athleteName: assessment.athlete.name
    };

    metricsList.forEach(metric => {
      if (assessment.performance && assessment.performance[metric]) {
        data[metric] = assessment.performance[metric].value;
      }
    });

    return data;
  });

  res.status(200).json({
    success: true,
    data: comparativeData
  });
});