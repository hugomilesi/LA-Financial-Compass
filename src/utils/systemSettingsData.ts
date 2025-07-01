
import { SystemSettingsData } from '@/types/systemSettings';

// Mock data for system settings
export const getSystemSettingsData = async (): Promise<SystemSettingsData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    integrations: [
      {
        id: '1',
        name: 'SAP ERP',
        type: 'ERP',
        status: 'connected',
        lastSync: '2024-01-15T10:30:00Z',
        description: 'Integração com sistema SAP para sincronização de dados financeiros',
        icon: 'Building2',
        configurable: true
      },
      {
        id: '2',
        name: 'Salesforce CRM',
        type: 'CRM',
        status: 'connected',
        lastSync: '2024-01-15T09:15:00Z',
        description: 'CRM para gestão de leads e relacionamento com alunos',
        icon: 'Users',
        configurable: true
      },
      {
        id: '3',
        name: 'Stripe Payment',
        type: 'Payment',
        status: 'error',
        lastSync: '2024-01-14T15:20:00Z',
        description: 'Gateway de pagamento para processamento de mensalidades',
        icon: 'CreditCard',
        configurable: true
      },
      {
        id: '4',
        name: 'Google Analytics',
        type: 'Analytics',
        status: 'connected',
        lastSync: '2024-01-15T11:00:00Z',
        description: 'Análise de dados e métricas de performance',
        icon: 'BarChart3',
        configurable: false
      }
    ],
    webhooks: [
      {
        id: '1',
        name: 'Payment Notifications',
        url: 'https://api.lamusic.com/webhooks/payments',
        method: 'POST',
        status: 'active',
        events: ['payment.completed', 'payment.failed'],
        lastTriggered: '2024-01-15T10:45:00Z',
        retryCount: 0,
        description: 'Notificações de pagamentos processados'
      },
      {
        id: '2',
        name: 'Student Enrollment',
        url: 'https://api.lamusic.com/webhooks/enrollment',
        method: 'POST',
        status: 'active',
        events: ['student.enrolled', 'student.withdrawn'],
        lastTriggered: '2024-01-15T08:30:00Z',
        retryCount: 0,
        description: 'Eventos de matrícula e cancelamento de alunos'
      },
      {
        id: '3',
        name: 'System Alerts',
        url: 'https://api.lamusic.com/webhooks/alerts',
        method: 'POST',
        status: 'error',
        events: ['system.error', 'system.warning'],
        lastTriggered: '2024-01-14T16:20:00Z',
        retryCount: 3,
        description: 'Alertas críticos do sistema'
      }
    ],
    credentials: [
      {
        id: '1',
        name: 'SAP API Key',
        type: 'API_KEY',
        service: 'SAP ERP',
        status: 'valid',
        expiresAt: '2024-12-31T23:59:59Z',
        lastUsed: '2024-01-15T10:30:00Z',
        description: 'Chave de API para integração com SAP',
        masked: true
      },
      {
        id: '2',
        name: 'Salesforce OAuth Token',
        type: 'OAUTH',
        service: 'Salesforce CRM',
        status: 'valid',
        expiresAt: '2024-06-15T12:00:00Z',
        lastUsed: '2024-01-15T09:15:00Z',
        description: 'Token OAuth para Salesforce',
        masked: true
      },
      {
        id: '3',
        name: 'Stripe Secret Key',
        type: 'API_KEY',
        service: 'Stripe Payment',
        status: 'expired',
        expiresAt: '2024-01-10T00:00:00Z',
        lastUsed: '2024-01-14T15:20:00Z',
        description: 'Chave secreta do Stripe',
        masked: true
      },
      {
        id: '4',
        name: 'Database Connection',
        type: 'DATABASE',
        service: 'PostgreSQL',
        status: 'valid',
        lastUsed: '2024-01-15T11:30:00Z',
        description: 'Credenciais do banco de dados principal',
        masked: true
      }
    ],
    syncConfigurations: [
      {
        id: '1',
        name: 'Financial Data Sync',
        source: 'SAP ERP',
        target: 'LA Music Database',
        frequency: 'hourly',
        status: 'active',
        lastRun: '2024-01-15T10:00:00Z',
        nextRun: '2024-01-15T11:00:00Z',
        recordsProcessed: 1247,
        description: 'Sincronização de dados financeiros do SAP'
      },
      {
        id: '2',
        name: 'Student Data Sync',
        source: 'Salesforce CRM',
        target: 'LA Music Database',
        frequency: 'daily',
        status: 'active',
        lastRun: '2024-01-15T02:00:00Z',
        nextRun: '2024-01-16T02:00:00Z',
        recordsProcessed: 856,
        description: 'Sincronização de dados de alunos e leads'
      },
      {
        id: '3',
        name: 'Payment Reconciliation',
        source: 'Stripe Payment',
        target: 'LA Music Database',
        frequency: 'realtime',
        status: 'error',
        lastRun: '2024-01-14T15:20:00Z',
        nextRun: '2024-01-15T12:00:00Z',
        recordsProcessed: 0,
        description: 'Conciliação de pagamentos em tempo real'
      }
    ],
    logs: [
      {
        id: '1',
        timestamp: '2024-01-15T10:45:00Z',
        level: 'success',
        service: 'Stripe Payment',
        operation: 'payment_webhook',
        message: 'Payment webhook processed successfully',
        duration: 125,
        details: { paymentId: 'pi_1234567890', amount: 450.00 }
      },
      {
        id: '2',
        timestamp: '2024-01-15T10:30:00Z',
        level: 'info',
        service: 'SAP ERP',
        operation: 'data_sync',
        message: 'Financial data synchronization completed',
        duration: 2340,
        details: { recordsProcessed: 1247, recordsUpdated: 15 }
      },
      {
        id: '3',
        timestamp: '2024-01-15T09:15:00Z',
        level: 'warning',
        service: 'Salesforce CRM',
        operation: 'lead_sync',
        message: 'Some leads could not be processed due to missing data',
        duration: 890,
        details: { totalLeads: 45, processedLeads: 42, failedLeads: 3 }
      },
      {
        id: '4',
        timestamp: '2024-01-14T16:20:00Z',
        level: 'error',
        service: 'System Alerts',
        operation: 'webhook_delivery',
        message: 'Failed to deliver webhook after 3 retries',
        duration: 5000,
        details: { webhookId: '3', errorCode: 'TIMEOUT', retryCount: 3 }
      }
    ],
    parameters: [
      {
        id: '1',
        category: 'Integration',
        key: 'max_retry_attempts',
        value: '3',
        type: 'number',
        description: 'Número máximo de tentativas para webhooks',
        editable: true,
        sensitive: false,
        lastModified: '2024-01-10T14:00:00Z',
        modifiedBy: 'admin@lamusic.com'
      },
      {
        id: '2',
        category: 'Integration',
        key: 'webhook_timeout',
        value: '30000',
        type: 'number',
        description: 'Timeout para webhooks em milissegundos',
        editable: true,
        sensitive: false,
        lastModified: '2024-01-10T14:00:00Z',
        modifiedBy: 'admin@lamusic.com'
      },
      {
        id: '3',
        category: 'Security',
        key: 'api_rate_limit',
        value: '1000',
        type: 'number',
        description: 'Limite de requisições por hora por API key',
        editable: true,
        sensitive: false,
        lastModified: '2024-01-08T10:30:00Z',
        modifiedBy: 'admin@lamusic.com'
      },
      {
        id: '4',
        category: 'Security',
        key: 'encryption_key',
        value: '***ENCRYPTED***',
        type: 'string',
        description: 'Chave de criptografia para dados sensíveis',
        editable: false,
        sensitive: true,
        lastModified: '2024-01-01T00:00:00Z',
        modifiedBy: 'system'
      },
      {
        id: '5',
        category: 'Sync',
        key: 'batch_size',
        value: '100',
        type: 'number',
        description: 'Tamanho do lote para sincronização de dados',
        editable: true,
        sensitive: false,
        lastModified: '2024-01-12T16:45:00Z',
        modifiedBy: 'tech@lamusic.com'
      }
    ]
  };
};
