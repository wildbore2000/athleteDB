const mongoose = require('mongoose');

// Define measurement value schema - handles all types of measurements
const measurementValueSchema = new mongoose.Schema({
  value: mongoose.Schema.Types.Mixed,  // Can store numbers or strings (for pass/fail)
  attempts: [mongoose.Schema.Types.Mixed],  // Array of attempts if applicable
  scoreLeft: mongoose.Schema.Types.Mixed,   // For measurements with sides
  scoreRight: mongoose.Schema.Types.Mixed,  // For measurements with sides
  comments: String
}, { _id: false });

const assessmentSchema = new mongoose.Schema({
  athlete: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Athlete',
    required: true
  },
  assessmentDate: {
    type: Date,
    required: [true, 'Assessment date is required'],
    default: Date.now
  },
  measurements: {
    type: Map,
    of: measurementValueSchema
  },
  generalComments: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }, // Add this to ensure virtuals are included
  toObject: { virtuals: true } // Add this to ensure virtuals are included
});

// Helper method to add a measurement
assessmentSchema.methods.addMeasurement = function(key, data) {
  if (!this.measurements) {
    this.measurements = new Map();
  }
  this.measurements.set(key, data);
};

// Helper method to get a measurement
assessmentSchema.methods.getMeasurement = function(key) {
  return this.measurements ? this.measurements.get(key) : null;
};

// Pre-save middleware to ensure measurements align with MeasurementType schema
assessmentSchema.pre('save', async function(next) {
  console.log('Pre-save measurements:', this.measurements);
  try {
    const MeasurementType = mongoose.model('MeasurementType');
    const measurements = Array.from(this.measurements.entries());
    
    for (const [key, value] of measurements) {
      const measurementType = await MeasurementType.findOne({ key });
      if (!measurementType) {
        throw new Error(`Invalid measurement type: ${key}`);
      }
      
      // Validate based on measurement type configuration
      if (measurementType.type === 'score' && (value.scoreLeft || value.scoreRight)) {
        if (value.scoreLeft && (value.scoreLeft < 1 || value.scoreLeft > 3)) {
          throw new Error(`Invalid score for ${key}: scores must be between 1 and 3`);
        }
        if (value.scoreRight && (value.scoreRight < 1 || value.scoreRight > 3)) {
          throw new Error(`Invalid score for ${key}: scores must be between 1 and 3`);
        }
      }
      
      if (measurementType.type === 'passfail' && (value.scoreLeft || value.scoreRight)) {
        const validValues = ['pass', 'fail', ''];
        if (value.scoreLeft && !validValues.includes(value.scoreLeft)) {
          throw new Error(`Invalid value for ${key}: must be pass or fail`);
        }
        if (value.scoreRight && !validValues.includes(value.scoreRight)) {
          throw new Error(`Invalid value for ${key}: must be pass or fail`);
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = { Assessment };