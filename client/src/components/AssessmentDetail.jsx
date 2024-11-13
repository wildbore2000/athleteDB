// src/components/AssessmentDetail.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

const AssessmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  React.useEffect(() => {
    fetch(`http://localhost:5000/api/assessments/${id}`)
      .then(res => res.json())
      .then(data => {
        setAssessment(data.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/assessments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete assessment');
      }

      navigate('/');
    } catch (error) {
      console.error('Error deleting assessment:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!assessment) return <div>Assessment not found</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assessment Details</h1>
        <div className="space-x-2">
          <Button onClick={() => navigate(`/edit/${id}`)}>
            Edit Assessment
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete Assessment
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{assessment.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Basic Information</h3>
              <p>Age: {assessment.age}</p>
              <p>Height: {assessment.height?.value} inches</p>
              <p>Weight: {assessment.weight?.value} lbs</p>
              <p>Date of Birth: {new Date(assessment.dateOfBirth).toLocaleDateString()}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Performance Measurements</h3>
              <p>Vertical Jump: {assessment.performanceMeasurements?.verticalJump?.value} inches</p>
              <p>Broad Jump: {assessment.performanceMeasurements?.broadJump?.value} inches</p>
              <p>10-Yard Sprint: {assessment.performanceMeasurements?.tenYardSprint?.value}s</p>
            </div>
          </div>

          {assessment.generalComments && (
            <div className="mt-6">
              <h3 className="font-semibold">General Comments</h3>
              <p>{assessment.generalComments}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              assessment record for {assessment.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AssessmentDetail;