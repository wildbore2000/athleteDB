// models/AthleteAssessment.js
const mongoose = require('mongoose');

// Regular movement screen schema (1-3 scale)
const movementScreenSchema = new mongoose.Schema({
  scoreLeft: {
    type: Number,
    min: 1,
    max: 3,
    required: false
  },
  scoreRight: {
    type: Number,
    min: 1,
    max: 3,
    required: false
  },
  comments: {
    type: String,
    trim: true,
    required: false
  }
});

// Pass/Fail schema specifically for Apley's test
const apleyScreenSchema = new mongoose.Schema({
  scoreLeft: {
    type: String,
    enum: ['pass', 'fail', ''],
    default: '',
    required: false
  },
  scoreRight: {
    type: String,
    enum: ['pass', 'fail', ''],
    default: '',
    required: false
  },
  comments: {
    type: String,
    trim: true,
    required: false
  }
});

// Performance measurement schema for distances/heights
const performanceMeasurementSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: false
  },
  attempt1: {
    type: Number,
    required: false
  },
  attempt2: {
    type: Number,
    required: false
  },
  attempt3: {
    type: Number,
    required: false
  },
  unit: {
    type: String,
    enum: ['in', 'cm'],
    default: 'in',
    required: false
  }
});

// Sprint measurement schema (no unit field needed)
const sprintMeasurementSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: false
  },
  attempt1: {
    type: Number,
    required: false
  },
  attempt2: {
    type: Number,
    required: false
  },
  attempt3: {
    type: Number,
    required: false
  }
});

const athleteAssessmentSchema = new mongoose.Schema({
  // Required fields
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  assessmentDate: {
    type: Date,
    required: [true, 'Assessment date is required'],
    default: Date.now
  },
  
  // Optional fields
  dateOfBirth: {
    type: Date,
    required: false
  },
  age: {
    type: Number,
    required: false
  },
  height: {
    value: {
      type: Number,
      required: false
    },
    unit: {
      type: String,
      enum: ['in', 'cm'],
      default: 'in',
      required: false
    }
  },
  weight: {
    value: {
      type: Number,
      required: false
    },
    unit: {
      type: String,
      enum: ['lbs', 'kg'],
      default: 'lbs',
      required: false
    }
  },
  movementScreen: {
    type: {
      overheadsquat: movementScreenSchema,
      hurdlestep: movementScreenSchema,
      inlinelunge: movementScreenSchema,
      apleysScratch: apleyScreenSchema
    },
    required: false
  },
  performanceMeasurements: {
    type: {
      verticalJump: performanceMeasurementSchema,
      broadJump: performanceMeasurementSchema,
      tenYardSprint: sprintMeasurementSchema,
      ohmbThrow: performanceMeasurementSchema,     // Added OH MB Throw
      mbShotput: performanceMeasurementSchema,     // Added MB Shotput Throw
      mbLeadArm: performanceMeasurementSchema      // Added MB Lead Arm Toss
    },
    required: false
  },
  generalComments: {
    type: String,
    trim: true,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AthleteAssessment', athleteAssessmentSchema);