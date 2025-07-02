
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { SyncConfiguration } from '@/types/systemSettings';

interface SyncConfigModalProps {
  syncConfig: SyncConfiguration | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: SyncConfiguration) => void;
}

export const SyncConfigModal = ({ syncConfig, isOpen, onClose, onSave }: SyncConfigModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<SyncConfiguration>>({
    name: '',
    source: '',
    target: '',
    frequency: 'daily',
    status: 'active',
    description: '',
  });

  const isEditing = syncConfig !== null;

  useEffect(() => {
    if (isOpen) {
      if (syncConfig) {
        console.log('📝 [SyncConfigModal] Editing sync config:', syncConfig.name);
        setFormData(syncConfig);
      } else {
        console.log('➕ [SyncConfigModal] Creating new sync config');
        setFormData({
          name: '',
          source: '',
          target: '',
          frequency: 'daily',
          status: 'active',
          description: '',
        });
      }
    }
  }, [syncConfig, isOpen]);

  const handleSave = () => {
    console.log('💾 [SyncConfigModal] Saving sync config:', formData.name);
    
    if (!formData.name || !formData.source || !formData.target) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const configToSave: SyncConfiguration = {
      id: syncConfig?.id || `sync_${Date.now()}`,
      name: formData.name!,
      source: formData.source!,
      target: formData.target!,
      frequency: formData.frequency as 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly',
      status: formData.status as 'active' | 'paused' | 'error',
      description: formData.description || '',
      lastRun: syncConfig?.lastRun || new Date().toISOString(),
      nextRun: syncConfig?.nextRun || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      recordsProcessed: syncConfig?.recordsProcessed || 0,
    };

    onSave(configToSave);
    
    toast({
      title: isEditing ? "Sincronização Atualizada" : "Sincronização Criada",
      description: `${configToSave.name} foi ${isEditing ? 'atualizada' : 'criada'} com sucesso`,
    });

    onClose();
  };

  const handleCancel = () => {
    console.log('❌ [SyncConfigModal] Cancelling sync config modal');
    onClose();
  };

  const updateFormData = (field: keyof SyncConfiguration, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Sincronização' : 'Nova Sincronização'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifique as configurações da sincronização existente.'
              : 'Configure uma nova sincronização de dados entre sistemas.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="Nome da sincronização"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequência</Label>
              <Select 
                value={formData.frequency} 
                onValueChange={(value) => updateFormData('frequency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar frequência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Tempo Real</SelectItem>
                  <SelectItem value="hourly">A cada hora</SelectItem>
                  <SelectItem value="daily">Diariamente</SelectItem>
                  <SelectItem value="weekly">Semanalmente</SelectItem>
                  <SelectItem value="monthly">Mensalmente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Sistema de Origem *</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => updateFormData('source', e.target.value)}
                placeholder="Ex: ERP Principal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Sistema de Destino *</Label>
              <Input
                id="target"
                value={formData.target}
                onChange={(e) => updateFormData('target', e.target.value)}
                placeholder="Ex: Data Warehouse"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => updateFormData('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="paused">Pausada</SelectItem>
                <SelectItem value="error">Erro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="Descreva o propósito desta sincronização..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? 'Salvar Alterações' : 'Criar Sincronização'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
