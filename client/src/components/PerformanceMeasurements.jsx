import React, { useEffect } from 'react';
import PerformanceInput from './PerformanceInput';

const PerformanceMeasurements = ({ register, watch, setValue }) => {
  const attempts = watch([
    'performanceMeasurements.verticalJump.attempt1',
    'performanceMeasurements.verticalJump.attempt2',
    'performanceMeasurements.verticalJump.attempt3',
    'performanceMeasurements.broadJump.attempt1',
    'performanceMeasurements.broadJump.attempt2',
    'performanceMeasurements.broadJump.attempt3',
    'performanceMeasurements.tenYardSprint.attempt1',
    'performanceMeasurements.tenYardSprint.attempt2',
    'performanceMeasurements.tenYardSprint.attempt3',
    'performanceMeasurements.ohmbThrow.attempt1',
    'performanceMeasurements.ohmbThrow.attempt2',
    'performanceMeasurements.ohmbThrow.attempt3',
    'performanceMeasurements.mbShotput.attempt1',
    'performanceMeasurements.mbShotput.attempt2',
    'performanceMeasurements.mbShotput.attempt3',
    'performanceMeasurements.mbLeadArm.attempt1',
    'performanceMeasurements.mbLeadArm.attempt2',
    'performanceMeasurements.mbLeadArm.attempt3'
  ]);

  useEffect(() => {
    // Update best values whenever attempts change
    const [vj1, vj2, vj3] = attempts.slice(0, 3).map(Number);
    const [bj1, bj2, bj3] = attempts.slice(3, 6).map(Number);
    const [sp1, sp2, sp3] = attempts.slice(6, 9).map(Number);
    const [oh1, oh2, oh3] = attempts.slice(9, 12).map(Number);
    const [ms1, ms2, ms3] = attempts.slice(12, 15).map(Number);
    const [la1, la2, la3] = attempts.slice(15, 18).map(Number);

    // Calculate best vertical jump (max)
    const validVJAttempts = [vj1, vj2, vj3].filter(v => !isNaN(v));
    if (validVJAttempts.length > 0) {
      setValue(
        'performanceMeasurements.verticalJump.value',
        Math.max(...validVJAttempts),
        { shouldDirty: true }
      );
    }

    // Calculate best broad jump (max)
    const validBJAttempts = [bj1, bj2, bj3].filter(v => !isNaN(v));
    if (validBJAttempts.length > 0) {
      setValue(
        'performanceMeasurements.broadJump.value',
        Math.max(...validBJAttempts),
        { shouldDirty: true }
      );
    }

    // Calculate best sprint time (min)
    const validSprintAttempts = [sp1, sp2, sp3].filter(v => !isNaN(v) && v > 0);
    if (validSprintAttempts.length > 0) {
      setValue(
        'performanceMeasurements.tenYardSprint.value',
        Math.min(...validSprintAttempts),
        { shouldDirty: true }
      );
    }

    // Calculate best OH MB Throw (max)
    const validOHAttempts = [oh1, oh2, oh3].filter(v => !isNaN(v));
    if (validOHAttempts.length > 0) {
      setValue(
        'performanceMeasurements.ohmbThrow.value',
        Math.max(...validOHAttempts),
        { shouldDirty: true }
      );
    }

    // Calculate best MB Shotput (max)
    const validMSAttempts = [ms1, ms2, ms3].filter(v => !isNaN(v));
    if (validMSAttempts.length > 0) {
      setValue(
        'performanceMeasurements.mbShotput.value',
        Math.max(...validMSAttempts),
        { shouldDirty: true }
      );
    }

    // Calculate best MB Lead Arm (max)
    const validLAAttempts = [la1, la2, la3].filter(v => !isNaN(v));
    if (validLAAttempts.length > 0) {
      setValue(
        'performanceMeasurements.mbLeadArm.value',
        Math.max(...validLAAttempts),
        { shouldDirty: true }
      );
    }
  }, [attempts, setValue]);

  const createChangeHandler = (name) => (event) => {
    setValue(name, event.target.value);
  };

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
          <tr>
            <td className="border p-2">Vertical Jump</td>
            <td className="border p-2">
              <PerformanceInput
                value={watch('performanceMeasurements.verticalJump.attempt1')}
                onChange={createChangeHandler('performanceMeasurements.verticalJump.attempt1')}
              />
            </td>
            <td className="border p-2">
              <PerformanceInput
                value={watch('performanceMeasurements.verticalJump.attempt2')}
                onChange={createChangeHandler('performanceMeasurements.verticalJump.attempt2')}
              />
            </td>
            <td className="border p-2">
              <PerformanceInput
                value={watch('performanceMeasurements.verticalJump.attempt3')}
                onChange={createChangeHandler('performanceMeasurements.verticalJump.attempt3')}
              />
            </td>
            <td className="border p-2 font-bold">
              {watch('performanceMeasurements.verticalJump.value') ? `${watch('performanceMeasurements.verticalJump.value').toFixed(1)}"` : '-'}
            </td>
          </tr>
          <tr>
            <td className="border p-2">Broad Jump</td>
            <td className="border p-2">
              <PerformanceInput
                value={watch('performanceMeasurements.broadJump.attempt1')}
                onChange={createChangeHandler('performanceMeasurements.broadJump.attempt1')}
              />
            </td>
            <td className="border p-2">
              <PerformanceInput
                value={watch('performanceMeasurements.broadJump.attempt2')}
                onChange={createChangeHandler('performanceMeasurements.broadJump.attempt2')}
              />
            </td>
            <td className="border p-2">
              <PerformanceInput
                value={watch('performanceMeasurements.broadJump.attempt3')}
                onChange={createChangeHandler('performanceMeasurements.broadJump.attempt3')}
              />
            </td>
            <td className="border p-2 font-bold">
              {watch('performanceMeasurements.broadJump.value') ? `${watch('performanceMeasurements.broadJump.value').toFixed(1)}"` : '-'}
            </td>
          </tr>
          <tr>
            <td className="border p-2">10-Yard Sprint (sec)</td>
            <td className="border p-2">
              <PerformanceInput
                isTimeInput={true}
                value={watch('performanceMeasurements.tenYardSprint.attempt1')}
                onChange={createChangeHandler('performanceMeasurements.tenYardSprint.attempt1')}
              />
            </td>
            <td className="border p-2">
              <PerformanceInput
                isTimeInput={true}
                value={watch('performanceMeasurements.tenYardSprint.attempt2')}
                onChange={createChangeHandler('performanceMeasurements.tenYardSprint.attempt2')}
              />
            </td>
            <td className="border p-2">
              <PerformanceInput
                isTimeInput={true}
                value={watch('performanceMeasurements.tenYardSprint.attempt3')}
                onChange={createChangeHandler('performanceMeasurements.tenYardSprint.attempt3')}
              />
            </td>
            <td className="border p-2 font-bold">
              {watch('performanceMeasurements.tenYardSprint.value')?.toFixed(2) || '-'}
            </td>
          </tr>
          <tr>
            <td className="border p-2">OH MB Throw</td>
            <td className="border p-2">
              <PerformanceInput
                value={watch('performanceMeasurements.ohmbThrow.attempt1')}
                onChange={createChangeHandler('performanceMeasurements.ohmbThrow.attempt1')}
              />
            </td>
            <td className="border p-2">
              <PerformanceInput
                value={watch('performanceMeasurements.ohmbThrow.attempt2')}
                onChange={createChangeHandler('performanceMeasurements.ohmbThrow.attempt2')}
              />
            </td>
            <td className="border p-2">
              <PerformanceInput
                value={watch('performanceMeasurements.ohmbThrow.attempt3')}
                onChange={createChangeHandler('performanceMeasurements.ohmbThrow.attempt3')}
              />
            </td>
            <td className="border p-2 font-bold">
              {watch('performanceMeasurements.ohmbThrow.value') ? `${watch('performanceMeasurements.ohmbThrow.value').toFixed(1)}"` : '-'}
            </td>
          </tr>
          <tr>
            <td className="border p-2">MB Shotput Throw</td>
            <td className="border p-2">
              <PerformanceInput
                value={watch('performanceMeasurements.mbShotput.attempt1')}
                onChange={createChangeHandler('performanceMeasurements.mbShotput.attempt1')}
              />
            </td>
            <td className="border p-2">
              <PerformanceInput
                value={watch('performanceMeasurements.mbShotput.attempt2')}
                onChange={createChangeHandler('performanceMeasurements.mbShotput.attempt2')}
              />
            </td>
            <td className="border p-2">
              <PerformanceInput
                value={watch('performanceMeasurements.mbShotput.attempt3')}
                onChange={createChangeHandler('performanceMeasurements.mbShotput.attempt3')}
              />
            </td>
            <td className="border p-2 font-bold">
              {watch('performanceMeasurements.mbShotput.value') ? `${watch('performanceMeasurements.mbShotput.value').toFixed(1)}"` : '-'}
            </td>
          </tr>
          <tr>
            <td className="border p-2">MB Lead Arm Toss</td>
            <td className="border p-2">
              <PerformanceInput
                value={watch('performanceMeasurements.mbLeadArm.attempt1')}
                onChange={createChangeHandler('performanceMeasurements.mbLeadArm.attempt1')}
              />
            </td>
            <td className="border p-2">
              <PerformanceInput
                value={watch('performanceMeasurements.mbLeadArm.attempt2')}
                onChange={createChangeHandler('performanceMeasurements.mbLeadArm.attempt2')}
              />
            </td>
            <td className="border p-2">
              <PerformanceInput
                value={watch('performanceMeasurements.mbLeadArm.attempt3')}
                onChange={createChangeHandler('performanceMeasurements.mbLeadArm.attempt3')}
              />
            </td>
            <td className="border p-2 font-bold">
              {watch('performanceMeasurements.mbLeadArm.value') ? `${watch('performanceMeasurements.mbLeadArm.value').toFixed(1)}"` : '-'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PerformanceMeasurements;