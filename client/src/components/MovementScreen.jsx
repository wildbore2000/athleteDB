import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from './ui/button';
import { useMovementTypes } from '../hooks/useData';
import { Plus, X } from 'lucide-react';

const MovementScreen = ({ register, watch, setValue }) => {
  const { data: allMovementTypes = [] } = useMovementTypes({
    category: 'movementScreen',
  });
  
  // State to track additional movements
  const [selectedMovements, setSelectedMovements] = React.useState([]);
  
  // Watch the entire movementScreen object to track changes
  const movementScreenValues = watch('movementScreen') || {};
  
  // Filter default movements that should always show
  const defaultMovements = React.useMemo(() => 
    allMovementTypes.filter(mt => mt.isDefault || (movementScreenValues && movementScreenValues[mt.key])),
    [allMovementTypes, movementScreenValues]
  );
  
  // Filter available movements for selection
  const availableMovements = React.useMemo(() => 
    allMovementTypes.filter(mt => 
      !mt.isDefault && 
      !defaultMovements.find(dm => dm.key === mt.key) &&
      !selectedMovements.includes(mt.key)
    ),
    [allMovementTypes, defaultMovements, selectedMovements]
  );

  // Effect to initialize form data for default movements
  useEffect(() => {
    defaultMovements.forEach(movement => {
      if (!movementScreenValues[movement.key]) {
        setValue(`movementScreen.${movement.key}`, {
          scoreLeft: null,
          scoreRight: null,
          comments: ''
        });
      }
    });
  }, [defaultMovements, setValue]);

  const handleAddMovement = (e) => {
    e.preventDefault();
    setSelectedMovements(prev => [...prev, null]);
  };

  const handleMovementSelect = (movement) => {
    if (movement) {
      setSelectedMovements(prev => [...prev, movement.key]);
      // Initialize the form data for the new movement
      setValue(`movementScreen.${movement.key}`, {
        scoreLeft: null,
        scoreRight: null,
        comments: ''
      });
    }
  };

  const handleRemoveMovement = (indexToRemove, movementKey) => {
    setSelectedMovements(prev => prev.filter((_, index) => index !== indexToRemove));
    // Remove the data from the form
    const newMovementScreen = { ...movementScreenValues };
    delete newMovementScreen[movementKey];
    setValue('movementScreen', newMovementScreen);
  };

  const renderScoreInput = (movementType, side) => {
    if (!movementType) return null;
  
    const fieldName = `movementScreen.${movementType.key}.score${side}`;
    
    switch (movementType.type) {
      case 'strength':
        return (
          <div className="flex items-center">
            <Input
              type="number"
              className="w-20"
              placeholder={movementType.unit}
              {...register(fieldName)}
            />
            <span className="ml-1 text-sm text-muted-foreground">{movementType.unit}</span>
          </div>
        );
      case 'score':
        return (
          <Select
            value={String(watch(fieldName) || "none")}
            onValueChange={(value) => {
              setValue(fieldName, value === "none" ? null : parseInt(value, 10));
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="--" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">--</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'passfail':
        return (
          <Select
            value={watch(fieldName) || "none"}
            onValueChange={(value) => {
              setValue(fieldName, value === "none" ? null : value);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="--" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">--</SelectItem>
              <SelectItem value="pass">Pass</SelectItem>
              <SelectItem value="fail">Fail</SelectItem>
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  // Find movement type by key
  const getMovementByKey = (key) => {
    return allMovementTypes.find(mt => mt.key === key);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Movement Screen</CardTitle>
          <Button 
            onClick={handleAddMovement} 
            type="button"
            variant="outline"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Movement
          </Button>
        </div>
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
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {/* Default Movements */}
              {defaultMovements.map((movementType) => (
                <tr key={movementType._id} className="bg-white">
                  <td className="px-6 py-4 font-medium">
                    {movementType.name}
                    {movementType.unit && (
                      <span className="text-xs text-gray-500 ml-1">({movementType.unit})</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      {renderScoreInput(movementType, 'Left')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      {renderScoreInput(movementType, 'Right')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Input
                      type="text"
                      placeholder="Add comments..."
                      {...register(`movementScreen.${movementType.key}.comments`)}
                    />
                  </td>
                  <td className="px-6 py-4"></td>
                </tr>
              ))}

              {/* Selected Movements */}
              {selectedMovements.map((movementKey, index) => {
                const movementType = movementKey ? getMovementByKey(movementKey) : null;
                return (
                  <tr key={index} className="bg-white">
                    <td className="px-6 py-4 font-medium">
                      {movementType ? (
                        <div>
                          {movementType.name}
                          {movementType.unit && (
                            <span className="text-xs text-gray-500 ml-1">({movementType.unit})</span>
                          )}
                        </div>
                      ) : (
                        <Select
                          value="none"
                          onValueChange={(value) => {
                            if (value !== "none") {
                              const selectedMovement = availableMovements.find(m => m._id === value);
                              if (selectedMovement) {
                                handleMovementSelect(selectedMovement);
                              }
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select movement" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Select movement</SelectItem>
                            {availableMovements.map((mt) => (
                              <SelectItem key={mt._id} value={mt._id}>
                                {mt.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        {movementType && renderScoreInput(movementType, 'Left')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        {movementType && renderScoreInput(movementType, 'Right')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {movementType && (
                        <Input
                          type="text"
                          placeholder="Add comments..."
                          {...register(`movementScreen.${movementType.key}.comments`)}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {movementType && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveMovement(index, movementType.key)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovementScreen;