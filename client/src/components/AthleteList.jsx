import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAthletes, useDeleteAthlete } from '../hooks';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Search, X, Trash2, Eye, Edit } from 'lucide-react';
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

const MobileButtons = () => (
  <Link to="/athletes/new" className="flex-1">
    <Button className="w-full">Add New Athlete</Button>
  </Link>
);

export const AthleteList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const { data, isLoading } = useAthletes({ search: searchTerm });
  const deleteAthlete = useDeleteAthlete();

  const handleDelete = async () => {
    try {
      await deleteAthlete.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting athlete:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Athletes</h1>
        <div className="hidden md:block">
          <Link to="/athletes/new">
            <Button>Add New Athlete</Button>
          </Link>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          autoComplete="off"
          placeholder="Search athletes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 pl-8 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={() => setSearchTerm('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {!isLoading && data?.data.map((athlete) => (
          <Card 
            key={athlete._id}
            className="hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle>{athlete.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-2 -mr-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setDeleteId(athlete._id);
                  }}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
              {athlete.team && (
    <p className="text-sm text-muted-foreground">
      Team: {athlete.team}
    </p>
  )}
  {athlete.email && (
    <p className="text-sm text-muted-foreground">
      Email: {athlete.email}
    </p>
  )}
                <p className="text-sm text-muted-foreground">
                  Age: {athlete.age || 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Height: {athlete.height?.value ? `${athlete.height.value}"` : 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Weight: {athlete.weight?.value ? `${athlete.weight.value} lbs` : 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total Assessments: {athlete.assessments ? athlete.assessments.length : 0}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to={`/athletes/${athlete._id}`} className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </Link>
                <Link to={`/athletes/${athlete._id}/edit`} className="flex-1">
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this athlete and all their assessment records.
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
};

AthleteList.MobileButtons = MobileButtons;