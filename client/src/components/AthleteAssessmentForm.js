// src/components/AthleteAssessmentForm.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

const MovementScreenTable = ({ register, errors }) => {
  const movements = [
    "Overhead Squat",
    "Hurdle Step",
    "Inline Lunge",
    "Apley's Scratch"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movement Screen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3 w-1/4">Movement</th>
                <th className="px-6 py-3 w-1/4">Score (1-3)</th>
                <th className="px-6 py-3 w-2/4">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {movements.map((movement) => {
                const key = movement.toLowerCase().replace(/[']/g, '').replace(/\s+/g, '');
                return (
                  <tr key={movement} className="bg-white">
                    <td className="px-6 py-4 font-medium">
                      {movement}
                    </td>
                    <td className="px-6 py-4">
                      <Input
                        type="number"
                        min="1"
                        max="3"
                        className="w-20"
                        {...register(`movementScreen.${key}.score`)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <Input
                        type="text"
                        placeholder="Add comments..."
                        {...register(`movementScreen.${key}.comments`)}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

const AthleteAssessmentForm = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(id ? true : false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Fetch existing data if editing
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/assessments/${id}`)
        .then(res => res.json())
        .then(response => {
          // Transform dates to YYYY-MM-DD format for input fields
          const data = {
            ...response.data,
            assessmentDate: new Date(response.data.assessmentDate).toISOString().split('T')[0],
            dateOfBirth: new Date(response.data.dateOfBirth).toISOString().split('T')[0]
          };
          reset(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching assessment:', error);
          setLoading(false);
        });
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      const url = id 
        ? `http://localhost:5000/api/assessments/${id}`
        : 'http://localhost:5000/api/assessments';
        
      const response = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to submit assessment');
      }
      navigate('/');
    } catch (error) {
      console.error('Error submitting assessment:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-[1200px] mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Top Section - Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>{id ? 'Edit' : 'New'} Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-4">
                <Label>Full Name</Label>
                <Input {...register("name", { required: true })} />
                {errors.name && <span className="text-red-500 text-sm">Required field</span>}
              </div>
              <div>
                <Label>Assessment Date</Label>
                <Input type="date" {...register("assessmentDate", { required: true })} />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" {...register("dateOfBirth", { required: true })} />
              </div>
              <div>
                <Label>Age</Label>
                <Input type="number" {...register("age", { required: true })} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Height (inches)</Label>
                  <Input type="number" step="0.1" {...register("height.value")} />
                </div>
                <div className="flex-1">
                  <Label>Weight (lbs)</Label>
                  <Input type="number" step="0.1" {...register("weight.value")} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Movement Screen Table */}
        <MovementScreenTable register={register} errors={errors} />

        {/* Bottom Section - Performance & Comments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Measurements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Vertical Jump (inches)</Label>
                  <Input 
                    type="number" 
                    step="0.1" 
                    {...register("performanceMeasurements.verticalJump.value")} 
                  />
                </div>
                <div>
                  <Label>Broad Jump (inches)</Label>
                  <Input 
                    type="number" 
                    step="0.1" 
                    {...register("performanceMeasurements.broadJump.value")} 
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>10-Yard Sprint (seconds)</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    {...register("performanceMeasurements.tenYardSprint.value")} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>General Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                {...register("generalComments")} 
                className="min-h-[200px]" 
                placeholder="Enter any additional observations or notes..."
              />
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Button type="submit" className="w-full">
              {id ? 'Update' : 'Submit'} Assessment
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AthleteAssessmentForm;