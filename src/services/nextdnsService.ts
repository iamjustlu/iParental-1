import { ApiResponse } from '@/types';

interface NextDNSConfig {
  id: string;
  name: string;
  settings: {
    blockpage?: boolean;
    performance?: boolean;
    anonymizedEDNS?: boolean;
    blocklists?: string[];
    allowlists?: string[];
    rewrites?: Array<{ name: string; answer: string }>;
  };
}

interface NextDNSAnalytics {
  queries: number;
  blocked: number;
  relayed: number;
  domains: Array<{
    name: string;
    queries: number;
    blocked: boolean;
  }>;
  protocols: {
    udp: number;
    tcp: number;
    doh: number;
    dot: number;
    doq: number;
  };
  devices: Array<{
    name: string;
    ip: string;
    queries: number;
  }>;
}

class NextDNSService {
  private readonly baseUrl = 'https://api.nextdns.io';
  private readonly configId = '9cc4e8'; // Your NextDNS configuration ID
  private readonly apiKey: string | null = null; // You'll need to get this from NextDNS dashboard

  // Age group based configurations
  private readonly ageGroupConfigs = {
    preschool: {
      name: 'Preschool (3-5)',
      blocklists: [
        'nextdns-recommended',
        'ads-and-trackers-extended',
        'adult-content',
        'social-networks',
        'gaming',
        'dating',
        'gambling',
        'piracy',
        'drugs',
        'violence',
      ],
      allowlists: [
        'pbskids.org',
        'youtube.com/kids',
        'khanacademy.org',
        'abcmouse.com',
        'starfall.com',
        'funbrain.com',
      ],
      safeSearch: true,
      youtubeRestricted: true,
    },
    child: {
      name: 'Child (6-12)',
      blocklists: [
        'nextdns-recommended',
        'ads-and-trackers',
        'adult-content',
        'dating',
        'gambling',
        'piracy',
        'drugs',
        'violence',
      ],
      allowlists: [
        'youtube.com',
        'khanacademy.org',
        'nationalgeographic.com',
        'nasa.gov',
        'wikipedia.org',
        'scratch.mit.edu',
        'code.org',
      ],
      safeSearch: true,
      youtubeRestricted: true,
    },
    teen: {
      name: 'Teen (13-17)',
      blocklists: [
        'nextdns-recommended',
        'ads-and-trackers',
        'adult-content',
        'gambling',
        'piracy',
        'drugs',
      ],
      allowlists: [],
      safeSearch: true,
      youtubeRestricted: false,
    },
    custom: {
      name: 'Custom',
      blocklists: [],
      allowlists: [],
      safeSearch: false,
      youtubeRestricted: false,
    },
  };

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['X-Api-Key'] = this.apiKey;
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`NextDNS API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('NextDNS API request failed:', error);
      throw error;
    }
  }

  async createConfiguration(childName: string, ageGroup: keyof typeof this.ageGroupConfigs): Promise<ApiResponse<{ configId: string; dnsServers: string[] }>> {
    try {
      const config = this.ageGroupConfigs[ageGroup];
      
      // Create new configuration
      const newConfig = await this.makeRequest('/profiles', 'POST', {
        name: `${childName} - ${config.name}`,
        ...config,
      });

      // Generate DNS server addresses for the new config
      const dnsServers = [
        `${newConfig.id}.dns.nextdns.io`,
        `https://dns.nextdns.io/${newConfig.id}`,
        `2a07:a8c0::${newConfig.id.slice(0, 2)}:${newConfig.id.slice(2)}`,
        `2a07:a8c1::${newConfig.id.slice(0, 2)}:${newConfig.id.slice(2)}`,
      ];

      return {
        success: true,
        data: {
          configId: newConfig.id,
          dnsServers,
        },
      };
    } catch (error: any) {
      console.error('Create NextDNS configuration error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create NextDNS configuration',
      };
    }
  }

  async updateConfiguration(configId: string, updates: Partial<NextDNSConfig>): Promise<ApiResponse<void>> {
    try {
      await this.makeRequest(`/profiles/${configId}`, 'PUT', updates);

      return {
        success: true,
      };
    } catch (error: any) {
      console.error('Update NextDNS configuration error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update NextDNS configuration',
      };
    }
  }

  async deleteConfiguration(configId: string): Promise<ApiResponse<void>> {
    try {
      await this.makeRequest(`/profiles/${configId}`, 'DELETE');

      return {
        success: true,
      };
    } catch (error: any) {
      console.error('Delete NextDNS configuration error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete NextDNS configuration',
      };
    }
  }

  async addBlockedDomain(configId: string, domain: string): Promise<ApiResponse<void>> {
    try {
      await this.makeRequest(`/profiles/${configId}/denylist`, 'POST', {
        id: domain,
      });

      return {
        success: true,
      };
    } catch (error: any) {
      console.error('Add blocked domain error:', error);
      return {
        success: false,
        error: error.message || 'Failed to block domain',
      };
    }
  }

  async removeBlockedDomain(configId: string, domain: string): Promise<ApiResponse<void>> {
    try {
      await this.makeRequest(`/profiles/${configId}/denylist/${domain}`, 'DELETE');

      return {
        success: true,
      };
    } catch (error: any) {
      console.error('Remove blocked domain error:', error);
      return {
        success: false,
        error: error.message || 'Failed to unblock domain',
      };
    }
  }

  async addAllowedDomain(configId: string, domain: string): Promise<ApiResponse<void>> {
    try {
      await this.makeRequest(`/profiles/${configId}/allowlist`, 'POST', {
        id: domain,
      });

      return {
        success: true,
      };
    } catch (error: any) {
      console.error('Add allowed domain error:', error);
      return {
        success: false,
        error: error.message || 'Failed to allow domain',
      };
    }
  }

  async removeAllowedDomain(configId: string, domain: string): Promise<ApiResponse<void>> {
    try {
      await this.makeRequest(`/profiles/${configId}/allowlist/${domain}`, 'DELETE');

      return {
        success: true,
      };
    } catch (error: any) {
      console.error('Remove allowed domain error:', error);
      return {
        success: false,
        error: error.message || 'Failed to remove allowed domain',
      };
    }
  }

  async getAnalytics(configId: string, period: 'day' | 'week' | 'month' = 'week'): Promise<ApiResponse<NextDNSAnalytics>> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case 'day':
          startDate.setDate(endDate.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
      }

      const analytics = await this.makeRequest(
        `/profiles/${configId}/analytics?from=${startDate.toISOString()}&to=${endDate.toISOString()}`
      );

      return {
        success: true,
        data: analytics,
      };
    } catch (error: any) {
      console.error('Get NextDNS analytics error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch analytics',
      };
    }
  }

  async enableSafeSearch(configId: string, enabled: boolean): Promise<ApiResponse<void>> {
    try {
      await this.makeRequest(`/profiles/${configId}/settings`, 'PUT', {
        safeSearch: enabled,
      });

      return {
        success: true,
      };
    } catch (error: any) {
      console.error('Enable safe search error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update safe search',
      };
    }
  }

  async enableYouTubeRestricted(configId: string, enabled: boolean): Promise<ApiResponse<void>> {
    try {
      await this.makeRequest(`/profiles/${configId}/settings`, 'PUT', {
        youtubeRestricted: enabled,
      });

      return {
        success: true,
      };
    } catch (error: any) {
      console.error('Enable YouTube restricted error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update YouTube settings',
      };
    }
  }

  getDNSServers(configId: string): string[] {
    return [
      `${configId}.dns.nextdns.io`,
      `https://dns.nextdns.io/${configId}`,
    ];
  }

  getIPv6DNSServers(configId: string): string[] {
    const hex = configId.padStart(6, '0');
    const part1 = hex.slice(0, 2);
    const part2 = hex.slice(2, 4);
    const part3 = hex.slice(4, 6);
    
    return [
      `2a07:a8c0::${part1}:${part2}${part3}`,
      `2a07:a8c1::${part1}:${part2}${part3}`,
    ];
  }

  generateDeviceSetupInstructions(configId: string, deviceType: 'ios' | 'android' | 'windows' | 'macos'): {
    title: string;
    steps: string[];
    dnsServers: string[];
  } {
    const dnsServers = this.getDNSServers(configId);
    const ipv6Servers = this.getIPv6DNSServers(configId);

    const instructions = {
      ios: {
        title: 'iOS Device Setup',
        steps: [
          'Open Settings app',
          'Tap "General"',
          'Tap "VPN & Device Management"',
          'Tap "DNS"',
          'Tap "Configure DNS"',
          'Select "Manual"',
          'Remove existing DNS servers',
          `Add DNS servers: ${dnsServers[0]}`,
          'Tap "Save"',
        ],
      },
      android: {
        title: 'Android Device Setup',
        steps: [
          'Open Settings app',
          'Tap "Network & Internet" or "Connections"',
          'Tap "Advanced" or "More connection settings"',
          'Tap "Private DNS"',
          'Select "Private DNS provider hostname"',
          `Enter: ${dnsServers[0]}`,
          'Tap "Save"',
        ],
      },
      windows: {
        title: 'Windows Device Setup',
        steps: [
          'Open Settings (Windows + I)',
          'Click "Network & Internet"',
          'Click "Ethernet" or "Wi-Fi" (depending on connection)',
          'Click "Change adapter options"',
          'Right-click your connection and select "Properties"',
          'Select "Internet Protocol Version 4 (TCP/IPv4)" and click "Properties"',
          'Select "Use the following DNS server addresses"',
          `Preferred DNS: Extract IP from ${dnsServers[0]}`,
          'Click "OK" to save',
        ],
      },
      macos: {
        title: 'macOS Device Setup',
        steps: [
          'Open System Preferences',
          'Click "Network"',
          'Select your active connection',
          'Click "Advanced"',
          'Click "DNS" tab',
          'Click "+" to add DNS servers',
          `Add: ${dnsServers[0]}`,
          'Click "OK" and "Apply"',
        ],
      },
    };

    return {
      ...instructions[deviceType],
      dnsServers: [...dnsServers, ...ipv6Servers],
    };
  }
}

export const nextdnsService = new NextDNSService();
