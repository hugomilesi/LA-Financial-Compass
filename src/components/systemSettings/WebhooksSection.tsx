
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Webhook } from '@/types/systemSettings';
import { WebhookConfigModal } from './WebhookConfigModal';
import { Plus, Play, Edit, Trash2, AlertCircle } from 'lucide-react';

interface WebhooksSectionProps {
  webhooks: Webhook[];
  onUpdateWebhook: (webhook: Webhook) => void;
  onDeleteWebhook: (webhookId: string) => void;
  onTestWebhook: (webhookId: string) => Promise<{ success: boolean; message: string }>;
}

export const WebhooksSection = ({ webhooks, onUpdateWebhook, onDeleteWebhook, onTestWebhook }: WebhooksSectionProps) => {
  const { toast } = useToast();
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'error':
        return 'Erro';
      default:
        return 'Desconhecido';
    }
  };

  const handleTestWebhook = async (webhook: Webhook) => {
    console.log('🧪 [WebhooksSection] Testing webhook:', webhook.name);
    setTestingWebhook(webhook.id);
    
    try {
      const result = await onTestWebhook(webhook.id);
      console.log('✅ [WebhooksSection] Test result:', result);
      
      toast({
        title: "Teste de Webhook",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error('❌ [WebhooksSection] Test error:', error);
      toast({
        title: "Erro no Teste",
        description: `Falha ao testar webhook ${webhook.name}`,
        variant: "destructive",
      });
    } finally {
      setTestingWebhook(null);
    }
  };

  const handleEditWebhook = (webhook: Webhook) => {
    console.log('✏️ [WebhooksSection] Edit webhook:', webhook.name);
    setSelectedWebhook(webhook);
    setIsModalOpen(true);
  };

  const handleNewWebhook = () => {
    console.log('➕ [WebhooksSection] New webhook');
    setSelectedWebhook(null);
    setIsModalOpen(true);
  };

  const handleSaveWebhook = (webhook: Webhook) => {
    console.log('💾 [WebhooksSection] Save webhook:', webhook.name);
    onUpdateWebhook(webhook);
    setIsModalOpen(false);
  };

  const handleDeleteWebhook = (webhook: Webhook) => {
    console.log('🗑️ [WebhooksSection] Delete webhook:', webhook.name);
    onDeleteWebhook(webhook.id);
    toast({
      title: "Webhook Removido",
      description: `${webhook.name} foi removido com sucesso`,
    });
  };

  const formatLastTriggered = (lastTriggered: string) => {
    const date = new Date(lastTriggered);
    return date.toLocaleString('pt-BR');
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'POST':
        return 'bg-blue-100 text-blue-800';
      case 'GET':
        return 'bg-green-100 text-green-800';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Webhooks & Endpoints</h2>
          <p className="text-gray-600">
            Configure endpoints para receber notificações automáticas de eventos do sistema.
          </p>
        </div>
        <Button onClick={handleNewWebhook}>
          <Plus className="h-4 w-4" />
          Adicionar Webhook
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Webhooks Configurados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Eventos</TableHead>
                <TableHead>Último Disparo</TableHead>
                <TableHead>Tentativas</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell className="font-medium">{webhook.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{webhook.url}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getMethodColor(webhook.method)}`}>
                      {webhook.method}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getStatusColor(webhook.status)}`}>
                      {getStatusText(webhook.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.slice(0, 2).map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                      {webhook.events.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{webhook.events.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatLastTriggered(webhook.lastTriggered)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {webhook.retryCount > 0 && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">{webhook.retryCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTestWebhook(webhook)}
                        disabled={testingWebhook === webhook.id}
                        title="Testar Webhook"
                      >
                        {testingWebhook === webhook.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditWebhook(webhook)}
                        title="Editar Webhook"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" title="Excluir Webhook">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja remover o webhook "{webhook.name}"? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteWebhook(webhook)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <WebhookConfigModal
        webhook={selectedWebhook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveWebhook}
        onTest={onTestWebhook}
      />
    </div>
  );
};
