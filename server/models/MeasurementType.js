// server/models/MeasurementType.js
const mongoose = require('mongoose');

const measurementTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['movementScreen', 'performance']
  },
  type: {
    type: String,
    required: true,
    enum: ['score', 'passfail', 'strength', 'distance', 'time', 'speed', 'reps']
  },
  unit: {
    type: String,
    required: function() {
      return ['distance', 'speed', 'strength'].includes(this.type);
    }
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  config: {
    hasSides: {
      type: Boolean,
      default: true
    },
    hasAttempts: {
      type: Boolean,
      default: function() {
        return this.category === 'performance';
      }
    },
    maxAttempts: {
      type: Number,
      default: 3
    },
    minValue: Number,
    maxValue: Number
  }
}, {
  timestamps: true
});

// Function to initialize default measurements
// Update this in server/models/MeasurementType.js
measurementTypeSchema.statics.initializeDefaults = async function() {
    const defaults = [
      // Movement Screen defaults
      {
        name: 'Overhead Squat',
        key: 'overheadSquat',
        category: 'movementScreen',
        type: 'score',
        config: {
          hasSides: true,
          minValue: 1,
          maxValue: 3
        },
        isDefault: true
      },
      {
        name: 'Hurdle Step',
        key: 'hurdleStep',
        category: 'movementScreen',
        type: 'score',
        config: {
          hasSides: true,
          minValue: 1,
          maxValue: 3
        },
        isDefault: true
      },
      {
        name: 'Inline Lunge',
        key: 'inlineLunge',
        category: 'movementScreen',
        type: 'score',
        config: {
          hasSides: true,
          minValue: 1,
          maxValue: 3
        },
        isDefault: true
      },
      {
        name: "Apley's Scratch",
        key: 'apleyScratch',
        category: 'movementScreen',
        type: 'passfail',
        config: {
          hasSides: true
        },
        isDefault: true
      },
      {
        name: 'Hand Grip',
        key: 'handGrip',
        category: 'movementScreen',
        type: 'strength',
        unit: 'lbs',
        config: {
          hasSides: true
        },
        isDefault: true
      },
      
      // Performance defaults
      {
        name: 'Vertical Jump',
        key: 'verticalJump',
        category: 'performance',
        type: 'distance',
        unit: 'in',
        config: {
          hasSides: false,
          hasAttempts: true,
          maxAttempts: 3
        },
        isDefault: true
      },
      {
        name: 'Broad Jump',
        key: 'broadJump',
        category: 'performance',
        type: 'distance',
        unit: 'in',
        config: {
          hasSides: false,
          hasAttempts: true,
          maxAttempts: 3
        },
        isDefault: true
      },
      {
        name: '10-Yard Sprint',
        key: 'tenYardSprint',
        category: 'performance',
        type: 'time',
        config: {
          hasSides: false,
          hasAttempts: true,
          maxAttempts: 3
        },
        isDefault: true
      },
    ];
  
    for (const measurement of defaults) {
      await this.findOneAndUpdate(
        { key: measurement.key },
        measurement,
        { upsert: true, new: true }
      );
    }
  };
const MeasurementType = mongoose.model('MeasurementType', measurementTypeSchema);

module.exports = { MeasurementType };