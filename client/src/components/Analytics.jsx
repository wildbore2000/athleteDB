// src/components/Analytics.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ComparisonChart } from './ComparisonChart';
import { TrendsChart } from './TrendsChart';

export const Analytics = () => {
  return (
    <div className="space-y-6">
      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Performance Trends</CardTitle>
            <Link 
              to="/analytics/trends" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View Details →
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <TrendsChart metric="verticalJump" timeframe="6m" />
        </CardContent>
      </Card>

      {/* Athlete Comparisons */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Athlete Comparisons</CardTitle>
            <Link 
              to="/analytics/comparison" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View Details →
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <ComparisonChart limit={5} />
        </CardContent>
      </Card>
    </div>
  );
};