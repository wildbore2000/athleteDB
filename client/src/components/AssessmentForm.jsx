// src/components/AssessmentForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X } from "lucide-react";
import { assessmentApi, measurementTypeApi } from '../services/api';

const MeasurementRow = ({ measurement, register, watch, setValue, onRemove }) => {
  // Helper function to render score/value input based on type
  const renderValueInput = (side = null) => {
    const fieldName = side 
      ? `measurements.${measurement.key}.score${side}` 
      : `measurements.${measurement.key}.value`;

    switch (measurement.type) {
      case 'score':
        return (
          <Select
            value={String(watch(fieldName) || "none")}
            onValueChange={(value) => setValue(fieldName, value === "none" ? null : parseInt(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="--" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">--</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
            </SelectContent>
          </Select>
        );
      
      case 'passfail':
        return (
          <Select
            value={watch(fieldName) || "none"}
            onValueChange={(value) => setValue(fieldName, value === "none" ? null : value)}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="--" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">--</SelectItem>
              <SelectItem value="pass">Pass</SelectItem>
              <SelectItem value="fail">Fail</SelectItem>
            </SelectContent>
          </Select>
        );
      
      default:
        return (
          <Input
            type="number"
            step="0.1"
            {...register(fieldName)}
            className="w-24"
            placeholder={measurement.unit}
          />
        );
    }
  };

  const renderAttempts = () => {
    if (!measurement.config.hasAttempts) return null;
    
    return (
      <div className="flex gap-2">
        {Array.from({ length: measurement.config.maxAttempts }).map((_, index) => (
          <Input
            key={index}
            type="number"
            step="0.1"
            className="w-20"
            {...register(`measurements.${measurement.key}.attempts.${index}`)}
            placeholder={`#${index + 1}`}
          />
        ))}
      </div>
    );
  };

  return (
    <tr>
      <td className="border p-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">{measurement.name}</span>
          {!measurement.isDefault && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="p-0 h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          {measurement.unit}
        </span>
      </td>
      
      {measurement.config.hasSides ? (
        <>
          <td className="border p-2 text-center">
            {renderValueInput('Left')}
          </td>
          <td className="border p-2 text-center">
            {renderValueInput('Right')}
          </td>
          <td className="border p-2" colSpan={measurement.config.hasAttempts ? 2 : 1}>
            <Input
              {...register(`measurements.${measurement.key}.comments`)}
              placeholder="Comments"
            />
          </td>
        </>
      ) : (
        <>
          <td className="border p-2 text-center">
            {renderValueInput()}
          </td>
          <td className="border p-2" colSpan={2}>
            {renderAttempts()}
          </td>
          <td className="border p-2">
            <Input
              {...register(`measurements.${measurement.key}.comments`)}
              placeholder="Comments"
            />
          </td>
        </>
      )}
    </tr>
  );
};

export default function AssessmentForm() {
  const { id, athleteId } = useParams();
  const navigate = useNavigate();
  const [selectedMeasurements, setSelectedMeasurements] = useState(new Set());

  // Fetch measurement types
  const { data: measurementTypes = [] } = useQuery({
    queryKey: ['measurementTypes'],
    queryFn: () => measurementTypeApi.getMeasurementTypes()
  });

  // Fetch assessment data if editing
  const { data: assessmentData, isLoading: isLoadingAssessment } = useQuery({
    queryKey: ['assessment', id],
    queryFn: () => assessmentApi.getAssessment(id),
    enabled: !!id
  });

  // Form setup
  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      measurements: {},
      assessmentDate: new Date().toISOString().split('T')[0],
      generalComments: ''
    }
  });

  // Initialize form with assessment data when editing
  useEffect(() => {
    if (assessmentData?.data) {
      const assessment = assessmentData.data;
      const formattedDate = new Date(assessment.assessmentDate)
        .toISOString()
        .split('T')[0];
  
      const measurementsData = assessment.measurements instanceof Map 
        ? Object.fromEntries(assessment.measurements)
        : assessment.measurements || {};
  
      reset({
        assessmentDate: formattedDate,
        generalComments: assessment.generalComments || '',
        measurements: measurementsData
      });
  
      if (measurementsData) {
        setSelectedMeasurements(prev => new Set([
          ...Array.from(prev),
          ...Object.keys(measurementsData)
        ]));
      }
  
      console.log('Loaded measurements:', measurementsData);
    }
  }, [assessmentData, reset]);

  // Add default measurements initially
  useEffect(() => {
    if (measurementTypes.length > 0) {
      const defaults = measurementTypes.filter(m => m.isDefault);
      const defaultKeys = defaults.map(m => m.key);
      setSelectedMeasurements(new Set(defaultKeys));
    }
  }, [measurementTypes]);

  const handleAddMeasurement = (measurementKey) => {
    setSelectedMeasurements(prev => new Set([...prev, measurementKey]));
  };

  const handleRemoveMeasurement = (measurementKey) => {
    const newSelected = new Set(selectedMeasurements);
    newSelected.delete(measurementKey);
    setSelectedMeasurements(newSelected);
    setValue(`measurements.${measurementKey}`, undefined);
  };

  const onSubmit = async (data) => {
    try {
      const measurements = Object.entries(data.measurements)
      .filter(([key]) => {
        const value = data.measurements[key];
        console.log('Checking measurement:', key, value);
        
        // For score-based measurements
        if (value.scoreLeft || value.scoreRight) {
          return true;
        }
        
        // For performance measurements
        if (value.value || (value.attempts && value.attempts.some(a => a))) {
          return true;
        }
        
        return false;
      })
        .reduce((acc, [key, value]) => {
          // Keep original key case
          const cleanedValue = {};
          if (value.value) cleanedValue.value = value.value;
          if (value.scoreLeft) cleanedValue.scoreLeft = value.scoreLeft;
          if (value.scoreRight) cleanedValue.scoreRight = value.scoreRight;
          if (value.attempts?.some(a => a)) cleanedValue.attempts = value.attempts;
          if (value.comments?.trim()) cleanedValue.comments = value.comments;
          
          acc[key] = cleanedValue;
          return acc;
        }, {});
  
      const formData = { ...data, athlete: athleteId, measurements };
      console.log('Cleaned data for API:', formData);
  
      if (id) {
        await assessmentApi.updateAssessment(id, formData);
      } else {
        await assessmentApi.createAssessment(formData);
      }
    
      navigate(athleteId ? `/athletes/${athleteId}/assessments` : '/assessments');
    } catch (error) {
      console.error('Error saving assessment:', error);
    }
  };

  // Group measurements by category
  const groupedMeasurements = React.useMemo(() => {
    const grouped = {
      movementScreen: [],
      performance: []
    };

    Array.from(selectedMeasurements).forEach(key => {
      const measurementType = measurementTypes.find(m => m.key === key);
      if (measurementType) {
        grouped[measurementType.category].push(measurementType);
      }
    });

    return grouped;
  }, [selectedMeasurements, measurementTypes]);

  if (id && isLoadingAssessment) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between gap-4">
            <div className="flex-1">
              <Input
                type="date"
                {...register('assessmentDate')}
                required
              />
            </div>
            <div>
              <Select onValueChange={handleAddMeasurement}>
                <SelectTrigger>
                  <SelectValue placeholder="Add Measurement" />
                </SelectTrigger>
                <SelectContent>
                  {measurementTypes
                    .filter(m => !selectedMeasurements.has(m.key))
                    .map(m => (
                      <SelectItem key={m.key} value={m.key}>
                        {m.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movement Screen */}
      {groupedMeasurements.movementScreen.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Movement Screen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left">Movement</th>
                    <th className="border p-2">Left Side</th>
                    <th className="border p-2">Right Side</th>
                    <th className="border p-2">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedMeasurements.movementScreen.map(measurement => (
                    <MeasurementRow
                      key={measurement.key}
                      measurement={measurement}
                      register={register}
                      watch={watch}
                      setValue={setValue}
                      onRemove={() => handleRemoveMeasurement(measurement.key)}
                    />
                  ))}
                </tbody>
              </table>
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
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left">Measurement</th>
                    <th className="border p-2">Best</th>
                    <th className="border p-2" colSpan={2}>Attempts</th>
                    <th className="border p-2">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedMeasurements.performance.map(measurement => (
                    <MeasurementRow
                      key={measurement.key}
                      measurement={measurement}
                      register={register}
                      watch={watch}
                      setValue={setValue}
                      onRemove={() => handleRemoveMeasurement(measurement.key)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments */}
      <Card>
        <CardHeader>
          <CardTitle>General Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            {...register('generalComments')}
            className="w-full min-h-[100px] p-2 rounded-md border"
          />
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">
        {id ? 'Update' : 'Create'} Assessment
      </Button>
    </form>
  );
}