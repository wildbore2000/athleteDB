// src/components/PerformanceMeasurements.jsx
import React, { useEffect } from 'react';
import { Input } from './ui/input';

const PerformanceMeasurements = ({ register, watch, setValue }) => {
  const performanceTests = [
    {
      name: 'Vertical Jump',
      key: 'verticalJump',
      unit: 'inches',
      type: 'distance'
    },
    {
      name: 'Broad Jump',
      key: 'broadJump',
      unit: 'inches',
      type: 'distance'
    },
    {
      name: '10-Yard Sprint',
      key: 'tenYardSprint',
      unit: 'seconds',
      type: 'time'
    },
    {
      name: 'OH MB Throw',
      key: 'ohmbThrow',
      unit: 'mph', 
      type: 'speed'   
    },
    {
      name: 'MB Shotput',
      key: 'mbShotput',
      unit: 'mph', 
      type: 'speed' 
    },
    {
      name: 'MB Lead Arm',
      key: 'mbLeadArm',
      unit: 'mph', 
      type: 'speed' 
    },
    {
      name: 'Pull Ups',
      key: 'pullUps',
      unit: 'reps',
      type: 'reps'
    },
    {
      name: 'Mid Thigh Pull',
      key: 'midThighPull',
      unit: 'lbs',
      type: 'strength'
    }
  ];

  // Watch all attempts for all tests
  const attemptValues = {};
  performanceTests.forEach(test => {
    attemptValues[test.key] = Array(3).fill(0).map((_, i) => 
      watch(`performance.${test.key}.attempts[${i}]`)
    );
  });

  // Update best values whenever attempts change
  useEffect(() => {
    performanceTests.forEach(test => {
      const attempts = attemptValues[test.key]
        .map(Number)
        .filter(v => !isNaN(v) && v > 0);

      if (attempts.length > 0) {
        const bestValue = test.type === 'time'
          ? Math.min(...attempts)
          : Math.max(...attempts);

        setValue(
          `performance.${test.key}.value`,
          bestValue,
          { shouldDirty: true }
        );
      }
    });
  }, [Object.values(attemptValues).flat(), setValue]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Measurement</th>
            <th className="border p-2">Attempt 1</th>
            <th className="border p-2">Attempt 2</th>
            <th className="border p-2">Attempt 3</th>
            <th className="border p-2">Best</th>
          </tr>
        </thead>
        <tbody>
          {performanceTests.map((test) => (
            <tr key={test.key}>
              <td className="border p-2">
                {test.name}
                <span className="text-sm text-gray-500 ml-1">
                  ({test.unit})
                </span>
              </td>
              {[0, 1, 2].map((attemptIndex) => (
                <td key={attemptIndex} className="border p-2">
                  <Input
                    type="number"
                    step={test.type === 'time' ? '0.01' : '0.1'}
                    {...register(`performance.${test.key}.attempts[${attemptIndex}]`)}
                    className="w-24"
                    placeholder={`${test.unit}`}
                  />
                </td>
              ))}
              <td className="border p-2 font-bold">
                {watch(`performance.${test.key}.value`)
                  ? `${watch(`performance.${test.key}.value`).toFixed(2)}${
                    test.type === 'time' ? 's' : 
                    test.type === 'speed' ? ' mph' :
                    test.type === 'reps' ? ' reps' :
                    test.type === 'strength' ? ' lbs' :
                    '"'
                    }`
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PerformanceMeasurements;