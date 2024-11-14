// src/components/AssessmentDetail.jsx
import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { assessmentApi } from '../services/api';
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

// Change to default export
export default function AssessmentDetail() {
  const { id, athleteId } = useParams();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: assessmentData, isLoading, error } = useQuery({
    queryKey: ['assessment', id],
    queryFn: () => assessmentApi.getAssessment(id)
  });

  const handleDelete = async () => {
    try {
      await assessmentApi.deleteAssessment(id);
      if (athleteId) {
        navigate(`/athletes/${athleteId}/assessments`);
      } else {
        navigate('/assessments');
      }
    } catch (error) {
      console.error('Error deleting assessment:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!assessmentData?.data) return <div>Assessment not found</div>;

  const assessment = assessmentData.data;

  return (
    <>
      {/* Header with Navigation */}
      <div className="mb-6 space-y-2">
        {athleteId && (
          <Link
            to={`/athletes/${athleteId}`}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← Back to Athlete Profile
          </Link>
        )}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Assessment Details</h1>
          <div className="space-x-2">
            <Button 
              onClick={() => navigate(athleteId 
                ? `/athletes/${athleteId}/assessments/${id}/edit`
                : `/assessments/${id}/edit`
              )}
            >
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
      </div>

      {/* Basic Information */}
      <div className="space-y-6">
        {/* Athlete Info */}
        {assessment.athlete && (
          <Card>
            <CardHeader>
              <CardTitle>Athlete Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Name: {assessment.athlete.name}</p>
                <p>Age: {assessment.athlete.age || 'N/A'}</p>
                <p>Height: {assessment.athlete.height?.value ? `${assessment.athlete.height.value}"` : 'N/A'}</p>
                <p>Weight: {assessment.athlete.weight?.value ? `${assessment.athlete.weight.value} lbs` : 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assessment Info */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Date: {new Date(assessment.assessmentDate).toLocaleDateString()}</p>
          </CardContent>
        </Card>

        {/* Movement Screen */}
        <Card>
          <CardHeader>
            <CardTitle>Movement Screen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessment.movementScreen && (
                <>
                  {/* Overhead Squat */}
                  <div>
                    <h3 className="font-semibold mb-2">Overhead Squat</h3>
                    <p>Left: {assessment.movementScreen.overheadSquat?.scoreLeft || 'N/A'}</p>
                    <p>Right: {assessment.movementScreen.overheadSquat?.scoreRight || 'N/A'}</p>
                    {assessment.movementScreen.overheadSquat?.comments && (
                      <p className="text-sm text-gray-600 mt-1">
                        Comments: {assessment.movementScreen.overheadSquat.comments}
                      </p>
                    )}
                  </div>

                  {/* Hurdle Step */}
                  <div>
                    <h3 className="font-semibold mb-2">Hurdle Step</h3>
                    <p>Left: {assessment.movementScreen.hurdleStep?.scoreLeft || 'N/A'}</p>
                    <p>Right: {assessment.movementScreen.hurdleStep?.scoreRight || 'N/A'}</p>
                    {assessment.movementScreen.hurdleStep?.comments && (
                      <p className="text-sm text-gray-600 mt-1">
                        Comments: {assessment.movementScreen.hurdleStep.comments}
                      </p>
                    )}
                  </div>

                  {/* Inline Lunge */}
                  <div>
                    <h3 className="font-semibold mb-2">Inline Lunge</h3>
                    <p>Left: {assessment.movementScreen.inlineLunge?.scoreLeft || 'N/A'}</p>
                    <p>Right: {assessment.movementScreen.inlineLunge?.scoreRight || 'N/A'}</p>
                    {assessment.movementScreen.inlineLunge?.comments && (
                      <p className="text-sm text-gray-600 mt-1">
                        Comments: {assessment.movementScreen.inlineLunge.comments}
                      </p>
                    )}
                  </div>

                  {/* Apley's Scratch */}
                  <div>
                    <h3 className="font-semibold mb-2">Apley's Scratch</h3>
                    <p>Left: {assessment.movementScreen.apleyScratch?.scoreLeft || 'N/A'}</p>
                    <p>Right: {assessment.movementScreen.apleyScratch?.scoreRight || 'N/A'}</p>
                    {assessment.movementScreen.apleyScratch?.comments && (
                      <p className="text-sm text-gray-600 mt-1">
                        Comments: {assessment.movementScreen.apleyScratch.comments}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Measurements */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Measurements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assessment.performance && (
                <>
                  {/* Jumps */}
                  <div>
                    <h3 className="font-semibold mb-3">Jump Tests</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium">Vertical Jump</p>
                        <p>Best: {assessment.performance.verticalJump?.value || 'N/A'}"</p>
                        <p className="text-sm text-gray-600">
                          Attempts: {assessment.performance.verticalJump?.attempts?.join('", ')}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Broad Jump</p>
                        <p>Best: {assessment.performance.broadJump?.value || 'N/A'}"</p>
                        <p className="text-sm text-gray-600">
                          Attempts: {assessment.performance.broadJump?.attempts?.join('", ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sprint */}
                  <div>
                    <h3 className="font-semibold mb-3">Sprint Test</h3>
                    <p>Best: {assessment.performance.tenYardSprint?.value || 'N/A'}s</p>
                    <p className="text-sm text-gray-600">
                      Attempts: {assessment.performance.tenYardSprint?.attempts?.join('s, ')}
                    </p>
                  </div>

                  {/* Medicine Ball Tests */}
                  <div>
                    <h3 className="font-semibold mb-3">Medicine Ball Tests</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium">OH MB Throw</p>
                        <p>Best: {assessment.performance.ohmbThrow?.value || 'N/A'}"</p>
                        <p className="text-sm text-gray-600">
                          Attempts: {assessment.performance.ohmbThrow?.attempts?.join('", ')}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">MB Shotput</p>
                        <p>Best: {assessment.performance.mbShotput?.value || 'N/A'}"</p>
                        <p className="text-sm text-gray-600">
                          Attempts: {assessment.performance.mbShotput?.attempts?.join('", ')}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">MB Lead Arm</p>
                        <p>Best: {assessment.performance.mbLeadArm?.value || 'N/A'}"</p>
                        <p className="text-sm text-gray-600">
                          Attempts: {assessment.performance.mbLeadArm?.attempts?.join('", ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* General Comments */}
        {assessment.generalComments && (
          <Card>
            <CardHeader>
              <CardTitle>General Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{assessment.generalComments}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this assessment record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600" 
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}