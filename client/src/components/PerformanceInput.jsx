import React, { useState } from 'react';
import { Input } from './ui/input';
import FeetInchesInput from './FeetInchesInput';

const PerformanceInput = ({ 
  type,
  value,
  onChange,
  placeholder,
  className,
  isTimeInput = false
}) => {
  const [inputValue, setInputValue] = useState(value || '');

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue); // Update the display value immediately

    // For time inputs, pass through directly
    if (isTimeInput) {
      onChange(e);
      return;
    }

    // For height/distance inputs, validate and convert
    // Only convert when we have a valid number or feet/inches format
    if (newValue === '' || newValue === '.') {
      // Allow empty value or single decimal point
      setInputValue(newValue);
    } else if (newValue.includes("'")) {
      // Handle feet/inches format
      const feetInchesPattern = /^(\d+)'(\d*\.?\d*)"?$/;
      const match = newValue.match(feetInchesPattern);
      if (match) {
        const feet = parseInt(match[1], 10);
        const inches = match[2] ? parseFloat(match[2]) : 0;
        if (inches < 12) {
          const totalInches = (feet * 12) + inches;
          onChange({ target: { value: totalInches } });
        }
      }
    } else {
      // Handle direct number input
      const parsed = parseFloat(newValue);
      if (!isNaN(parsed)) {
        onChange({ target: { value: parsed } });
      }
    }
  };

  if (isTimeInput) {
    return (
      <Input
        type="number"
        step="0.01"
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
      />
    );
  }

  return (
    <Input
      type="text"
      value={inputValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default PerformanceInput;