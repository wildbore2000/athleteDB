import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X, Trash2, Settings2, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { measurementTypeApi } from '../services/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

const MeasurementForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    key: '',
    category: 'movementScreen',
    type: 'score',
    unit: '',
    isDefault: false,
    config: {
      hasSides: true,
      hasAttempts: false,
      maxAttempts: 3,
    },
  });

  const typeOptions = {
    movementScreen: ['score', 'passfail', 'strength'],
    performance: ['distance', 'time', 'speed', 'reps', 'strength'],
  };

  const handleCategoryChange = (value) => {
    console.log('Category Change Triggered:', value);

    const defaultType = typeOptions[value]?.[0] || '';
    setFormData((prev) => ({
      ...prev,
      category: value,
      type: defaultType, // Reset to the first valid type
      config: {
        ...prev.config,
        hasAttempts: value === 'performance',
      },
    }));

    console.log(`Updated category to "${value}" with default type "${defaultType}"`);
  };

  const handleTypeChange = (value) => {
    console.log('Type Changed to:', value);
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.key) {
      formData.key = formData.name.toLowerCase().replace(/\s+/g, '');
    }
    console.log('Form Submitted:', formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        {/* Name Input */}
        <div>
          <Label>Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => {
              console.log('Dropdown value selected:', value);
              handleCategoryChange(value);
            }}
          >
            <SelectTrigger>
              <SelectValue>
                {formData.category === 'movementScreen' ? 'Movement Screen' : 'Performance'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="movementScreen">Movement Screen</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type Dropdown */}
        <div>
          <Label>Type</Label>
          <Select
            key={formData.category} // Force re-render of dropdown when category changes
            value={formData.type}
            onValueChange={handleTypeChange}
          >
            <SelectTrigger>
              <SelectValue>
                {formData.type ? formData.type.charAt(0).toUpperCase() + formData.type.slice(1) : ''}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {typeOptions[formData.category]?.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Unit Input */}
        {['strength', 'distance', 'speed'].includes(formData.type) && (
          <div>
            <Label>Unit</Label>
            <Input
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
              placeholder="e.g., lbs, inches, mph"
            />
          </div>
        )}

        {/* Config Checkboxes */}
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.config.hasSides}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  config: { ...formData.config, hasSides: e.target.checked },
                })
              }
            />
            <span>Has Left/Right Sides</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) =>
                setFormData({ ...formData, isDefault: e.target.checked })
              }
            />
            <span>Show by Default</span>
          </label>

          {formData.category === 'performance' && (
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.config.hasAttempts}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    config: {
                      ...formData.config,
                      hasAttempts: e.target.checked,
                    },
                  })
                }
              />
              <span>Multiple Attempts</span>
            </label>
          )}
        </div>

        {/* Max Attempts Input */}
        {formData.config.hasAttempts && (
          <div>
            <Label>Maximum Attempts</Label>
            <Input
              type="number"
              min={1}
              max={5}
              value={formData.config.maxAttempts}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  config: {
                    ...formData.config,
                    maxAttempts: parseInt(e.target.value),
                  },
                })
              }
            />
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="submit">Save Measurement</Button>
      </DialogFooter>
    </form>
  );
};


const MeasurementManager = () => {
  const [deleteId, setDeleteId] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const queryClient = useQueryClient();



  // Fetch measurement types
  const { data: measurementTypes, isLoading } = useQuery({
    queryKey: ['measurementTypes'],
    queryFn: () => measurementTypeApi.getMeasurementTypes()
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => measurementTypeApi.createMeasurementType(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['measurementTypes']);
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => measurementTypeApi.updateMeasurementType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['measurementTypes']);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => measurementTypeApi.deleteMeasurementType(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['measurementTypes']);
      setDeleteId(null);
    }
  });

  // Reinitialize defaults mutation
  const reinitializeMutation = useMutation({
    mutationFn: () => measurementTypeApi.reinitializeDefaults(),
    onSuccess: () => {
      queryClient.invalidateQueries(['measurementTypes']);
    }
  });

  const handleReinitialize = () => {
    setShowResetConfirm(false);
    reinitializeMutation.mutate();
  };

  const movementScreens = measurementTypes?.data.filter(m => m.category === 'movementScreen') || [];
  const performanceMeasures = measurementTypes?.data.filter(m => m.category === 'performance') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Measurement Types</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowResetConfirm(true)}
            disabled={reinitializeMutation.isLoading}
          >
            <RefreshCw className={cn(
              "h-4 w-4 mr-2",
              reinitializeMutation.isLoading && "animate-spin"
            )} />
            {reinitializeMutation.isLoading ? 'Reinitializing...' : 'Reinitialize Defaults'}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Measurement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Measurement</DialogTitle>
                <DialogDescription>
                  Create a new measurement type for assessments
                </DialogDescription>
              </DialogHeader>
              <MeasurementForm 
                initialData={{
                  name: '',
                  key: '',
                  category: 'movementScreen',
                  type: 'score',
                  unit: '',
                  isDefault: false,
                  config: {
                    hasSides: true,
                    hasAttempts: false,
                    maxAttempts: 3
                  }
                }}
                onSubmit={(data) => createMutation.mutate(data)} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Movement Screen Section */}
      <Card>
        <CardHeader>
          <CardTitle>Movement Screen Measurements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {movementScreens.map((measurement) => (
              <div key={measurement._id} className="py-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{measurement.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Type: {measurement.type}
                    {measurement.unit ? ` | Unit: ${measurement.unit}` : ''}
                    {measurement.config.hasSides ? ' | Left/Right Sides' : ''}
                    {measurement.isDefault ? ' | Default' : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Measurement</DialogTitle>
                      </DialogHeader>
                      <MeasurementForm 
                        initialData={measurement}
                        onSubmit={(data) => updateMutation.mutate({ 
                          id: measurement._id, 
                          data 
                        })}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => setDeleteId(measurement._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Measurements Section */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Measurements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {performanceMeasures.map((measurement) => (
              <div key={measurement._id} className="py-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{measurement.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Type: {measurement.type}
                    {measurement.unit ? ` | Unit: ${measurement.unit}` : ''}
                    {measurement.config.hasAttempts ? 
                      ` | ${measurement.config.maxAttempts} attempts` : ''}
                    {measurement.isDefault ? ' | Default' : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Measurement</DialogTitle>
                      </DialogHeader>
                      <MeasurementForm 
                        initialData={measurement}
                        onSubmit={(data) => updateMutation.mutate({ 
                          id: measurement._id, 
                          data 
                        })}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => setDeleteId(measurement._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reinitialize Default Measurements?</AlertDialogTitle>
            <AlertDialogDescription>
              This will ensure all default measurements are present and properly configured. 
              Custom measurements will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReinitialize}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this measurement type. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deleteMutation.mutate(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MeasurementManager;