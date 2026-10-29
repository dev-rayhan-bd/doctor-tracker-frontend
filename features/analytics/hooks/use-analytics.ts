'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analytics.service';

export const ANALYTICS_KEYS = {
  dashboard: ['analytics', 'dashboard'] as const,
};

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ANALYTICS_KEYS.dashboard,
    queryFn: () => analyticsService.getDashboardAnalytics(),
    staleTime: 30 * 1000, // 30 seconds
  });
}

