import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { athleteApi, assessmentApi } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const { data: athletesData } = useQuery({
    queryKey: ['athletes'],
    queryFn: () => athleteApi.getAthletes({ limit: 100 })
  });

  const { data: assessmentsData } = useQuery({
    queryKey: ['assessments'],
    queryFn: () => assessmentApi.getAssessments({ limit: 50 })
  });

  const calculateStats = () => {
    if (!athletesData?.data || !assessmentsData?.data) return null;

    const totalAthletes = athletesData.data.length;
    const totalAssessments = assessmentsData.data.length;
    const assessmentsThisMonth = assessmentsData.data.filter(a => {
      const assessmentDate = new Date(a.assessmentDate);
      const today = new Date();
      return assessmentDate.getMonth() === today.getMonth() &&
             assessmentDate.getFullYear() === today.getFullYear();
    }).length;

    const avgAssessmentsPerAthlete = totalAthletes > 0
      ? (totalAssessments / totalAthletes).toFixed(1)
      : 0;

    return {
      totalAthletes,
      totalAssessments,
      assessmentsThisMonth,
      avgAssessmentsPerAthlete
    };
  };

  const stats = calculateStats();
  const recentActivity = assessmentsData?.data.slice(0, 5).map(assessment => ({
    athleteName: assessment.athlete?.name,
    date: assessment.assessmentDate,
    id: assessment._id,
    athleteId: assessment.athlete?._id
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="hidden md:flex md:space-x-2">
          <Link to="/athletes/new">
            <Button variant="outline">Add Athlete</Button>
          </Link>
          <Link to="/assessments/new">
            <Button>New Assessment</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Athletes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAthletes || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAssessments || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assessments This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.assessmentsThisMonth || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Assessments per Athlete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.avgAssessmentsPerAthlete || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id}
                className="flex justify-between items-center border-b pb-2 last:border-0"
              >
                <div>
                  <Link 
                    to={`/athletes/${activity.athleteId}`}
                    className="font-medium hover:text-blue-600"
                  >
                    {activity.athleteName}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                  </p>
                </div>
                <Link 
                  to={`/athletes/${activity.athleteId}/assessments/${activity.id}`}
                >
                  <Button variant="outline" size="sm">
                    View Assessment
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Define MobileButtons component
Dashboard.MobileButtons = () => (
  <>
    <Link to="/athletes/new" className="flex-1">
      <Button variant="outline" className="w-full">Add Athlete</Button>
    </Link>
    <Link to="/assessments/new" className="flex-1">
      <Button className="w-full">New Assessment</Button>
    </Link>
  </>
);

export default Dashboard;