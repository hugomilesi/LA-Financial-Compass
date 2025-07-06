import { useState, useEffect } from 'react';
import { SystemSettingsData, ExternalIntegration, Webhook, Credential, SyncConfiguration, IntegrationLog, SystemParameter } from '@/types/systemSettings';
import { getSystemSettingsData } from '@/utils/systemSettingsData';

export const useSystemSettings = () => {
  const [data, setData] = useState<SystemSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const settingsData = await getSystemSettingsData();
        
        setData(settingsData);
        setError(null);
      } catch (err) {
        
        setError('Failed to load system settings');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateIntegration = async (integration: ExternalIntegration) => {
    
    if (!data) {
      console.warn('⚠️ [useSystemSettings] No data available for update');
      return;
    }
    
    const updatedIntegrations = data.integrations.map(int => {
      if (int.id === integration.id) {
        const updated = { ...integration, lastSync: new Date().toISOString() };
        
        return updated;
      }
      return int;
    });
    
    const updatedData = {
      ...data,
      integrations: updatedIntegrations
    };
    
    
    setData(updatedData);
    
    // Force a re-render by creating a completely new object
    setTimeout(() => {
      setData(prev => prev ? { ...prev } : null);
    }, 0);
  };

  const updateWebhook = async (webhook: Webhook) => {
    
    if (!data) return;
    
    const updatedWebhooks = data.webhooks.map(wh => 
      wh.id === webhook.id ? webhook : wh
    );
    
    setData({
      ...data,
      webhooks: updatedWebhooks
    });
  };

  const updateCredential = async (credential: Credential) => {
    
    if (!data) return;
    
    const updatedCredentials = data.credentials.map(cred => 
      cred.id === credential.id ? credential : cred
    );
    
    setData({
      ...data,
      credentials: updatedCredentials
    });
  };

  const updateSyncConfiguration = async (config: SyncConfiguration) => {
    
    if (!data) return;
    
    const updatedConfigs = data.syncConfigurations.map(sync => 
      sync.id === config.id ? config : sync
    );
    
    setData({
      ...data,
      syncConfigurations: updatedConfigs
    });
  };

  const updateSystemParameter = async (parameter: SystemParameter) => {
    
    if (!data) {
      console.warn('⚠️ [useSystemSettings] No data available for parameter update');
      return;
    }
    
    const updatedParameters = data.parameters.map(param => 
      param.id === parameter.id ? { ...parameter, lastModified: new Date().toISOString() } : param
    );
    
    const updatedData = {
      ...data,
      parameters: updatedParameters
    };
    
    
    setData(updatedData);
  };

  const testWebhook = async (webhookId: string) => {
    
    // Simulate webhook test
    return { success: true, message: 'Webhook test successful' };
  };

  const testConnection = async (integrationId: string) => {
    
    // Simulate connection test
    return { success: true, message: 'Connection test successful' };
  };

  const runSync = async (syncId: string) => {
    
    // Simulate sync run
    return { success: true, message: 'Sync completed successfully' };
  };

  return {
    data,
    loading,
    error,
    updateIntegration,
    updateWebhook,
    updateCredential,
    updateSyncConfiguration,
    updateSystemParameter,
    testWebhook,
    testConnection,
    runSync
  };
};
