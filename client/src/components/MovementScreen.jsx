// src/components/MovementScreen.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const MovementScreen = ({ register }) => {
  const movements = [
    { 
      name: "Overhead Squat", 
      key: "overheadSquat", 
      type: "score" 
    },
    { 
      name: "Hurdle Step", 
      key: "hurdleStep", 
      type: "score" 
    },
    { 
      name: "Inline Lunge", 
      key: "inlineLunge", 
      type: "score" 
    },
    { 
      name: "Apley's Scratch", 
      key: "apleyScratch", 
      type: "passfail" 
    }
  ];

  const renderScoreInput = (movement, side) => {
    const fieldName = `movementScreen.${movement.key}.score${side}`;
    
    if (movement.type === 'score') {
      return (
        <Input
          type="number"
          min="1"
          max="3"
          className="w-20"
          {...register(fieldName)}
        />
      );
    } else {
      return (
        <Select
          onValueChange={(value) => register(fieldName).onChange({ target: { value }})}
          {...register(fieldName)}
        >
          <SelectTrigger className="w-20">
            <SelectValue placeholder="--" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">--</SelectItem>
            <SelectItem value="pass">Pass</SelectItem>
            <SelectItem value="fail">Fail</SelectItem>
          </SelectContent>
        </Select>
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movement Screen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Movement</th>
                <th className="px-6 py-3 text-center">Left Side</th>
                <th className="px-6 py-3 text-center">Right Side</th>
                <th className="px-6 py-3">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {movements.map((movement) => (
                <tr key={movement.name} className="bg-white">
                  <td className="px-6 py-4 font-medium">
                    {movement.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      {renderScoreInput(movement, 'Left')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      {renderScoreInput(movement, 'Right')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Input
                      type="text"
                      placeholder="Add comments..."
                      {...register(`movementScreen.${movement.key}.comments`)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovementScreen;