import { ApiResponse, ContentFilterLevel, AgeGroup } from '@/types';
import { supabase } from './supabaseClient';
import { nextdnsService } from './nextdnsService';

interface FilterRule {
  id: string;
  childId: string;
  type: 'block' | 'allow';
  category: string;
  pattern: string;
  isActive: boolean;
  createdAt: Date;
}

interface ContentCategory {
  id: string;
  name: string;
  description: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  examples: string[];
}

interface FilterPreset {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  level: ContentFilterLevel;
  rules: Omit<FilterRule, 'id' | 'childId' | 'createdAt'>[];
  description: string;
}

class ContentFilteringService {
  async getFilterSettings(childId: string): Promise<ApiResponse<{
    level: ContentFilterLevel;
    ageGroup: AgeGroup;
    customRules: FilterRule[];
    blockedSites: string[];
    allowedSites: string[];
    safeSearchEnabled: boolean;
    youtubeRestrictedMode: boolean;
  }>> {
    try {
      const response = await apiClient.get(`/content-filter/settings/${childId}`);
      
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Get filter settings error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch filter settings',
      };
    }
  }

  async updateFilterLevel(
    childId: string,
    level: ContentFilterLevel,
    ageGroup: AgeGroup
  ): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.put('/content-filter/level', {
        childId,
        level,
        ageGroup,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Update filter level error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update filter level',
      };
    }
  }

  async addBlockedSite(childId: string, site: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post('/content-filter/blocked-sites', {
        childId,
        site,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Add blocked site error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to block site',
      };
    }
  }

  async removeBlockedSite(childId: string, site: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete('/content-filter/blocked-sites', {
        data: { childId, site },
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Remove blocked site error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to unblock site',
      };
    }
  }

  async addAllowedSite(childId: string, site: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post('/content-filter/allowed-sites', {
        childId,
        site,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Add allowed site error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to allow site',
      };
    }
  }

  async removeAllowedSite(childId: string, site: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete('/content-filter/allowed-sites', {
        data: { childId, site },
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Remove allowed site error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to remove allowed site',
      };
    }
  }

  async enableSafeSearch(childId: string, enabled: boolean): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.put('/content-filter/safe-search', {
        childId,
        enabled,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Enable safe search error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update safe search',
      };
    }
  }

  async enableYouTubeRestricted(childId: string, enabled: boolean): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.put('/content-filter/youtube-restricted', {
        childId,
        enabled,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Enable YouTube restricted error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update YouTube settings',
      };
    }
  }

  async createCustomRule(
    childId: string,
    rule: Omit<FilterRule, 'id' | 'childId' | 'createdAt'>
  ): Promise<ApiResponse<FilterRule>> {
    try {
      const response = await apiClient.post('/content-filter/rules', {
        childId,
        ...rule,
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Create custom rule error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create custom rule',
      };
    }
  }

  async updateCustomRule(
    ruleId: string,
    updates: Partial<FilterRule>
  ): Promise<ApiResponse<FilterRule>> {
    try {
      const response = await apiClient.put(`/content-filter/rules/${ruleId}`, updates);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Update custom rule error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update custom rule',
      };
    }
  }

  async deleteCustomRule(ruleId: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete(`/content-filter/rules/${ruleId}`);

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Delete custom rule error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete custom rule',
      };
    }
  }

  async getFilterPresets(): Promise<ApiResponse<FilterPreset[]>> {
    try {
      const response = await apiClient.get('/content-filter/presets');

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Get filter presets error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch filter presets',
      };
    }
  }

  async applyPreset(childId: string, presetId: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post('/content-filter/apply-preset', {
        childId,
        presetId,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Apply preset error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to apply preset',
      };
    }
  }

  async getContentCategories(): Promise<ApiResponse<ContentCategory[]>> {
    try {
      const response = await apiClient.get('/content-filter/categories');

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Get content categories error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch content categories',
      };
    }
  }

  async checkUrl(url: string, childId: string): Promise<ApiResponse<{
    allowed: boolean;
    category: string;
    reason: string;
    ruleMatched?: string;
  }>> {
    try {
      const response = await apiClient.post('/content-filter/check-url', {
        url,
        childId,
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Check URL error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to check URL',
      };
    }
  }

  async getFilteringStatistics(childId: string, period: 'day' | 'week' | 'month'): Promise<ApiResponse<{
    totalRequests: number;
    blockedRequests: number;
    allowedRequests: number;
    topBlockedCategories: Array<{ category: string; count: number }>;
    topBlockedSites: Array<{ site: string; count: number }>;
    timeBreakdown: Array<{ hour: number; blocked: number; allowed: number }>;
  }>> {
    try {
      const response = await apiClient.get('/content-filter/statistics', {
        params: { childId, period },
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Get filtering statistics error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch filtering statistics',
      };
    }
  }

  async requestBypass(
    childId: string,
    url: string,
    reason: string
  ): Promise<ApiResponse<{ requestId: string }>> {
    try {
      const response = await apiClient.post('/content-filter/bypass-request', {
        childId,
        url,
        reason,
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Request bypass error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to request bypass',
      };
    }
  }

  async handleBypassRequest(
    requestId: string,
    action: 'approve' | 'deny',
    duration?: number // minutes
  ): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post(`/content-filter/bypass-request/${requestId}/${action}`, {
        duration,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Handle bypass request error:', error);
      return {
        success: false,
        error: error.response?.data?.message || `Failed to ${action} bypass request`,
      };
    }
  }
}

export const contentFilteringService = new ContentFilteringService();
