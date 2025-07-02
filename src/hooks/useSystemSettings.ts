
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
        console.log('🔄 [useSystemSettings] Loading system settings data...');
        const settingsData = await getSystemSettingsData();
        console.log('✅ [useSystemSettings] Data loaded successfully:', settingsData);
        setData(settingsData);
        setError(null);
      } catch (err) {
        console.error('❌ [useSystemSettings] Error loading system settings:', err);
        setError('Failed to load system settings');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateIntegration = async (integration: ExternalIntegration) => {
    console.log('🔄 [useSystemSettings] Updating integration:', integration.name);
    if (!data) {
      console.warn('⚠️ [useSystemSettings] No data available for update');
      return;
    }
    
    const updatedIntegrations = data.integrations.map(int => 
      int.id === integration.id ? { ...integration, lastSync: new Date().toISOString() } : int
    );
    
    const updatedData = {
      ...data,
      integrations: updatedIntegrations
    };
    
    console.log('✅ [useSystemSettings] Integration updated in state');
    setData(updatedData);
  };

  const updateWebhook = async (webhook: Webhook) => {
    console.log('🔄 [useSystemSettings] Updating webhook:', webhook.name);
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
    console.log('🔄 [useSystemSettings] Updating credential:', credential.name);
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
    console.log('🔄 [useSystemSettings] Updating sync configuration:', config.name);
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
    console.log('🔄 [useSystemSettings] Updating system parameter:', parameter.key);
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
    
    console.log('✅ [useSystemSettings] Parameter updated in state');
    setData(updatedData);
  };

  const testWebhook = async (webhookId: string) => {
    console.log('🧪 [useSystemSettings] Testing webhook:', webhookId);
    // Simulate webhook test
    return { success: true, message: 'Webhook test successful' };
  };

  const testConnection = async (integrationId: string) => {
    console.log('🧪 [useSystemSettings] Testing connection:', integrationId);
    // Simulate connection test
    return { success: true, message: 'Connection test successful' };
  };

  const runSync = async (syncId: string) => {
    console.log('🔄 [useSystemSettings] Running sync:', syncId);
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
