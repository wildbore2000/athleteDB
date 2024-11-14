// src/components/TrendsChart.jsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { METRICS, TIMEFRAMES } from './constants';

export const TrendsChart = ({ metric: initialMetric = 'verticalJump', timeframe: initialTimeframe = '6m' }) => {
  const [metric, setMetric] = useState(initialMetric);
  const [timeframe, setTimeframe] = useState(initialTimeframe);

  const { data, isLoading } = useQuery({
    queryKey: ['performanceTrends', metric, timeframe],
    queryFn: () => fetch(`/api/statistics/trends?metric=${metric}&timeframe=${timeframe}`)
      .then(res => res.json())
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="w-48">
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger>
              <SelectValue defaultValue={metric} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(METRICS).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger>
              <SelectValue defaultValue={timeframe} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TIMEFRAMES).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data?.data || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis 
              label={{ 
                value: METRICS[metric].unit, 
                angle: -90, 
                position: 'insideLeft' 
              }} 
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="average"
              stroke="#2563eb"
              name={METRICS[metric].label}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};