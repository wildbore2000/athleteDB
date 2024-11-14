// src/components/AssessmentList.jsx
import React, { useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useAthlete } from '../hooks';
import { useQuery } from '@tanstack/react-query';
import { assessmentApi } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Search, 
  X, 
  Trash2, 
  Eye, 
  Edit,
  ArrowUpDown,
  ChevronUp,
  ChevronDown 
} from 'lucide-react';
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

const SORT_FIELDS = {
  DATE: 'assessmentDate'
};

const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc'
};

// Rename the component to match the export
export default function AssessmentList() {
  const { athleteId } = useParams();
  const location = useLocation();
  const isAthleteView = Boolean(athleteId);
  
  // State
  const [deleteId, setDeleteId] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [sortConfig, setSortConfig] = useState({
    field: SORT_FIELDS.DATE,
    direction: SORT_DIRECTIONS.DESC
  });

  // Queries
  const { data: athleteData } = useAthlete(athleteId);
  const { data: assessmentsData, isLoading } = useQuery({
    queryKey: ['assessments', { athleteId, ...dateRange }],
    queryFn: () => assessmentApi.getAssessments({ 
      athleteId,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    })
  });

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSort = () => {
    setSortConfig(current => ({
      field: SORT_FIELDS.DATE,
      direction: current.direction === SORT_DIRECTIONS.ASC
        ? SORT_DIRECTIONS.DESC
        : SORT_DIRECTIONS.ASC
    }));
  };

  const getSortIcon = () => {
    return sortConfig.direction === SORT_DIRECTIONS.ASC 
      ? <ChevronUp className="h-4 w-4" />
      : <ChevronDown className="h-4 w-4" />;
  };

  const clearFilters = () => {
    setDateRange({ startDate: '', endDate: '' });
  };

  const handleDelete = async () => {
    try {
      await assessmentApi.deleteAssessment(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting assessment:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  const sortedAssessments = [...(assessmentsData?.data || [])].sort((a, b) => {
    const dateA = new Date(a.assessmentDate);
    const dateB = new Date(b.assessmentDate);
    return sortConfig.direction === SORT_DIRECTIONS.ASC 
      ? dateA - dateB 
      : dateB - dateA;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isAthleteView 
            ? `Assessments for ${athleteData?.data.name}`
            : 'All Assessments'}
        </h1>
        <Link to={isAthleteView ? `/athletes/${athleteId}/assessments/new` : "/assessments/new"}>
          <Button>Add New Assessment</Button>
        </Link>
      </div>
      
      {/* Filters Section */}
      <Card>
        <CardContent className="pt-6 pb-4">
          <div className="flex gap-4 items-end">
            {/* Date Filters */}
            <div className="flex-[0.25] space-y-1">
              <Label className="text-sm">Start Date</Label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
              />
            </div>
            <div className="flex-[0.25] space-y-1">
              <Label className="text-sm">End Date</Label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
              />
            </div>

            {/* Clear Filters Button */}
            {(dateRange.startDate || dateRange.endDate) && (
              <div className="flex-none">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={clearFilters}
                  className="h-10 w-10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {sortedAssessments.length} assessments
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleSort}
        >
          Date
          {getSortIcon()}
        </Button>
      </div>

      {/* Assessment Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedAssessments.map((assessment) => (
          <Card 
            key={assessment._id} 
            className="hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-semibold mb-1">
                    {new Date(assessment.assessmentDate).toLocaleDateString()}
                  </CardTitle>
                  {!isAthleteView && assessment.athlete && (
                    <p className="text-sm text-muted-foreground">
                      Athlete: {assessment.athlete.name}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-2 -mr-2"
                  onClick={() => setDeleteId(assessment._id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {assessment.performance && (
                <div className="mb-4 space-y-1">
                  {assessment.performance.verticalJump?.value && (
                    <p className="text-sm">Vertical Jump: {assessment.performance.verticalJump.value}"</p>
                  )}
                  {assessment.performance.broadJump?.value && (
                    <p className="text-sm">Broad Jump: {assessment.performance.broadJump.value}"</p>
                  )}
                  {assessment.performance.tenYardSprint?.value && (
                    <p className="text-sm">10-Yard Sprint: {assessment.performance.tenYardSprint.value}s</p>
                  )}
                </div>
              )}
              <div className="flex gap-2">
                <Link 
                  to={isAthleteView 
                    ? `/athletes/${athleteId}/assessments/${assessment._id}`
                    : `/assessments/${assessment._id}`
                  } 
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </Link>
                <Link 
                  to={isAthleteView
                    ? `/athletes/${athleteId}/assessments/${assessment._id}/edit`
                    : `/assessments/edit/${assessment._id}`
                  } 
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this assessment.
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
    </div>
  );
}