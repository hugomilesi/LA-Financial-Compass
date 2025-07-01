
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Credential } from '@/types/systemSettings';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface CredentialConfigModalProps {
  credential: Credential | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (credential: Credential) => void;
}

interface FormData {
  name: string;
  type: string;
  service: string;
  description: string;
  value: string;
  expiresAt: string;
  masked: boolean;
}

export const CredentialConfigModal = ({ 
  credential, 
  isOpen, 
  onClose, 
  onSave 
}: CredentialConfigModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showValue, setShowValue] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      name: credential?.name || '',
      type: credential?.type || 'API_KEY',
      service: credential?.service || '',
      description: credential?.description || '',
      value: '', // Never pre-fill sensitive values
      expiresAt: credential?.expiresAt ? credential.expiresAt.split('T')[0] : '',
      masked: credential?.masked ?? true,
    },
  });

  const handleSave = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      const updatedCredential: Credential = {
        id: credential?.id || `cred_${Date.now()}`,
        name: data.name,
        type: data.type as Credential['type'],
        service: data.service,
        status: 'valid', // Assume valid when saving
        expiresAt: data.expiresAt || undefined,
        lastUsed: credential?.lastUsed || new Date().toISOString(),
        description: data.description,
        masked: data.masked,
      };

      onSave(updatedCredential);
      
      toast({
        title: "Credencial Salva",
        description: `${data.name} foi configurado com sucesso.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar a credencial.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateExpiry = (date: string) => {
    if (!date) return true;
    const expiryDate = new Date(date);
    const now = new Date();
    return expiryDate > now;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {credential ? 'Editar Credencial' : 'Nova Credencial'}
          </DialogTitle>
          <DialogDescription>
            Configure uma nova credencial de acesso segura.
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
                    <FormLabel>Nome da Credencial</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: API Key do Stripe" {...field} />
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
                        <SelectItem value="API_KEY">API Key</SelectItem>
                        <SelectItem value="TOKEN">Token</SelectItem>
                        <SelectItem value="OAUTH">OAuth</SelectItem>
                        <SelectItem value="DATABASE">Database</SelectItem>
                        <SelectItem value="CERTIFICATE">Certificado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serviço</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Stripe, PayPal, AWS..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Nome do serviço ou plataforma onde esta credencial será usada
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
                      placeholder="Descreva o uso desta credencial..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Credencial</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showValue ? "text" : "password"}
                        placeholder="Digite a chave, token ou credencial..."
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowValue(!showValue)}
                      >
                        {showValue ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Esta informação será criptografada e armazenada com segurança
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Expiração (Opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Deixe em branco se a credencial não expira
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="masked"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Mascarar Valor
                    </FormLabel>
                    <FormDescription>
                      Ocultar o valor real nas visualizações da interface
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

            {/* Security Warning */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-800">
                  Aviso de Segurança
                </p>
                <p className="text-sm text-amber-700">
                  Credenciais são informações sensíveis. Certifique-se de que apenas pessoas autorizadas tenham acesso a estas configurações.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
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
