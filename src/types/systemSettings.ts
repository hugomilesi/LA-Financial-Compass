
export interface ExternalIntegration {
  id: string;
  name: string;
  type: 'ERP' | 'CRM' | 'Payment' | 'Analytics' | 'Email' | 'Other';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  description: string;
  icon: string;
  configurable: boolean;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  status: 'active' | 'inactive' | 'error';
  events: string[];
  lastTriggered: string;
  retryCount: number;
  description: string;
}

export interface Credential {
  id: string;
  name: string;
  type: 'API_KEY' | 'TOKEN' | 'OAUTH' | 'DATABASE' | 'CERTIFICATE';
  service: string;
  status: 'valid' | 'expired' | 'invalid';
  expiresAt?: string;
  lastUsed: string;
  description: string;
  masked: boolean;
}

export interface SyncConfiguration {
  id: string;
  name: string;
  source: string;
  target: string;
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'paused' | 'error';
  lastRun: string;
  nextRun: string;
  recordsProcessed: number;
  description: string;
}

export interface IntegrationLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  service: string;
  operation: string;
  message: string;
  duration?: number;
  details?: Record<string, any>;
}

export interface SystemParameter {
  id: string;
  category: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  description: string;
  editable: boolean;
  sensitive: boolean;
  lastModified: string;
  modifiedBy: string;
}

export interface SystemSettingsData {
  integrations: ExternalIntegration[];
  webhooks: Webhook[];
  credentials: Credential[];
  syncConfigurations: SyncConfiguration[];
  logs: IntegrationLog[];
  parameters: SystemParameter[];
}
