import { ApiResponse, AppInfo, AppControlRule, AppUsage } from '@/types';
import { apiClient } from './apiClient';

class AppManagementService {
  async getInstalledApps(childId: string): Promise<ApiResponse<AppInfo[]>> {
    try {
      const response = await apiClient.get(`/apps/installed/${childId}`);
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Get installed apps error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch installed apps',
      };
    }
  }

  async blockApp(childId: string, packageName: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post('/apps/block', {
        childId,
        packageName,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Block app error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to block app',
      };
    }
  }

  async unblockApp(childId: string, packageName: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post('/apps/unblock', {
        childId,
        packageName,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Unblock app error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to unblock app',
      };
    }
  }

  async setAppTimeLimit(
    childId: string,
    packageName: string,
    limitMinutes: number
  ): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post('/apps/time-limit', {
        childId,
        packageName,
        limitMinutes,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Set app time limit error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to set app time limit',
      };
    }
  }

  async createAppRule(rule: Omit<AppControlRule, 'id' | 'createdAt'>): Promise<ApiResponse<AppControlRule>> {
    try {
      const response = await apiClient.post('/apps/rules', rule);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Create app rule error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create app rule',
      };
    }
  }

  async updateAppRule(ruleId: string, updates: Partial<AppControlRule>): Promise<ApiResponse<AppControlRule>> {
    try {
      const response = await apiClient.put(`/apps/rules/${ruleId}`, updates);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Update app rule error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update app rule',
      };
    }
  }

  async deleteAppRule(ruleId: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete(`/apps/rules/${ruleId}`);

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Delete app rule error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete app rule',
      };
    }
  }

  async getAppRules(childId: string): Promise<ApiResponse<AppControlRule[]>> {
    try {
      const response = await apiClient.get(`/apps/rules/${childId}`);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Get app rules error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch app rules',
      };
    }
  }

  async enableHomeworkMode(childId: string, allowedApps: string[], durationMinutes: number): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post('/apps/homework-mode', {
        childId,
        allowedApps,
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

  async disableHomeworkMode(childId: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post('/apps/homework-mode/disable', {
        childId,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Disable homework mode error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to disable homework mode',
      };
    }
  }

  async bulkBlockApps(childId: string, packageNames: string[]): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post('/apps/bulk-block', {
        childId,
        packageNames,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Bulk block apps error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to block apps',
      };
    }
  }

  async getAppUsageStatistics(
    childId: string,
    period: 'day' | 'week' | 'month'
  ): Promise<ApiResponse<{
    totalUsage: number;
    appBreakdown: AppUsage[];
    categoryBreakdown: { [key: string]: number };
    mostUsedApps: AppUsage[];
  }>> {
    try {
      const response = await apiClient.get('/apps/statistics', {
        params: { childId, period },
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Get app usage statistics error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch app usage statistics',
      };
    }
  }

  async requestAppInstall(childId: string, appName: string, packageName: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post('/apps/install-request', {
        childId,
        appName,
        packageName,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Request app install error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to request app installation',
      };
    }
  }

  async approveAppInstall(requestId: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post(`/apps/install-request/${requestId}/approve`);

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Approve app install error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to approve app installation',
      };
    }
  }

  async denyAppInstall(requestId: string, reason?: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post(`/apps/install-request/${requestId}/deny`, {
        reason,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Deny app install error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to deny app installation',
      };
    }
  }
}

export const appManagementService = new AppManagementService();
