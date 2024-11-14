// src/components/ComparisonChart.jsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useAthletes } from '../hooks';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { METRICS } from './constants';

export const ComparisonChart = ({ limit = 10 }) => {
  const [selectedAthletes, setSelectedAthletes] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState(['verticalJump']);
  
  const { data: athletesData } = useAthletes({ limit });
  
  const { data: comparisonData, isLoading } = useQuery({
    queryKey: ['comparativeStats', selectedAthletes, selectedMetrics],
    queryFn: () => fetch(`/api/statistics/compare?athletes=${selectedAthletes.join(',')}&metrics=${selectedMetrics.join(',')}`)
      .then(res => res.json()),
    enabled: selectedAthletes.length > 0 && selectedMetrics.length > 0
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="w-64">
          <Select value={selectedAthletes[0]} onValueChange={(value) => setSelectedAthletes([value])}>
            <SelectTrigger>
              <SelectValue placeholder="Select Athletes" />
            </SelectTrigger>
            <SelectContent>
              {athletesData?.data.map(athlete => (
                <SelectItem key={athlete._id} value={athlete._id}>
                  {athlete.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-64">
          <Select value={selectedMetrics[0]} onValueChange={(value) => setSelectedMetrics([value])}>
            <SelectTrigger>
              <SelectValue placeholder="Select Metrics" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(METRICS).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData?.data || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="athleteName" />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedMetrics.map(metric => (
              <Bar
                key={metric}
                dataKey={metric}
                name={METRICS[metric].label}
                fill={`#${Math.floor(Math.random()*16777215).toString(16)}`}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};