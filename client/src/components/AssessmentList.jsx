// src/components/AssessmentList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  NAME: 'name',
  DATE: 'assessmentDate'
};

const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc'
};

const AssessmentList = () => {
  const [assessments, setAssessments] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Sort state
  const [sortConfig, setSortConfig] = useState({
    field: SORT_FIELDS.DATE,
    direction: SORT_DIRECTIONS.DESC
  });

  const fetchAssessments = async () => {
    try {
      let url = 'http://localhost:5000/api/assessments';
      const params = new URLSearchParams();
      
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setAssessments(data.data);
      applyFilters(data.data, searchTerm);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const sortAssessments = (assessments, field, direction) => {
    return [...assessments].sort((a, b) => {
      if (field === SORT_FIELDS.DATE) {
        const dateA = new Date(a[field]);
        const dateB = new Date(b[field]);
        return direction === SORT_DIRECTIONS.ASC 
          ? dateA - dateB 
          : dateB - dateA;
      }
      
      if (field === SORT_FIELDS.NAME) {
        const nameA = a[field].toLowerCase();
        const nameB = b[field].toLowerCase();
        return direction === SORT_DIRECTIONS.ASC 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      return 0;
    });
  };

  const applyFilters = (data, search) => {
    let filtered = [...data];
    
    if (search) {
      filtered = filtered.filter(assessment => 
        assessment.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered = sortAssessments(filtered, sortConfig.field, sortConfig.direction);
    
    setFilteredAssessments(filtered);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    applyFilters(assessments, value);
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSort = (field) => {
    setSortConfig(current => ({
      field,
      direction: 
        current.field === field && current.direction === SORT_DIRECTIONS.ASC
          ? SORT_DIRECTIONS.DESC
          : SORT_DIRECTIONS.ASC
    }));
  };

  const getSortIcon = (field) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortConfig.direction === SORT_DIRECTIONS.ASC 
      ? <ChevronUp className="h-4 w-4" />
      : <ChevronDown className="h-4 w-4" />;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateRange({ startDate: '', endDate: '' });
    applyFilters(assessments, '');
  };

  useEffect(() => {
    fetchAssessments();
  }, [dateRange.startDate, dateRange.endDate, sortConfig]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/assessments/${deleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete assessment');
      }

      fetchAssessments();
    } catch (error) {
      console.error('Error deleting assessment:', error);
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Athlete Assessments</h1>
          <Link to="/assessments/add">
  <Button>Add New Assessment</Button>
</Link>
        </div>
        
        {/* Filters Section */}
        <Card>
          <CardContent className="pt-6 pb-4">
            <div className="flex gap-4 items-end">
              {/* Search Bar - 50% */}
              <div className="relative flex-[0.5] space-y-1">
                <Label className="text-sm">Name</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by athlete name..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Date Filters - 25% each */}
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
              {(searchTerm || dateRange.startDate || dateRange.endDate) && (
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
            Showing {filteredAssessments.length} assessments
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => handleSort(SORT_FIELDS.NAME)}
            >
              Name
              {getSortIcon(SORT_FIELDS.NAME)}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => handleSort(SORT_FIELDS.DATE)}
            >
              Date
              {getSortIcon(SORT_FIELDS.DATE)}
            </Button>
          </div>
        </div>

        {/* Assessment Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAssessments.map((assessment) => (
            <Card 
              key={assessment._id} 
              className="hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-semibold mb-1">
                      {assessment.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(assessment.assessmentDate).toLocaleDateString()}
                    </p>
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
                <div className="flex gap-2">
                  <Link to={`/assessments/${assessment._id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  <Link to={`/assessments/edit/${assessment._id}`} className="flex-1">
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
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              assessment record for {assessments.find(a => a._id === deleteId)?.name}.
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
};

export default AssessmentList;