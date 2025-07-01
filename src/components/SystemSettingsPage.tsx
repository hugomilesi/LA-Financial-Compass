
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ExternalIntegrationsSection } from './systemSettings/ExternalIntegrationsSection';
import { WebhooksSection } from './systemSettings/WebhooksSection';
import { CredentialsSection } from './systemSettings/CredentialsSection';
import { SyncConfigurationSection } from './systemSettings/SyncConfigurationSection';
import { IntegrationLogsSection } from './systemSettings/IntegrationLogsSection';
import { SystemParametersSection } from './systemSettings/SystemParametersSection';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { useToast } from '@/hooks/use-toast';
import { Settings, Shield, Zap, Database, Activity, Cog } from 'lucide-react';

export const SystemSettingsPage = () => {
  const { data, loading, error } = useSystemSettings();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('integrations');

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar configurações</h2>
          <p className="text-gray-600">{error || 'Dados não disponíveis'}</p>
        </div>
      </div>
    );
  }

  const tabsConfig = [
    {
      id: 'integrations',
      label: 'Integrações',
      icon: Zap,
      description: 'Configurar integrações externas'
    },
    {
      id: 'webhooks',
      label: 'Webhooks',
      icon: Activity,
      description: 'Gerenciar endpoints e webhooks'
    },
    {
      id: 'credentials',
      label: 'Credenciais',
      icon: Shield,
      description: 'Tokens e chaves de API'
    },
    {
      id: 'sync',
      label: 'Sincronização',
      icon: Database,
      description: 'Configurações de sincronização'
    },
    {
      id: 'logs',
      label: 'Logs',
      icon: Activity,
      description: 'Logs de integração'
    },
    {
      id: 'parameters',
      label: 'Parâmetros',
      icon: Cog,
      description: 'Parâmetros do sistema'
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
              <p className="text-gray-600">
                Gerencie integrações, webhooks, credenciais e parâmetros do sistema
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
            Desenvolvedor
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <TabsList className="grid w-full grid-cols-6 h-auto p-1 bg-gray-50 m-1 rounded-lg">
              {tabsConfig.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex flex-col items-center gap-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <IconComponent className="h-5 w-5" />
                    <div className="text-center">
                      <div className="font-medium text-sm">{tab.label}</div>
                      <div className="text-xs text-gray-500 hidden lg:block">
                        {tab.description}
                      </div>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="integrations" className="mt-0">
              <ExternalIntegrationsSection integrations={data.integrations} />
            </TabsContent>

            <TabsContent value="webhooks" className="mt-0">
              <WebhooksSection webhooks={data.webhooks} />
            </TabsContent>

            <TabsContent value="credentials" className="mt-0">
              <CredentialsSection credentials={data.credentials} />
            </TabsContent>

            <TabsContent value="sync" className="mt-0">
              <SyncConfigurationSection syncConfigurations={data.syncConfigurations} />
            </TabsContent>

            <TabsContent value="logs" className="mt-0">
              <IntegrationLogsSection logs={data.logs} />
            </TabsContent>

            <TabsContent value="parameters" className="mt-0">
              <SystemParametersSection parameters={data.parameters} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
