import React, { useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useAthlete } from '../hooks';
import { useQuery } from '@tanstack/react-query';
import { assessmentApi } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { SORT_FIELDS, SORT_DIRECTIONS } from './constants';
import { 
  Search, 
  X, 
  Trash2, 
  Eye, 
  Edit,
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

const MobileButtons = ({ athleteId }) => (
  <Link 
    to={athleteId ? `/athletes/${athleteId}/assessments/new` : "/assessments/new"} 
    className="flex-1"
  >
    <Button className="w-full">Add New Assessment</Button>
  </Link>
);

export default function AssessmentList() {
  const { athleteId } = useParams();
  const location = useLocation();
  const isAthleteView = Boolean(athleteId);
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [sortConfig, setSortConfig] = useState({
    field: SORT_FIELDS.DATE,
    direction: SORT_DIRECTIONS.DESC
  });

  // Queries with staleTime
  const { data: athleteData } = useAthlete(athleteId);
  const { data: assessmentsData, isLoading } = useQuery({
    queryKey: ['assessments', { athleteId }],
    queryFn: () => assessmentApi.getAssessments({ athleteId }),
    staleTime: Infinity,
  });

  const handleSort = () => {
    setSortConfig(current => ({
      field: SORT_FIELDS.DATE,
      direction: current.direction === SORT_DIRECTIONS.ASC
        ? SORT_DIRECTIONS.DESC
        : SORT_DIRECTIONS.ASC
    }));
  };

  const clearFilters = () => {
    setDateRange({ startDate: '', endDate: '' });
    setSearchTerm('');
  };

  const handleDelete = async () => {
    try {
      await assessmentApi.deleteAssessment(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting assessment:', error);
    }
  };

  // Filter assessments based on search term and date range
  const filteredAssessments = React.useMemo(() => {
    if (!assessmentsData?.data) return [];
    
    return assessmentsData.data.filter(assessment => {
      // Search filter
      const searchMatch = !searchTerm || 
        (assessment.athlete?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         assessment.generalComments?.toLowerCase().includes(searchTerm.toLowerCase()));

      // Date range filter
      const assessmentDate = new Date(assessment.assessmentDate);
      const startDateMatch = !dateRange.startDate || 
        assessmentDate >= new Date(dateRange.startDate);
      const endDateMatch = !dateRange.endDate || 
        assessmentDate <= new Date(dateRange.endDate);

      return searchMatch && startDateMatch && endDateMatch;
    });
  }, [assessmentsData?.data, searchTerm, dateRange]);

  // Sort filtered assessments
  const sortedAssessments = React.useMemo(() => {
    return [...filteredAssessments].sort((a, b) => {
      const dateA = new Date(a.assessmentDate);
      const dateB = new Date(b.assessmentDate);
      return sortConfig.direction === SORT_DIRECTIONS.ASC 
        ? dateA - dateB 
        : dateB - dateA;
    });
  }, [filteredAssessments, sortConfig.direction]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isAthleteView 
            ? `Assessments for ${athleteData?.data.name}`
            : 'All Assessments'}
        </h1>
        <div className="hidden md:block">
          <Link to={isAthleteView ? `/athletes/${athleteId}/assessments/new` : "/assessments/new"}>
            <Button>Add New Assessment</Button>
          </Link>
        </div>
      </div>
      
      {/* Filters Section */}
      <Card>
        <CardContent className="pt-6 pb-4">
          <div className="flex gap-4 items-end">
            {/* Search Input */}
            <div className="flex-1 space-y-1">
              <Label className="text-sm">Search Athlete or Comments</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Search assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 pl-8 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* Date Filters */}
            <div className="flex-[0.25] space-y-1">
              <Label className="text-sm">Start Date</Label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="flex-[0.25] space-y-1">
              <Label className="text-sm">End Date</Label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>

            {/* Clear Filters Button */}
            {(dateRange.startDate || dateRange.endDate || searchTerm) && (
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
          Date {sortConfig.direction === SORT_DIRECTIONS.ASC ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
                    : `/assessments/${assessment._id}/edit`
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

AssessmentList.MobileButtons = MobileButtons;