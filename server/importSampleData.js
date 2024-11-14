// importSampleData.js
require('dotenv').config();
const mongoose = require('mongoose');
const { Athlete } = require('./models/Athlete');
const { Assessment } = require('./models/Assessment');

const sampleData = {
  "athletes": [
    {
      "name": "John Smith",
      "dateOfBirth": "2005-03-15",
      "height": {
        "value": 72,
        "unit": "in"
      },
      "weight": {
        "value": 180,
        "unit": "lbs"
      }
    },
    {
      "name": "Sarah Johnson",
      "dateOfBirth": "2006-07-22",
      "height": {
        "value": 66,
        "unit": "in"
      },
      "weight": {
        "value": 145,
        "unit": "lbs"
      }
    },
    {
      "name": "Michael Chen",
      "dateOfBirth": "2005-11-30",
      "height": {
        "value": 70,
        "unit": "in"
      },
      "weight": {
        "value": 165,
        "unit": "lbs"
      }
    }
  ],
  "assessments": [
    {
      "assessmentDate": "2024-02-15",
      "movementScreen": {
        "overheadSquat": {
          "scoreLeft": 2,
          "scoreRight": 2,
          "comments": "Slight forward lean"
        },
        "hurdleStep": {
          "scoreLeft": 3,
          "scoreRight": 2,
          "comments": "Right side compensation noted"
        },
        "inlineLunge": {
          "scoreLeft": 2,
          "scoreRight": 2,
          "comments": "Good control"
        },
        "apleyScratch": {
          "scoreLeft": "pass",
          "scoreRight": "pass",
          "comments": "Full ROM both sides"
        }
      },
      "performance": {
        "verticalJump": {
          "value": 28.5,
          "attempts": [27.5, 28.5, 28.0],
          "unit": "in"
        },
        "broadJump": {
          "value": 96,
          "attempts": [94, 96, 95],
          "unit": "in"
        },
        "tenYardSprint": {
          "value": 1.65,
          "attempts": [1.68, 1.65, 1.67]
        },
        "ohmbThrow": {
          "value": 186,
          "attempts": [180, 186, 184],
          "unit": "in"
        },
        "mbShotput": {
          "value": 210,
          "attempts": [205, 210, 208],
          "unit": "in"
        },
        "mbLeadArm": {
          "value": 168,
          "attempts": [165, 168, 166],
          "unit": "in"
        }
      },
      "generalComments": "Good overall performance. Focus on right hip mobility."
    },
    {
      "assessmentDate": "2024-03-01",
      "movementScreen": {
        "overheadSquat": {
          "scoreLeft": 3,
          "scoreRight": 3,
          "comments": "Improved form"
        },
        "hurdleStep": {
          "scoreLeft": 3,
          "scoreRight": 2,
          "comments": "Right side still showing compensation"
        },
        "inlineLunge": {
          "scoreLeft": 2,
          "scoreRight": 3,
          "comments": "Better control on right side"
        },
        "apleyScratch": {
          "scoreLeft": "pass",
          "scoreRight": "pass",
          "comments": "Maintained good ROM"
        }
      },
      "performance": {
        "verticalJump": {
          "value": 29.5,
          "attempts": [29.0, 29.5, 29.0],
          "unit": "in"
        },
        "broadJump": {
          "value": 98,
          "attempts": [96, 98, 97],
          "unit": "in"
        },
        "tenYardSprint": {
          "value": 1.62,
          "attempts": [1.64, 1.62, 1.63]
        },
        "ohmbThrow": {
          "value": 192,
          "attempts": [188, 192, 190],
          "unit": "in"
        },
        "mbShotput": {
          "value": 215,
          "attempts": [212, 215, 213],
          "unit": "in"
        },
        "mbLeadArm": {
          "value": 172,
          "attempts": [170, 172, 171],
          "unit": "in"
        }
      },
      "generalComments": "Shows improvement in most areas. Continue mobility work for right hip."
    }
  ]
};

async function importData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/athleteDB');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Athlete.deleteMany({});
    await Assessment.deleteMany({});
    console.log('Cleared existing data');

    // Import athletes
    const athletes = await Athlete.insertMany(sampleData.athletes);
    console.log('Imported athletes');

    // Create assessments for each athlete
    const assessmentPromises = athletes.map(async (athlete, index) => {
      const assessmentData = sampleData.assessments.map(assessment => ({
        ...assessment,
        athlete: athlete._id,
        assessmentDate: new Date(new Date(assessment.assessmentDate).setMonth(index)) // Offset dates for each athlete
      }));
      return Assessment.create(assessmentData);
    });

    await Promise.all(assessmentPromises);
    console.log('Imported assessments');

    console.log('Sample data import complete');
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

importData();