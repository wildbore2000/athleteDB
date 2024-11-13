
// src/hooks/useAssessments.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { athleteAssessmentApi } from '../services/api';

const QUERY_KEYS = {
  assessments: 'assessments',
  assessment: 'assessment',
};

export function useAssessments(params) {
  return useQuery({
    queryKey: [QUERY_KEYS.assessments, params],
    queryFn: () => athleteAssessmentApi.getAssessments(params),
    keepPreviousData: true,
  });
}

export function useAssessment(id) {
  return useQuery({
    queryKey: [QUERY_KEYS.assessment, id],
    queryFn: () => athleteAssessmentApi.getAssessment(id),
    enabled: !!id,
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => athleteAssessmentApi.createAssessment(data),
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.assessments);
    },
  });
}

export function useUpdateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => athleteAssessmentApi.updateAssessment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([QUERY_KEYS.assessment, variables.id]);
      queryClient.invalidateQueries(QUERY_KEYS.assessments);
    },
  });
}

export function useDeleteAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => athleteAssessmentApi.deleteAssessment(id),
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.assessments);
    },
  });
}