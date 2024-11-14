// components/AthleteList.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAthletes } from '../hooks';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, X } from 'lucide-react';

export const AthleteList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading } = useAthletes({ search: searchTerm });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Athletes</h1>
        <Link to="/athletes/new">
          <Button>Add New Athlete</Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search athletes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
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
        {data?.data.map((athlete) => (
          <Link key={athlete._id} to={`/athletes/${athlete._id}`}>
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle>{athlete.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
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
                    Total Assessments: {athlete.assessments?.length || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

