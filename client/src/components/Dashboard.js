import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

const Dashboard = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/assessments')
      .then(res => res.json())
      .then(data => {
        setAssessments(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching assessments:', err);
        setLoading(false);
      });
  }, []);

  // Calculate summary statistics
  const calculateStats = () => {
    if (!assessments.length) return null;

    return {
      totalAthletes: new Set(assessments.map(a => a.name)).size,
      totalAssessments: assessments.length,
      avgAssessmentsPerAthlete: (assessments.length / new Set(assessments.map(a => a.name)).size).toFixed(1)
    };
  };

  // Prepare performance data for line chart
  const preparePerformanceData = () => {
    const athleteData = {};
    
    assessments.forEach(assessment => {
      if (!athleteData[assessment.name]) {
        athleteData[assessment.name] = [];
      }
      
      athleteData[assessment.name].push({
        date: new Date(assessment.assessmentDate).toLocaleDateString(),
        verticalJump: assessment.performanceMeasurements?.verticalJump?.value || 0,
        broadJump: assessment.performanceMeasurements?.broadJump?.value || 0,
        sprint: assessment.performanceMeasurements?.tenYardSprint?.value || 0
      });
    });

    return athleteData;
  };

  // Prepare movement screen data for radar chart
  const prepareMovementData = (assessment) => {
    if (!assessment?.movementScreen) return [];

    return [
      { movement: 'Overhead Squat', score: assessment.movementScreen.overheadsquat?.score || 0 },
      { movement: 'Hurdle Step', score: assessment.movementScreen.hurdlestep?.score || 0 },
      { movement: 'Inline Lunge', score: assessment.movementScreen.inlinelunge?.score || 0 },
      { movement: "Apley's Scratch", score: assessment.movementScreen.apleysScratch?.score || 0 }
    ];
  };

  const stats = calculateStats();
  const performanceData = preparePerformanceData();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Athletes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAthletes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAssessments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avg Assessments per Athlete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.avgAssessmentsPerAthlete}</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vertical Jump Progress</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={Object.values(performanceData)[0]}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="verticalJump" 
                  stroke="#2563eb" 
                  name="Vertical Jump (inches)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Movement Screen</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={prepareMovementData(assessments[assessments.length - 1])}>
                <PolarGrid />
                <PolarAngleAxis dataKey="movement" />
                <Radar
                  name="Movement Score"
                  dataKey="score"
                  fill="#2563eb"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sprint Time Progress</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={Object.values(performanceData)[0]}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sprint" 
                  stroke="#dc2626" 
                  name="10-Yard Sprint (seconds)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Broad Jump Progress</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={Object.values(performanceData)[0]}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="broadJump" 
                  stroke="#16a34a" 
                  name="Broad Jump (inches)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;