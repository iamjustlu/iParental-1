import { ApiResponse, ScreenTimeData, AppUsage } from '@/types';
import { apiClient } from './apiClient';

class ScreenTimeService {
  async getScreenTimeData(childId: string, dateRange: { from: Date; to: Date }): Promise<ApiResponse<ScreenTimeData[]>> {
    try {
      const response = await apiClient.get('/screen-time/data', {
        params: {
          childId,
          from: dateRange.from.toISOString(),
          to: dateRange.to.toISOString(),
        },
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Get screen time data error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch screen time data',
      };
    }
  }

  async setScreenTimeLimit(childId: string, limitMinutes: number): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post('/screen-time/limit', {
        childId,
        limitMinutes,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Set screen time limit error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to set screen time limit',
      };
    }
  }

  async setScheduleRestrictions(
    childId: string,
    restrictions: {
      bedtime: string;
      wakeTime: string;
      allowedTimes: Array<{ start: string; end: string; days: number[] }>;
    }
  ): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post('/screen-time/schedule', {
        childId,
        ...restrictions,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Set schedule restrictions error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to set schedule restrictions',
      };
    }
  }

  async enableHomeworkMode(childId: string, durationMinutes: number): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post('/screen-time/homework-mode', {
        childId,
        durationMinutes,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Enable homework mode error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to enable homework mode',
      };
    }
  }

  async addBonusTime(childId: string, bonusMinutes: number, reason: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post('/screen-time/bonus', {
        childId,
        bonusMinutes,
        reason,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Add bonus time error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add bonus time',
      };
    }
  }

  async pauseScreenTime(childId: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post('/screen-time/pause', { childId });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Pause screen time error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to pause screen time',
      };
    }
  }

  async resumeScreenTime(childId: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post('/screen-time/resume', { childId });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Resume screen time error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to resume screen time',
      };
    }
  }

  async getUsageStatistics(childId: string, period: 'day' | 'week' | 'month'): Promise<ApiResponse<{
    totalScreenTime: number;
    appBreakdown: AppUsage[];
    dailyAverages: number[];
    comparisonToPrevious: number;
  }>> {
    try {
      const response = await apiClient.get('/screen-time/statistics', {
        params: { childId, period },
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Get usage statistics error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch usage statistics',
      };
    }
  }
}

export const screenTimeService = new ScreenTimeService();
