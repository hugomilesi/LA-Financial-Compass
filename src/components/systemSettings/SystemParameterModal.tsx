
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { SystemParameter } from '@/types/systemSettings';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Lock } from 'lucide-react';

interface SystemParameterModalProps {
  parameter: SystemParameter | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (parameter: SystemParameter) => void;
}

interface FormData {
  category: string;
  key: string;
  value: string;
  type: string;
  description: string;
  editable: boolean;
  sensitive: boolean;
}

const parameterCategories = [
  'Sistema',
  'Segurança',
  'Integração',
  'Interface',
  'Notificações',
  'Performance',
  'Auditoria',
];

export const SystemParameterModal = ({ 
  parameter, 
  isOpen, 
  onClose, 
  onSave 
}: SystemParameterModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      category: parameter?.category || 'Sistema',
      key: parameter?.key || '',
      value: parameter?.value || '',
      type: parameter?.type || 'string',
      description: parameter?.description || '',
      editable: parameter?.editable ?? true,
      sensitive: parameter?.sensitive ?? false,
    },
  });

  const handleSave = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      const updatedParameter: SystemParameter = {
        id: parameter?.id || `param_${Date.now()}`,
        category: data.category,
        key: data.key,
        value: data.value,
        type: data.type as SystemParameter['type'],
        description: data.description,
        editable: data.editable,
        sensitive: data.sensitive,
        lastModified: new Date().toISOString(),
        modifiedBy: 'Admin', // In a real app, this would be the current user
      };

      onSave(updatedParameter);
      
      toast({
        title: "Parâmetro Salvo",
        description: `${data.key} foi configurado com sucesso.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar o parâmetro.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateValue = (value: string, type: string) => {
    switch (type) {
      case 'number':
        return !isNaN(Number(value)) || 'Deve ser um número válido';
      case 'boolean':
        return ['true', 'false'].includes(value.toLowerCase()) || 'Deve ser true ou false';
      case 'json':
        try {
          JSON.parse(value);
          return true;
        } catch {
          return 'Deve ser um JSON válido';
        }
      default:
        return true;
    }
  };

  const renderValueInput = (field: any, type: string) => {
    switch (type) {
      case 'boolean':
        return (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar valor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Verdadeiro</SelectItem>
              <SelectItem value="false">Falso</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'json':
        return (
          <Textarea 
            placeholder='{"exemplo": "valor"}'
            className="min-h-[100px] font-mono"
            {...field}
          />
        );
      case 'number':
        return (
          <Input 
            type="number"
            placeholder="Digite um número..."
            {...field}
          />
        );
      default:
        return (
          <Input 
            placeholder="Digite o valor..."
            {...field}
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {parameter ? 'Editar Parâmetro' : 'Novo Parâmetro'}
          </DialogTitle>
          <DialogDescription>
            Configure um parâmetro do sistema.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {parameterCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Valor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">Texto</SelectItem>
                        <SelectItem value="number">Número</SelectItem>
                        <SelectItem value="boolean">Booleano</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave do Parâmetro</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: max_file_size, enable_notifications..."
                      {...field}
                      disabled={!!parameter} // Don't allow editing existing keys
                    />
                  </FormControl>
                  <FormDescription>
                    Identificador único para este parâmetro (não pode ser alterado após criação)
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
                      placeholder="Descreva o que este parâmetro controla..."
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
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    {renderValueInput(field, form.watch('type'))}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="editable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Editável
                      </FormLabel>
                      <FormDescription>
                        Permite que este parâmetro seja editado pela interface
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

              <FormField
                control={form.control}
                name="sensitive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5 flex items-center gap-2">
                      <div>
                        <FormLabel className="text-base flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Sensível
                        </FormLabel>
                        <FormDescription>
                          Marcar como informação sensível (valor será mascarado)
                        </FormDescription>
                      </div>
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
            </div>

            {/* Warning for system critical parameters */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-800">
                  Atenção
                </p>
                <p className="text-sm text-amber-700">
                  Alterações em parâmetros do sistema podem afetar o funcionamento da aplicação. Teste sempre em ambiente de desenvolvimento primeiro.
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
