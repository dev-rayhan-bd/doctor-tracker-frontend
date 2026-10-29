import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/api';
import { DashboardAnalyticsData } from '@/types/analytics';

export const analyticsService = {
  async getDashboardAnalytics(): Promise<DashboardAnalyticsData> {
    const response = await apiClient.get<ApiResponse<DashboardAnalyticsData>>(
      API_ENDPOINTS.analytics.dashboard,
    );
    return response.data.data;
  },
};

