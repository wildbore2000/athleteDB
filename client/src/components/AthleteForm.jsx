// components/AthleteForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useAthlete, useCreateAthlete, useUpdateAthlete } from '../hooks';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';

export const AthleteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: athleteData, isLoading } = useAthlete(id);
  const createAthlete = useCreateAthlete();
  const updateAthlete = useUpdateAthlete();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: athleteData?.data
  });

  const onSubmit = async (data) => {
    try {
      if (id) {
        await updateAthlete.mutateAsync({ id, data });
      } else {
        await createAthlete.mutateAsync(data);
      }
      navigate('/athletes');
    } catch (error) {
      console.error('Error saving athlete:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Edit' : 'New'} Athlete</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Name *</Label>
            <Input {...register('name', { required: 'Name is required' })} />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name.message}</span>
            )}
          </div>

          <div>
            <Label>Date of Birth</Label>
            <Input type="date" {...register('dateOfBirth')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Height (inches)</Label>
              <Input
                type="number"
                step="0.1"
                {...register('height.value')}
              />
            </div>
            <div>
              <Label>Weight (lbs)</Label>
              <Input
                type="number"
                step="0.1"
                {...register('weight.value')}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            {id ? 'Update' : 'Create'} Athlete
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};
