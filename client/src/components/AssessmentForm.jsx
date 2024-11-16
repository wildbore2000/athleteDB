// src/components/AssessmentForm.jsx
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react'; 
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assessmentApi, athleteApi } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import PerformanceMeasurements from './PerformanceMeasurements';
import MovementScreen from './MovementScreen';
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

export default function AssessmentForm() {
  const { id, athleteId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showMissingFields, setShowMissingFields] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [submissionData, setSubmissionData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch assessment data if editing
  const { data: assessmentData, isLoading: isLoadingAssessment } = useQuery({
    queryKey: ['assessment', id],
    queryFn: () => assessmentApi.getAssessment(id),
    enabled: !!id
  });

  // Fetch athlete data for the header
  const { data: athleteData, isLoading: isLoadingAthlete } = useQuery({
    queryKey: ['athlete', athleteId],
    queryFn: () => athleteApi.getAthlete(athleteId),
    enabled: !!athleteId
  });

  // Fetch athletes for dropdown if not in athlete-specific context
  const { data: athletesData, isLoading: isLoadingAthletes } = useQuery({
    queryKey: ['athletes'],
    queryFn: () => athleteApi.getAthletes({ limit: 1000 }), // Increase limit to get all athletes
    enabled: !athleteId // Only fetch if not in athlete-specific context
  });

  // Form setup
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm();

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => assessmentApi.createAssessment(data),
    onSuccess: () => {
      queryClient.invalidateQueries('assessments');
      if (athleteId) {
        navigate(`/athletes/${athleteId}/assessments`);
      } else {
        navigate('/assessments');
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => assessmentApi.updateAssessment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries('assessments');
      if (athleteId) {
        navigate(`/athletes/${athleteId}/assessments`);
      } else {
        navigate('/assessments');
      }
    }
  });

  // Initialize form when data is loaded
  useEffect(() => {
    if (assessmentData?.data) {
      const formData = {
        ...assessmentData.data,
        assessmentDate: new Date(assessmentData.data.assessmentDate).toISOString().split('T')[0]
      };
      reset(formData);
    }
  }, [assessmentData, reset]);

  const checkMissingFields = (data) => {
    const missing = [];

    if (!data.assessmentDate) missing.push('Assessment Date');
    if (!athleteId && !data.athlete) missing.push('Athlete');

    // Check if any performance measurement is partially filled
    const performanceFields = [
      'verticalJump',
      'broadJump',
      'tenYardSprint',
      'ohmbThrow',
      'mbShotput',
      'mbLeadArm'
    ];

    performanceFields.forEach(field => {
      const measurement = data.performance?.[field];
      if (measurement) {
        const hasAttempts = measurement.attempts?.some(a => a != null);
        if (hasAttempts && !measurement.value) {
          missing.push(`${field} best value`);
        }
      }
    });

    return missing;
  };

  const onSubmit = async (data) => {
    // Prepare submission data
    const formData = {
      ...data,
      athlete: athleteId || data.athlete,
      assessmentDate: new Date(data.assessmentDate).toISOString()
    };

    const missing = checkMissingFields(formData);
    if (missing.length > 0) {
      setMissingFields(missing);
      setSubmissionData(formData);
      setShowMissingFields(true);
      return;
    }

    try {
      if (id) {
        await updateMutation.mutateAsync({ id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
    }
  };

  if (isLoadingAssessment || isLoadingAthletes || isLoadingAthlete) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Athlete Header */}
      {athleteId && athleteData?.data && (
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{athleteData.data.name}</h1>
            <p className="text-muted-foreground">
              Height: {athleteData.data.height?.value || 'N/A'}" | 
              Weight: {athleteData.data.weight?.value || 'N/A'} lbs | 
              Age: {athleteData.data.age || 'N/A'}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>{id ? 'Edit' : 'New'} Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Athlete Selection - Only show if not in athlete-specific context */}
              {!athleteId && (
                <div>
                  <Label>Athlete *</Label>
                  <Select 
                    onValueChange={(value) => setValue('athlete', value)}
                    defaultValue={watch('athlete')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an athlete" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[500px]">
                      <div className="sticky top-0 bg-background p-2 z-10 border-b">
                        <div className="relative">
                          <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground pointer-events-none" />
                          <Input
                            placeholder="Search athletes..."
                            className="h-8 pl-8"
                            onKeyDown={(e) => e.stopPropagation()}
                            value={searchTerm}
                            onChange={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSearchTerm(e.target.value);
                            }}
                          />
                          {searchTerm && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1 h-6 w-6 p-0"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSearchTerm('');
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {athletesData?.data
                          .filter(athlete => 
                            athlete.name.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((athlete) => (
                          <SelectItem 
                            key={athlete._id} 
                            value={athlete._id}
                          >
                            <div className="flex flex-col">
                              <span>{athlete.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {athlete.age ? `Age: ${athlete.age}` : ''} 
                                {athlete.height?.value ? ` | Height: ${athlete.height.value}"` : ''}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                  {errors.athlete && (
                    <span className="text-red-500 text-sm">{errors.athlete.message}</span>
                  )}
                </div>
              )}

              <div>
                <Label>Assessment Date *</Label>
                <Input 
                  type="date" 
                  {...register("assessmentDate", { required: "Assessment date is required" })}
                />
                {errors.assessmentDate && (
                  <span className="text-red-500 text-sm">{errors.assessmentDate.message}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Movement Screen */}
        <MovementScreen register={register} />

        {/* Performance Measurements */}
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
            <textarea 
              {...register("generalComments")}
              className="min-h-[200px] w-full rounded-md border p-2"
              placeholder="Enter any additional observations or notes..."
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          {id ? 'Update' : 'Submit'} Assessment
        </Button>
      </form>

      {/* Missing Fields Dialog */}
      <AlertDialog open={showMissingFields} onOpenChange={setShowMissingFields}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Review Assessment Details</AlertDialogTitle>
            <AlertDialogDescription>
              The following fields need attention:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                {missingFields.map((field, index) => (
                  <li key={index} className="text-sm">{field}</li>
                ))}
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowMissingFields(false);
                if (submissionData) {
                  if (id) {
                    updateMutation.mutate({ id, data: submissionData });
                  } else {
                    createMutation.mutate(submissionData);
                  }
                }
              }}
            >
              Submit Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}