// importJsonData.js
require('dotenv').config();
const mongoose = require('mongoose');
const { Athlete } = require('./models/Athlete');
const { Assessment } = require('./models/Assessment');
const fs = require('fs');

async function importData(jsonFilePath) {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/athleteDB');
    console.log('Connected to MongoDB');

    // Read and parse JSON file
    const rawData = fs.readFileSync(jsonFilePath);
    const jsonData = JSON.parse(rawData);

    // Validate data structure
    if (!jsonData.athletes || !Array.isArray(jsonData.athletes)) {
      throw new Error('Invalid data format: missing or invalid athletes array');
    }

    // Process and validate athlete data
    for (const athlete of jsonData.athletes) {
      const query = { name: athlete.name }; // Find athlete by name
      const update = {
        dateOfBirth: athlete.dateOfBirth,
        height: athlete.height || { value: null, unit: 'in' },
        weight: athlete.weight || { value: null, unit: 'lbs' }
      };
      const options = { upsert: true, new: true }; // Insert if not found, return the updated document
      const updatedAthlete = await Athlete.findOneAndUpdate(query, update, options);
      console.log(`Processed athlete: ${updatedAthlete.name}`);
    }

    // Process assessments
    if (jsonData.assessments && Array.isArray(jsonData.assessments)) {
      for (const assessment of jsonData.assessments) {
        const athlete = await Athlete.findOne({ name: assessment.athleteName });
        if (!athlete) {
          console.warn(`Warning: No athlete found for assessment: ${assessment.athleteName}`);
          continue;
        }

        const query = {
          athlete: athlete._id,
          assessmentDate: assessment.assessmentDate
        }; // Find by athlete ID and assessment date
        const update = {
          movementScreen: {
            overheadSquat: assessment.movementScreen?.overheadSquat || {
              scoreLeft: null,
              scoreRight: null,
              comments: ''
            },
            hurdleStep: assessment.movementScreen?.hurdleStep || {
              scoreLeft: null,
              scoreRight: null,
              comments: ''
            },
            inlineLunge: assessment.movementScreen?.inlineLunge || {
              scoreLeft: null,
              scoreRight: null,
              comments: ''
            },
            apleyScratch: assessment.movementScreen?.apleyScratch || {
              scoreLeft: '',
              scoreRight: '',
              comments: ''
            }
          },
          performance: {
            verticalJump: assessment.performance?.verticalJump || {
              value: null,
              attempts: [],
              unit: 'in'
            },
            broadJump: assessment.performance?.broadJump || {
              value: null,
              attempts: [],
              unit: 'in'
            },
            tenYardSprint: assessment.performance?.tenYardSprint || {
              value: null,
              attempts: []
            },
            ohmbThrow: assessment.performance?.ohmbThrow || {
              value: null,
              attempts: [],
              unit: 'in'
            },
            mbShotput: assessment.performance?.mbShotput || {
              value: null,
              attempts: [],
              unit: 'in'
            },
            mbLeadArm: assessment.performance?.mbLeadArm || {
              value: null,
              attempts: [],
              unit: 'in'
            }
          },
          generalComments: assessment.generalComments || ''
        };
        const options = { upsert: true, new: true }; // Insert if not found, return the updated document
        const updatedAssessment = await Assessment.findOneAndUpdate(query, update, options);
        console.log(`Processed assessment for: ${athlete.name} on ${updatedAssessment.assessmentDate}`);
      }
    }

    console.log('Data import complete');
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

// Check if file path is provided as command line argument
const jsonFilePath = process.argv[2];
if (!jsonFilePath) {
  console.error('Please provide the path to your JSON file');
  process.exit(1);
}

importData(jsonFilePath);
