
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
import { useForm } from 'react-hook-form';
import { ExternalIntegration } from '@/types/systemSettings';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface IntegrationConfigModalProps {
  integration: ExternalIntegration | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (integration: ExternalIntegration) => void;
  onTest: (integrationId: string) => Promise<{ success: boolean; message: string }>;
}

interface FormData {
  name: string;
  type: string;
  description: string;
  enabled: boolean;
  apiKey: string;
  apiUrl: string;
  timeout: number;
  retryCount: number;
}

export const IntegrationConfigModal = ({ 
  integration, 
  isOpen, 
  onClose, 
  onSave, 
  onTest 
}: IntegrationConfigModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const form = useForm<FormData>({
    defaultValues: {
      name: integration?.name || '',
      type: integration?.type || 'Other',
      description: integration?.description || '',
      enabled: integration?.status === 'connected',
      apiKey: '',
      apiUrl: '',
      timeout: 30,
      retryCount: 3,
    },
  });

  const handleSave = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      const updatedIntegration: ExternalIntegration = {
        id: integration?.id || `int_${Date.now()}`,
        name: data.name,
        type: data.type as ExternalIntegration['type'],
        status: data.enabled ? 'connected' : 'disconnected',
        lastSync: new Date().toISOString(),
        description: data.description,
        icon: integration?.icon || 'Settings',
        configurable: true,
      };

      onSave(updatedIntegration);
      
      toast({
        title: "Integração Salva",
        description: `${data.name} foi configurado com sucesso.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar a integração.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    if (!integration?.id) return;
    
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const result = await onTest(integration.id);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {integration ? 'Configurar Integração' : 'Nova Integração'}
          </DialogTitle>
          <DialogDescription>
            Configure os parâmetros da integração externa.
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
                    <FormLabel>Nome da Integração</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Sistema ERP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ERP">ERP</SelectItem>
                        <SelectItem value="CRM">CRM</SelectItem>
                        <SelectItem value="Payment">Pagamento</SelectItem>
                        <SelectItem value="Analytics">Analytics</SelectItem>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="Other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva a função desta integração..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="apiUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da API</FormLabel>
                    <FormControl>
                      <Input placeholder="https://api.exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chave da API</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Chave secreta da API"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      Integração Ativa
                    </FormLabel>
                    <FormDescription>
                      Ative ou desative esta integração
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
              {integration && (
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleTest}
                  disabled={isLoading}
                >
                  {isLoading ? 'Testando...' : 'Testar Conexão'}
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
