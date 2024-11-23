// importSampleData.js
require('dotenv').config();
const mongoose = require('mongoose');
const { Athlete } = require('./models/Athlete');
const { Assessment } = require('./models/Assessment');

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomFloat = (min, max, decimals = 2) => +(Math.random() * (max - min) + min).toFixed(decimals);

const generateRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateAthleteData = () => {
  const maleFirstNames = ['James', 'William', 'Michael', 'David', 'Robert', 'John', 'Thomas', 'Daniel', 'Christopher', 'Matthew'];
  const femaleFirstNames = ['Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

  const isMale = Math.random() < 0.5;
  const firstName = isMale ? maleFirstNames[randomInt(0, maleFirstNames.length - 1)] : femaleFirstNames[randomInt(0, femaleFirstNames.length - 1)];
  const lastName = lastNames[randomInt(0, lastNames.length - 1)];

  const heightInches = isMale ? randomInt(68, 76) : randomInt(62, 70);
  const weightLbs = isMale ? randomInt(160, 200) : randomInt(130, 170);

  const now = new Date();
  const minAge = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
  const maxAge = new Date(now.getFullYear() - 14, now.getMonth(), now.getDate());
  const birthDate = generateRandomDate(minAge, maxAge);

  return {
    name: `${firstName} ${lastName}`,
    dateOfBirth: birthDate.toISOString().split('T')[0],
    height: {
      value: heightInches,
      unit: 'in',
    },
    weight: {
      value: weightLbs,
      unit: 'lbs',
    },
  };
};

const generateAssessment = (athleteId, date) => {
  const generateScore = () => randomInt(1, 3);
  const generateAttempts = (baseValue, range) => {
    const attempts = [baseValue];
    attempts.push(baseValue + randomFloat(-range, range));
    attempts.push(baseValue + randomFloat(-range, range));
    return attempts.map(v => +v.toFixed(2));
  };

  const verticalJump = randomFloat(24, 32, 1);
  const broadJump = randomInt(85, 105);
  const sprint = randomFloat(1.55, 1.85, 2);
  const ohmbThrow = randomInt(170, 200);
  const mbShotput = randomInt(190, 225);
  const mbLeadArm = randomInt(155, 185);

  return {
    athlete: athleteId,
    assessmentDate: date.toISOString().split('T')[0],
    movementScreen: {
      overheadSquat: {
        scoreLeft: generateScore(),
        scoreRight: generateScore(),
        comments: ["Good form", "Needs work on depth", "Watch knee alignment", "Maintain neutral spine"][randomInt(0, 3)],
      },
      hurdleStep: {
        scoreLeft: generateScore(),
        scoreRight: generateScore(),
        comments: ["Stable throughout", "Hip rotation needs work", "Good hip mobility", "Watch knee stability"][randomInt(0, 3)],
      },
      inlineLunge: {
        scoreLeft: generateScore(),
        scoreRight: generateScore(),
        comments: ["Balanced movement", "Work on stability", "Good control", "Improve hip mobility"][randomInt(0, 3)],
      },
      apleyScratch: {
        scoreLeft: Math.random() < 0.8 ? "pass" : "fail",
        scoreRight: Math.random() < 0.8 ? "pass" : "fail",
        comments: ["Full ROM", "Limited upper reach", "Good mobility", "Restricted movement pattern"][randomInt(0, 3)],
      },
    },
    performance: {
      verticalJump: {
        value: verticalJump,
        attempts: generateAttempts(verticalJump, 1),
        unit: "in",
      },
      broadJump: {
        value: broadJump,
        attempts: generateAttempts(broadJump, 2),
        unit: "in",
      },
      tenYardSprint: {
        value: sprint,
        attempts: generateAttempts(sprint, 0.03),
      },
      ohmbThrow: {
        value: ohmbThrow,
        attempts: generateAttempts(ohmbThrow, 6),
        unit: "in",
      },
      mbShotput: {
        value: mbShotput,
        attempts: generateAttempts(mbShotput, 5),
        unit: "in",
      },
      mbLeadArm: {
        value: mbLeadArm,
        attempts: generateAttempts(mbLeadArm, 4),
        unit: "in",
      },
    },
    generalComments: [
      "Strong overall performance. Focus on mobility work.",
      "Good progress shown. Continue with current program.",
      "Shows potential. Need to address movement patterns.",
      "Consistent improvement across all areas.",
      "Some asymmetries noted. Implement corrective exercises.",
    ][randomInt(0, 4)],
  };
};

async function importData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/athleteDB');
    console.log("Connected to MongoDB");

    // Clear existing data
    await Athlete.deleteMany({});
    await Assessment.deleteMany({});
    console.log("Cleared existing data");

    // Generate athletes
    const athletes = Array(100)
      .fill(null)
      .map(() => generateAthleteData());

    const athleteDocs = await Athlete.insertMany(athletes);
    console.log("Imported athletes");

    // Generate assessments
    const assessments = [];
    for (const athlete of athleteDocs) {
      const numAssessments = randomInt(1, 4);
      const now = new Date();
      const threeYearsAgo = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());

      for (let i = 0; i < numAssessments; i++) {
        const assessmentDate = generateRandomDate(threeYearsAgo, now);
        assessments.push(generateAssessment(athlete._id, assessmentDate));
      }
    }

    await Assessment.insertMany(assessments);
    console.log("Imported assessments");

    console.log("Sample data import complete");
    process.exit(0);
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
}

importData();
