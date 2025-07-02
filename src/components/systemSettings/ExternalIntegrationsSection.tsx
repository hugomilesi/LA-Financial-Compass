import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { ExternalIntegration } from '@/types/systemSettings';
import { IntegrationConfigModal } from './IntegrationConfigModal';
import { Building2, Users, CreditCard, BarChart3, Settings, Play, Pause, AlertCircle, Plus, Edit, Trash2 } from 'lucide-react';

interface ExternalIntegrationsSectionProps {
  integrations: ExternalIntegration[];
}

export const ExternalIntegrationsSection = ({ integrations }: ExternalIntegrationsSectionProps) => {
  const { toast } = useToast();
  const { updateIntegration, testConnection } = useSystemSettings();
  const [loadingIntegration, setLoadingIntegration] = useState<string | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<ExternalIntegration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getIntegrationIcon = (icon: string) => {
    const icons = {
      'Building2': Building2,
      'Users': Users,
      'CreditCard': CreditCard,
      'BarChart3': BarChart3
    };
    return icons[icon as keyof typeof icons] || Settings;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Conectado';
      case 'disconnected':
        return 'Desconectado';
      case 'error':
        return 'Erro';
      default:
        return 'Desconhecido';
    }
  };

  const handleTestConnection = async (integration: ExternalIntegration) => {
    setLoadingIntegration(integration.id);
    
    try {
      const result = await testConnection(integration.id);
      
      toast({
        title: "Teste de Conexão",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Erro no Teste",
        description: `Falha ao testar conexão com ${integration.name}`,
        variant: "destructive",
      });
    } finally {
      setLoadingIntegration(null);
    }
  };

  const handleToggleIntegration = async (integration: ExternalIntegration) => {
    const newStatus = integration.status === 'connected' ? 'disconnected' : 'connected';
    const updatedIntegration: ExternalIntegration = { 
      ...integration, 
      status: newStatus as 'connected' | 'disconnected' | 'error'
    };
    
    await updateIntegration(updatedIntegration);
    
    toast({
      title: "Integração Atualizada",
      description: `${integration.name} foi ${newStatus === 'connected' ? 'conectado' : 'desconectado'}`,
    });
  };

  const handleEditIntegration = (integration: ExternalIntegration) => {
    setSelectedIntegration(integration);
    setIsModalOpen(true);
  };

  const handleNewIntegration = () => {
    setSelectedIntegration(null);
    setIsModalOpen(true);
  };

  const handleDeleteIntegration = async (integration: ExternalIntegration) => {
    // In a real implementation, this would call a delete API
    toast({
      title: "Integração Removida",
      description: `${integration.name} foi removido com sucesso`,
    });
  };

  const handleSaveIntegration = async (integration: ExternalIntegration) => {
    await updateIntegration(integration);
    setIsModalOpen(false);
  };

  const formatLastSync = (lastSync: string) => {
    const date = new Date(lastSync);
    return date.toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Integrações Externas</h2>
          <p className="text-gray-600">
            Configure e gerencie suas integrações com sistemas externos como ERP, CRM, e outras plataformas.
          </p>
        </div>
        <Button onClick={handleNewIntegration}>
          <Plus className="h-4 w-4" />
          Nova Integração
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => {
          const IconComponent = getIntegrationIcon(integration.icon);
          
          return (
            <Card key={integration.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <IconComponent className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {integration.type}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(integration.status)}`}>
                          {getStatusText(integration.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={integration.status === 'connected'}
                    onCheckedChange={() => handleToggleIntegration(integration)}
                  />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="text-sm">
                  {integration.description}
                </CardDescription>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Última Sincronização:</span>
                    <span className="font-medium">{formatLastSync(integration.lastSync)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Configurável:</span>
                    <span className="font-medium">
                      {integration.configurable ? 'Sim' : 'Não'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTestConnection(integration)}
                    disabled={loadingIntegration === integration.id}
                  >
                    {loadingIntegration === integration.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    Testar
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditIntegration(integration)}
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover a integração "{integration.name}"? 
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteIntegration(integration)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {integration.status === 'error' && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-800">
                      Erro na conexão. Verifique as credenciais.
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <IntegrationConfigModal
        integration={selectedIntegration}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveIntegration}
        onTest={testConnection}
      />
    </div>
  );
};
