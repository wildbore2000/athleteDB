// models/Assessment.js
const mongoose = require('mongoose');

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
    movementScreen: {
      overheadSquat: {
        scoreLeft: { type: Number, min: 1, max: 3 },
        scoreRight: { type: Number, min: 1, max: 3 },
        comments: String
      },
      hurdleStep: {
        scoreLeft: { type: Number, min: 1, max: 3 },
        scoreRight: { type: Number, min: 1, max: 3 },
        comments: String
      },
      inlineLunge: {
        scoreLeft: { type: Number, min: 1, max: 3 },
        scoreRight: { type: Number, min: 1, max: 3 },
        comments: String
      },
      apleyScratch: {
        scoreLeft: { type: String, enum: ['pass', 'fail', ''] },
        scoreRight: { type: String, enum: ['pass', 'fail', ''] },
        comments: String
      },
      handGrip: {
        scoreLeft: { type: Number },
        scoreRight: { type: Number },
        comments: String
      }
        },
    performance: {
      verticalJump: {
        value: Number,
        attempts: [Number],
        unit: { type: String, default: 'in' }
      },
      broadJump: {
        value: Number,
        attempts: [Number],
        unit: { type: String, default: 'in' }
      },
      tenYardSprint: {
        value: Number,
        attempts: [Number]
      },
      ohmbThrow: {
        value: Number,
        attempts: [Number],
        unit: { type: String, default: 'mph' }
      },
      mbShotput: {
        value: Number,
        attempts: [Number],
        unit: { type: String, default: 'mph' }
      },
      mbLeadArm: {
        value: Number,
        attempts: [Number],
        unit: { type: String, default: 'mph' }
      },
      pullUps: {
        value: Number,
        attempts: [Number],
        unit: { type: String, default: 'reps' }
      },
      midThighPull: {
        value: Number,
        attempts: [Number],
        unit: { type: String, default: 'lbs' }
      }
    },
    generalComments: {
      type: String,
      trim: true
    }
  }, {
    timestamps: true
  });
  
const Assessment = mongoose.model('Assessment', assessmentSchema);
  
module.exports = { Assessment };