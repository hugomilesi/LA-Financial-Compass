
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Webhook } from '@/types/systemSettings';
import { Plus, Play, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

interface WebhooksSectionProps {
  webhooks: Webhook[];
}

export const WebhooksSection = ({ webhooks }: WebhooksSectionProps) => {
  const { toast } = useToast();
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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
    setTestingWebhook(webhook.id);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Teste de Webhook",
        description: `Webhook ${webhook.name} testado com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro no Teste",
        description: `Falha ao testar webhook ${webhook.name}`,
        variant: "destructive",
      });
    } finally {
      setTestingWebhook(null);
    }
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
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4" />
          Adicionar Webhook
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Adicionar Novo Webhook</CardTitle>
            <CardDescription>
              Configure um novo endpoint para receber notificações de eventos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="webhook-name">Nome</Label>
                <Input
                  id="webhook-name"
                  placeholder="Nome do webhook"
                />
              </div>
              <div>
                <Label htmlFor="webhook-method">Método</Label>
                <select
                  id="webhook-method"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="POST">POST</option>
                  <option value="GET">GET</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="webhook-url">URL</Label>
              <Input
                id="webhook-url"
                placeholder="https://api.exemplo.com/webhook"
              />
            </div>
            <div>
              <Label htmlFor="webhook-description">Descrição</Label>
              <Input
                id="webhook-description"
                placeholder="Descrição do webhook"
              />
            </div>
            <div className="flex gap-2">
              <Button>Salvar</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                      >
                        {testingWebhook === webhook.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
