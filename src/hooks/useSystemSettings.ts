
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
        console.error('Error loading system settings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateIntegration = async (integration: ExternalIntegration) => {
    if (!data) return;
    
    const updatedIntegrations = data.integrations.map(int => 
      int.id === integration.id ? integration : int
    );
    
    setData({
      ...data,
      integrations: updatedIntegrations
    });
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
    if (!data) return;
    
    const updatedParameters = data.parameters.map(param => 
      param.id === parameter.id ? parameter : param
    );
    
    setData({
      ...data,
      parameters: updatedParameters
    });
  };

  const testWebhook = async (webhookId: string) => {
    console.log('Testing webhook:', webhookId);
    // Simulate webhook test
    return { success: true, message: 'Webhook test successful' };
  };

  const testConnection = async (integrationId: string) => {
    console.log('Testing connection:', integrationId);
    // Simulate connection test
    return { success: true, message: 'Connection test successful' };
  };

  const runSync = async (syncId: string) => {
    console.log('Running sync:', syncId);
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
