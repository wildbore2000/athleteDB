import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

const FeetInchesInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder = "", 
  className,
  onValueChange 
}) => {
  const parseInput = (input) => {
    // Handle empty input
    if (!input) {
      onValueChange(null);
      return true;
    }

    // Remove all spaces
    input = input.replace(/\s+/g, '');

    // Case 1: Simple inches number with optional decimal (e.g., "71" or "71.5")
    if (/^\d*\.?\d*$/.test(input)) {
      const inches = parseFloat(input);
      if (!isNaN(inches)) {
        onValueChange(inches);
        return true;
      }
    }

    // Case 2: Feet and inches with symbols and optional decimal (e.g., "5'11.5"" or "5'11.5)
    const feetInchesPattern = /^(\d+)'(\d*\.?\d*)"?$/;
    const match = input.match(feetInchesPattern);
    if (match) {
      const feet = parseInt(match[1], 10);
      const inches = match[2] ? parseFloat(match[2]) : 0;
      
      if (inches >= 12) {
        return false; // Invalid: inches should be less than 12
      }
      
      const totalInches = (feet * 12) + inches;
      onValueChange(totalInches);
      return true;
    }

    // Case 3: Just feet with symbol (e.g., "5'")
    const feetOnlyPattern = /^(\d+)'$/;
    const feetMatch = input.match(feetOnlyPattern);
    if (feetMatch) {
      const feet = parseInt(feetMatch[1], 10);
      onValueChange(feet * 12);
      return true;
    }

    return false; // Invalid format
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    
    // If it's a valid format, parse and convert
    if (parseInput(newValue)) {
      onChange && onChange(e);
    }
  };

  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      <Input
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default FeetInchesInput;