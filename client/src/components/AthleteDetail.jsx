import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAthlete } from '../hooks';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

const MobileButtons = ({ id }) => (
  <>
    <Link to={`/athletes/${id}/edit`} className="flex-1">
      <Button variant="outline" className="w-full">Edit Athlete</Button>
    </Link>
    <Link to={`/athletes/${id}/assessments/new`} className="flex-1">
      <Button className="w-full">New Assessment</Button>
    </Link>
  </>
);

export const AthleteDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useAthlete(id);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Athlete not found</div>;

  const athlete = data.data;

  const formatAssessmentData = (assessments) => {
    return assessments?.map(assessment => ({
      date: format(new Date(assessment.assessmentDate), 'MM/dd/yyyy'),
      verticalJump: assessment.performance?.verticalJump?.value,
      broadJump: assessment.performance?.broadJump?.value,
      sprint: assessment.performance?.tenYardSprint?.value,
      ohmbThrow: assessment.performance?.ohmbThrow?.value,
      mbShotput: assessment.performance?.mbShotput?.value,
      mbLeadArm: assessment.performance?.mbLeadArm?.value
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const chartData = formatAssessmentData(athlete.assessments);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{athlete.name}</h1>
          <p className="text-muted-foreground">
            Age: {athlete.age || 'N/A'} | 
            Height: {athlete.height?.value ? `${athlete.height.value}"` : 'N/A'} | 
            Weight: {athlete.weight?.value ? `${athlete.weight.value} lbs` : 'N/A'}
          </p>
        </div>
        <div className="hidden md:flex md:space-x-2">
          <Link to={`/athletes/${id}/edit`}>
            <Button variant="outline">Edit Athlete</Button>
          </Link>
          <Link to={`/athletes/${id}/assessments/new`}>
            <Button>New Assessment</Button>
          </Link>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid gap-6">
        {/* Jump Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Jump Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="verticalJump" 
                    name="Vertical Jump (in)"
                    stroke="#2563eb" 
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="broadJump" 
                    name="Broad Jump (in)"
                    stroke="#16a34a" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Medicine Ball Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Medicine Ball Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="ohmbThrow" 
                    name="OH MB Throw (in)"
                    stroke="#9333ea" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mbShotput" 
                    name="MB Shotput (in)"
                    stroke="#ea580c" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mbLeadArm" 
                    name="MB Lead Arm (in)"
                    stroke="#0d9488" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sprint Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Sprint Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="sprint" 
                    name="10-Yard Sprint (s)"
                    stroke="#dc2626" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Assessments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {athlete.assessments?.slice(0, 5).map((assessment) => (
                <Link 
                  key={assessment._id} 
                  to={`/athletes/${id}/assessments/${assessment._id}`}
                >
                  <div className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {format(new Date(assessment.assessmentDate), 'MMMM d, yyyy')}
                        </p>
                        <div className="text-sm text-muted-foreground mt-1">
                          {assessment.performance?.verticalJump?.value && 
                            `VJ: ${assessment.performance.verticalJump.value}" | `}
                          {assessment.performance?.broadJump?.value && 
                            `BJ: ${assessment.performance.broadJump.value}" | `}
                          {assessment.performance?.tenYardSprint?.value && 
                            `Sprint: ${assessment.performance.tenYardSprint.value}s`}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">View Details →</Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

AthleteDetail.MobileButtons = MobileButtons;