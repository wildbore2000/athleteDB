// models/Athlete.js
const mongoose = require('mongoose');

const athleteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
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
      default: 'in'
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
      default: 'lbs'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for age calculation
athleteSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Virtual to populate assessments
athleteSchema.virtual('assessments', {
  ref: 'Assessment',
  localField: '_id',
  foreignField: 'athlete'
});

const Athlete = mongoose.model('Athlete', athleteSchema);

module.exports = { Athlete };