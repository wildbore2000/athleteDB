// src/components/AthleteAssessmentForm.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import PerformanceMeasurements from './PerformanceMeasurements';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "./ui/alert-dialog";

const MovementScreenTable = ({ register }) => {
  const movements = [
    { name: "Overhead Squat", type: "score" },
    { name: "Hurdle Step", type: "score" },
    { name: "Inline Lunge", type: "score" },
    { name: "Apley's Scratch", type: "passfail", key: "apleysScratch" }
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
                <th className="px-6 py-3">Movement</th>
                <th className="px-6 py-3 text-center">Left Side</th>
                <th className="px-6 py-3 text-center">Right Side</th>
                <th className="px-6 py-3">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {movements.map((movement) => {
                const key = movement.key || movement.name.toLowerCase().replace(/[']/g, '').replace(/\s+/g, '');
                return (
                  <tr key={movement.name} className="bg-white">
                    <td className="px-6 py-4 font-medium">
                      {movement.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        {movement.type === 'score' ? (
                          <Input
                            type="number"
                            min="1"
                            max="3"
                            className="w-20"
                            {...register(`movementScreen.${key}.scoreLeft`)}
                          />
                        ) : (
                          <select
                            className="w-20 h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            {...register(`movementScreen.${key}.scoreLeft`)}
                            defaultValue=""
                          >
                            <option value="">Select</option>
                            <option value="pass">Pass</option>
                            <option value="fail">Fail</option>
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        {movement.type === 'score' ? (
                          <Input
                            type="number"
                            min="1"
                            max="3"
                            className="w-20"
                            {...register(`movementScreen.${key}.scoreRight`)}
                          />
                        ) : (
                          <select
                            className="w-20 h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            {...register(`movementScreen.${key}.scoreRight`)}
                            defaultValue=""
                          >
                            <option value="">Select</option>
                            <option value="pass">Pass</option>
                            <option value="fail">Fail</option>
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Input
                        type="text"
                        placeholder="Add comments..."
                        {...register(`movementScreen.${key}.comments`)}
                      />
                    </td>
                  </tr>
                );
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
  const [showMissingFields, setShowMissingFields] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [submissionData, setSubmissionData] = useState(null);
  
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/assessments/${id}`)
        .then(res => res.json())
        .then(response => {
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

const checkMissingFields = (data) => {
  const missing = [];

  // Check required fields only
  if (!data.name) missing.push('Name');
  if (!data.assessmentDate) missing.push('Assessment Date');

  // Only check Apley's Scratch if one side is filled but not the other
  const apleysScratch = data.movementScreen?.apleysScratch || {};
  const hasApleysLeft = apleysScratch.scoreLeft;
  const hasApleysRight = apleysScratch.scoreRight;
  if ((hasApleysLeft && !hasApleysRight) || (!hasApleysLeft && hasApleysRight)) {
    if (!hasApleysLeft) missing.push("Apley's Scratch Left Pass/Fail");
    if (!hasApleysRight) missing.push("Apley's Scratch Right Pass/Fail");
  }

  // Only check height/weight pairs if one is filled
  if (data.height?.value || data.weight?.value) {
    if (!data.height?.value) missing.push('Height');
    if (!data.weight?.value) missing.push('Weight');
  }

  // For performance measurements, only check if some attempts are filled
  // Vertical Jump
  const hasVerticalJumpAttempts = data.performanceMeasurements?.verticalJump?.attempt1 ||
                                 data.performanceMeasurements?.verticalJump?.attempt2 ||
                                 data.performanceMeasurements?.verticalJump?.attempt3;
  
  // Broad Jump
  const hasBroadJumpAttempts = data.performanceMeasurements?.broadJump?.attempt1 ||
                               data.performanceMeasurements?.broadJump?.attempt2 ||
                               data.performanceMeasurements?.broadJump?.attempt3;
  
  // Sprint
  const hasSprintAttempts = data.performanceMeasurements?.tenYardSprint?.attempt1 ||
                           data.performanceMeasurements?.tenYardSprint?.attempt2 ||
                           data.performanceMeasurements?.tenYardSprint?.attempt3;

  // Only add to missing if some attempts exist but not all measurements are complete
  const performanceMeasurementsFilled = hasVerticalJumpAttempts || hasBroadJumpAttempts || hasSprintAttempts;
  
  // If any performance measurement is started, suggest completing the others
  // But only as suggestions, not requirements
  if (performanceMeasurementsFilled) {
    const suggestions = [];
    if (!hasVerticalJumpAttempts) suggestions.push('Vertical Jump');
    if (!hasBroadJumpAttempts) suggestions.push('Broad Jump');
    if (!hasSprintAttempts) suggestions.push('10-Yard Sprint');
    
    if (suggestions.length > 0) {
      missing.push(...suggestions.map(s => `Consider adding ${s} measurements for completeness`));
    }
  }

  return missing;
};

  const submitAssessment = async (data) => {
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

  const onSubmit = async (data) => {
    const missing = checkMissingFields(data);
    if (missing.length > 0) {
      setMissingFields(missing);
      setSubmissionData(data);
      setShowMissingFields(true);
      return;
    }
    await submitAssessment(data);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-[1200px] mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>{id ? 'Edit' : 'New'} Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-4">
                <Label>Full Name *</Label>
                <Input {...register("name", { required: "Name is required" })} />
                {errors.name && (
                  <span className="text-red-500 text-sm">{errors.name.message}</span>
                )}
              </div>
              <div>
                <Label>Assessment Date *</Label>
                <Input type="date" {...register("assessmentDate", { required: "Assessment date is required" })} />
                {errors.assessmentDate && (
                  <span className="text-red-500 text-sm">{errors.assessmentDate.message}</span>
                )}
              </div>
              <div>
  <Label>Date of Birth</Label>
  <Input type="date" {...register("dateOfBirth")} />
</div>
<div>
  <Label>Age</Label>
  <Input type="number" {...register("age")} />
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
        <MovementScreenTable register={register} />

        {/* Performance & Comments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
  <CardHeader>
    <CardTitle>Performance Measurements</CardTitle>
  </CardHeader>
  <CardContent>
    <PerformanceMeasurements 
      register={register} 
      watch={watch} 
      setValue={setValue}
    />
  </CardContent>
</Card>

{/* General Comments */}
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


<AlertDialog open={showMissingFields} onOpenChange={setShowMissingFields}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Review Assessment Details</AlertDialogTitle>
      <AlertDialogDescription>
        The following suggestions were noted:
        <ul className="list-disc pl-6 mt-2 space-y-1">
          {missingFields.map((field, index) => (
            <li key={index} className="text-sm">
              {field}
            </li>
          ))}
        </ul>
        Would you like to review these items or continue with submission?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={() => setShowMissingFields(false)}>
        Review
      </AlertDialogCancel>
      <AlertDialogAction
        onClick={() => {
          setShowMissingFields(false);
          if (submissionData) {
            submitAssessment(submissionData);
          }
        }}
        className="bg-blue-500 hover:bg-blue-600"
      >
        Continue
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </div>
  );
};

export default AthleteAssessmentForm;