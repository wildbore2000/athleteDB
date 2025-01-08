// src/components/AssessmentDetail.jsx
import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { assessmentApi, measurementTypeApi } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { useAssessment } from '../hooks';

const MeasurementDisplay = ({ measurement, value, measurementType }) => {
  const renderValue = () => {
    if (measurementType.config.hasSides) {
      return (
        <div>
          <p>Left: {value.scoreLeft || 'N/A'} {measurementType.unit}</p>
          <p>Right: {value.scoreRight || 'N/A'} {measurementType.unit}</p>
        </div>
      );
    }

    if (measurementType.config.hasAttempts) {
      return (
        <div>
          <p>Best: {value.value} {measurementType.unit}</p>
          <p className="text-sm text-muted-foreground">
            Attempts: {value.attempts?.join(', ') || 'N/A'}
          </p>
        </div>
      );
    }

    return <p>{value.value} {measurementType.unit}</p>;
  };

  return (
    <div className="space-y-1">
      <h3 className="font-medium">{measurementType.name}</h3>
      {renderValue()}
      {value.comments && (
        <p className="text-sm text-muted-foreground">
          Comments: {value.comments}
        </p>
      )}
    </div>
  );
};

export default function AssessmentDetail() {
  const { id, athleteId } = useParams();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: assessmentData, isLoading } = useAssessment(id);

  // Fetch measurement types
  const { data: measurementTypes = [] } = useQuery({
    queryKey: ['measurementTypes'],
    queryFn: () => measurementTypeApi.getMeasurementTypes()
  });

  // Move useMemo here, before any conditional returns
  const groupedMeasurements = React.useMemo(() => {
    const grouped = {
      movementScreen: [],
      performance: []
    };

    // Only process if we have assessment data
    if (assessmentData?.data?.measurements) {
      const measurements = assessmentData.data.measurements;
      // Handle both Map and plain object formats
      const measurementsEntries = measurements instanceof Map
        ? Array.from(measurements.entries())
        : Object.entries(measurements);

      measurementsEntries.forEach(([key, value]) => {
        const measurementType = measurementTypes.find(m => m.key === key);
        if (measurementType) {
          grouped[measurementType.category].push({
            key,
            value,
            type: measurementType
          });
        }
      });
    }

    return grouped;
  }, [assessmentData?.data?.measurements, measurementTypes]);

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

        {/* Movement Screen Measurements */}
        {groupedMeasurements.movementScreen.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Movement Screen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groupedMeasurements.movementScreen.map(({ key, value, type }) => (
                  <MeasurementDisplay
                    key={key}
                    measurement={key}
                    value={value}
                    measurementType={type}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Performance Measurements */}
        {groupedMeasurements.performance.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Performance Measurements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groupedMeasurements.performance.map(({ key, value, type }) => (
                  <MeasurementDisplay
                    key={key}
                    measurement={key}
                    value={value}
                    measurementType={type}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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