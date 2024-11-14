
// components/AthleteDetail.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAthlete } from '../hooks';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

export const AthleteDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useAthlete(id);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Athlete not found</div>;

  const athlete = data.data;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{athlete.name}</h1>
        <div className="space-x-2">
          <Link to={`/athletes/${id}/edit`}>
            <Button variant="outline">Edit Athlete</Button>
          </Link>
          <Link to={`/athletes/${id}/assessments/new`}>
            <Button>New Assessment</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Athlete Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Age: {athlete.age || 'N/A'}</p>
            <p>Height: {athlete.height?.value ? `${athlete.height.value}"` : 'N/A'}</p>
            <p>Weight: {athlete.weight?.value ? `${athlete.weight.value} lbs` : 'N/A'}</p>
            <p>Date of Birth: {athlete.dateOfBirth ? new Date(athlete.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assessment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {athlete.assessments?.map((assessment) => (
                <Link 
                  key={assessment._id} 
                  to={`/athletes/${id}/assessments/${assessment._id}`}
                  className="block"
                >
                  <div className="p-4 border rounded-lg hover:bg-gray-50">
                    <p className="font-medium">
                      {new Date(assessment.assessmentDate).toLocaleDateString()}
                    </p>
                    {/* Add more assessment summary info as needed */}
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