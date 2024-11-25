// In server/routes/measurementTypeRoutes.js
const express = require('express');

const router = express.Router();
const {
  getMeasurementTypes,
  createMeasurementType,
  updateMeasurementType,
  deleteMeasurementType,
  reinitializeDefaults
} = require('../controllers/measurementTypeController');

router.get('/', getMeasurementTypes);

router.route('/')
  .get(getMeasurementTypes)
  .post(createMeasurementType);

router.route('/:id')
  .put(updateMeasurementType)
  .delete(deleteMeasurementType);

router.post('/reinitialize-defaults', reinitializeDefaults);

module.exports = router;