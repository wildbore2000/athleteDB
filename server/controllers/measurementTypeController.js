// In server/controllers/measurementTypeController.js

const { MeasurementType } = require('../models/MeasurementType');
const asyncHandler = require('express-async-handler');

// Get all measurement types
exports.getMeasurementTypes = asyncHandler(async (req, res) => {
  const { category, isActive } = req.query;
  
  const query = {};
  if (category) query.category = category;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const measurements = await MeasurementType.find(query).sort('category name');

  res.status(200).json({
    success: true,
    data: measurements
  });
});

// Create new measurement type
exports.createMeasurementType = asyncHandler(async (req, res) => {
  const measurement = await MeasurementType.create(req.body);
  
  res.status(201).json({
    success: true,
    data: measurement
  });
});

// Update measurement type
exports.updateMeasurementType = asyncHandler(async (req, res) => {
  const measurement = await MeasurementType.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!measurement) {
    res.status(404);
    throw new Error('Measurement type not found');
  }

  res.status(200).json({
    success: true,
    data: measurement
  });
});

// Delete measurement type
exports.deleteMeasurementType = asyncHandler(async (req, res) => {
  const measurement = await MeasurementType.findById(req.params.id);

  if (!measurement) {
    res.status(404);
    throw new Error('Measurement type not found');
  }

  await measurement.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// Reinitialize default measurements
exports.reinitializeDefaults = asyncHandler(async (req, res) => {
  await MeasurementType.initializeDefaults();
  
  res.status(200).json({
    success: true,
    message: 'Default measurements reinitialized'
  });
});