
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { Webhook } from '@/types/systemSettings';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, Plus, X } from 'lucide-react';

interface WebhookConfigModalProps {
  webhook: Webhook | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (webhook: Webhook) => void;
  onTest: (webhookId: string) => Promise<{ success: boolean; message: string }>;
}

interface FormData {
  name: string;
  url: string;
  method: string;
  description: string;
  enabled: boolean;
  events: string[];
  retryCount: number;
  timeout: number;
  headers: { key: string; value: string }[];
}

const availableEvents = [
  'user.created',
  'user.updated',
  'user.deleted',
  'payment.completed',
  'payment.failed',
  'order.created',
  'order.updated',
  'integration.sync',
  'system.alert',
];

export const WebhookConfigModal = ({ 
  webhook, 
  isOpen, 
  onClose, 
  onSave, 
  onTest 
}: WebhookConfigModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const form = useForm<FormData>({
    defaultValues: {
      name: webhook?.name || '',
      url: webhook?.url || '',
      method: webhook?.method || 'POST',
      description: webhook?.description || '',
      enabled: webhook?.status === 'active',
      events: webhook?.events || [],
      retryCount: webhook?.retryCount || 3,
      timeout: 30,
      headers: [{ key: '', value: '' }],
    },
  });

  const handleSave = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      const updatedWebhook: Webhook = {
        id: webhook?.id || `wh_${Date.now()}`,
        name: data.name,
        url: data.url,
        method: data.method as Webhook['method'],
        status: data.enabled ? 'active' : 'inactive',
        events: data.events,
        lastTriggered: webhook?.lastTriggered || new Date().toISOString(),
        retryCount: data.retryCount,
        description: data.description,
      };

      onSave(updatedWebhook);
      
      toast({
        title: "Webhook Salvo",
        description: `${data.name} foi configurado com sucesso.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar o webhook.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    if (!webhook?.id) return;
    
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const result = await onTest(webhook.id);
      setTestResult(result);
      
      toast({
        title: result.success ? "Teste Bem-sucedido" : "Teste Falhou",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      setTestResult({ success: false, message: "Erro ao executar o teste" });
    } finally {
      setIsLoading(false);
    }
  };

  const addHeader = () => {
    const currentHeaders = form.getValues('headers');
    form.setValue('headers', [...currentHeaders, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    const currentHeaders = form.getValues('headers');
    form.setValue('headers', currentHeaders.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {webhook ? 'Configurar Webhook' : 'Novo Webhook'}
          </DialogTitle>
          <DialogDescription>
            Configure o endpoint webhook para receber notificações de eventos.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Webhook</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Notificações de Pagamento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método HTTP</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Webhook</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://seu-servidor.com/webhook" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    URL que receberá as notificações dos eventos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o propósito deste webhook..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <Label className="text-base font-medium">Eventos</Label>
              <div className="grid grid-cols-2 gap-3">
                {availableEvents.map((event) => (
                  <FormField
                    key={event}
                    control={form.control}
                    name="events"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(event)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              if (checked) {
                                field.onChange([...current, event]);
                              } else {
                                field.onChange(current.filter((item) => item !== event));
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {event}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="timeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeout (segundos)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="300"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="retryCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tentativas de Retry</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="10"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Webhook Ativo
                    </FormLabel>
                    <FormDescription>
                      Ative ou desative este webhook
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {testResult && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span className="text-sm">{testResult.message}</span>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              {webhook && (
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleTest}
                  disabled={isLoading}
                >
                  {isLoading ? 'Testando...' : 'Testar Webhook'}
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
