// server/models/AthleteAssessment.js
const mongoose = require('mongoose');

const movementScreenSchema = new mongoose.Schema({
  score: {
    type: Number,
    min: 1,
    max: 3,
    required: true
  },
  comments: {
    type: String,
    trim: true
  }
});

const athleteAssessmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  assessmentDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  height: {
    value: Number,
    unit: {
      type: String,
      enum: ['in', 'cm'],
      default: 'in'
    }
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['lbs', 'kg'],
      default: 'lbs'
    }
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  movementScreen: {
    overheadsquat: movementScreenSchema,
    hurdlestep: movementScreenSchema,
    inlinelunge: movementScreenSchema,
    apleysScratch: movementScreenSchema
  },
  performanceMeasurements: {
    verticalJump: {
      value: Number,
      unit: {
        type: String,
        enum: ['in', 'cm'],
        default: 'in'
      }
    },
    broadJump: {
      value: Number,
      unit: {
        type: String,
        enum: ['in', 'cm'],
        default: 'in'
      }
    },
    tenYardSprint: {
      value: Number, // Time in seconds
    }
  },
  generalComments: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AthleteAssessment', athleteAssessmentSchema);