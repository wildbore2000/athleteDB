// src/hooks/useData.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { athleteApi, assessmentApi, analyticsApi,measurementTypeApi  } from '../services/api';

// Query Keys
export const QUERY_KEYS = {
  athletes: 'athletes',
  athlete: 'athlete',
  athleteStats: 'athleteStats',
  athleteTrends: 'athleteTrends',
  assessments: 'assessments',
  assessment: 'assessment',
  assessmentStats: 'assessmentStats',
  dashboardStats: 'dashboardStats',
  performanceTrends: 'performanceTrends',
  movementTypes: 'movementTypes'
};

// Athlete Hooks
export function useAthletes(params) {
  return useQuery({
    queryKey: [QUERY_KEYS.athletes, params],
    queryFn: () => athleteApi.getAthletes(params),
    keepPreviousData: true,
  });
}

export function useAthlete(id) {
  return useQuery({
    queryKey: [QUERY_KEYS.athlete, id],
    queryFn: () => athleteApi.getAthlete(id),
    enabled: !!id,
  });
}

export function useAthleteStats(id) {
  return useQuery({
    queryKey: [QUERY_KEYS.athleteStats, id],
    queryFn: () => athleteApi.getAthleteStats(id),
    enabled: !!id,
  });
}

export function useAthleteTrends(id, metric) {
  return useQuery({
    queryKey: [QUERY_KEYS.athleteTrends, id, metric],
    queryFn: () => athleteApi.getAthleteTrends(id, metric),
    enabled: !!id && !!metric,
  });
}

export function useCreateAthlete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => athleteApi.createAthlete(data),
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.athletes);
    },
  });
}

export function useUpdateAthlete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => athleteApi.updateAthlete(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries([QUERY_KEYS.athlete, variables.id]);
      queryClient.invalidateQueries(QUERY_KEYS.athletes);
    },
  });
}

export function useDeleteAthlete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => athleteApi.deleteAthlete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.athletes);
    },
  });
}

// Assessment Hooks
export function useAssessments(params) {
  return useQuery({
    queryKey: [QUERY_KEYS.assessments, params],
    queryFn: () => assessmentApi.getAssessments(params),
    keepPreviousData: true,
  });
}

export function useAthleteAssessments(athleteId, params) {
  return useQuery({
    queryKey: [QUERY_KEYS.assessments, athleteId, params],
    queryFn: () => assessmentApi.getAthleteAssessments(athleteId, params),
    enabled: !!athleteId,
    keepPreviousData: true,
  });
}

export function useAssessment(id) {
  return useQuery({
    queryKey: [QUERY_KEYS.assessment, id],
    queryFn: () => assessmentApi.getAssessment(id),
    enabled: !!id,
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => assessmentApi.createAssessment(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries(QUERY_KEYS.assessments);
      queryClient.invalidateQueries([QUERY_KEYS.athlete, response.data.athlete]);
    },
  });
}

export function useUpdateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => assessmentApi.updateAssessment(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries([QUERY_KEYS.assessment, variables.id]);
      queryClient.invalidateQueries(QUERY_KEYS.assessments);
      queryClient.invalidateQueries([QUERY_KEYS.athlete, response.data.athlete]);
    },
  });
}

export function useDeleteAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => assessmentApi.deleteAssessment(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(QUERY_KEYS.assessments);
      // Since we don't know the athlete ID here, we may need to invalidate all athlete queries
      queryClient.invalidateQueries(QUERY_KEYS.athletes);
    },
  });
}

// Analytics Hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.dashboardStats],
    queryFn: () => analyticsApi.getDashboardStats(),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

export function usePerformanceTrends(metric, timeframe) {
  return useQuery({
    queryKey: [QUERY_KEYS.performanceTrends, metric, timeframe],
    queryFn: () => analyticsApi.getPerformanceTrends(metric, timeframe),
    enabled: !!metric,
  });
}

export function useComparativeStats(athleteIds, metrics) {
  return useQuery({
    queryKey: ['comparativeStats', athleteIds, metrics],
    queryFn: () => analyticsApi.getComparativeStats(athleteIds, metrics),
    enabled: !!athleteIds?.length && !!metrics?.length,
  });
}

export function useMovementTypes(params) {
  return useQuery({
    queryKey: [QUERY_KEYS.movementTypes, params],
    queryFn: () => measurementTypeApi.getMeasurementTypes(params),
    select: (data) => data.data, // Assumes the array is in the 'data' field of the response
  });
}