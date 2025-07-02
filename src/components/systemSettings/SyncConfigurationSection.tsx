import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { SyncConfiguration } from '@/types/systemSettings';
import { SyncConfigModal } from './SyncConfigModal';
import { Play, Pause, Edit, Trash2, Plus, Clock, Database } from 'lucide-react';

interface SyncConfigurationSectionProps {
  syncConfigurations: SyncConfiguration[];
}

export const SyncConfigurationSection = ({ syncConfigurations }: SyncConfigurationSectionProps) => {
  const { toast } = useToast();
  const [runningSyncs, setRunningSyncs] = useState<Set<string>>(new Set());
  const [pausingSyncs, setPausingSyncs] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSync, setSelectedSync] = useState<SyncConfiguration | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
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
      case 'paused':
        return 'Pausado';
      case 'error':
        return 'Erro';
      default:
        return 'Desconhecido';
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'realtime':
        return 'Tempo Real';
      case 'hourly':
        return 'A cada hora';
      case 'daily':
        return 'Diariamente';
      case 'weekly':
        return 'Semanalmente';
      case 'monthly':
        return 'Mensalmente';
      default:
        return frequency;
    }
  };

  const handleRunSync = async (sync: SyncConfiguration) => {
    console.log('🔄 [SyncConfigurationSection] Running sync:', sync.name);
    setRunningSyncs(prev => new Set(prev).add(sync.id));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Sincronização Executada",
        description: `${sync.name} foi executado com sucesso`,
      });
    } catch (error) {
      console.error('❌ [SyncConfigurationSection] Sync error:', error);
      toast({
        title: "Erro na Sincronização",
        description: `Falha ao executar ${sync.name}`,
        variant: "destructive",
      });
    } finally {
      setRunningSyncs(prev => {
        const newSet = new Set(prev);
        newSet.delete(sync.id);
        return newSet;
      });
    }
  };

  const handleToggleSync = async (sync: SyncConfiguration) => {
    console.log('⏯️ [SyncConfigurationSection] Toggling sync:', sync.name, 'current status:', sync.status);
    setPausingSyncs(prev => new Set(prev).add(sync.id));
    
    try {
      // Simulate API call to toggle sync status
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newStatus = sync.status === 'active' ? 'paused' : 'active';
      const action = newStatus === 'active' ? 'ativada' : 'pausada';
      
      toast({
        title: "Status Alterado",
        description: `Sincronização ${sync.name} foi ${action}`,
      });
      
      console.log('✅ [SyncConfigurationSection] Sync status changed to:', newStatus);
    } catch (error) {
      console.error('❌ [SyncConfigurationSection] Toggle error:', error);
      toast({
        title: "Erro",
        description: `Falha ao alterar status de ${sync.name}`,
        variant: "destructive",
      });
    } finally {
      setPausingSyncs(prev => {
        const newSet = new Set(prev);
        newSet.delete(sync.id);
        return newSet;
      });
    }
  };

  const handleNewSync = () => {
    console.log('➕ [SyncConfigurationSection] Opening new sync modal');
    setSelectedSync(null);
    setIsModalOpen(true);
  };

  const handleEditSync = (sync: SyncConfiguration) => {
    console.log('✏️ [SyncConfigurationSection] Edit sync:', sync.name);
    setSelectedSync(sync);
    setIsModalOpen(true);
  };

  const handleSaveSync = (sync: SyncConfiguration) => {
    console.log('💾 [SyncConfigurationSection] Save sync:', sync.name);
    // In a real implementation, this would update the sync configurations
    // For now, we'll just show a success message
    toast({
      title: sync.id.startsWith('sync_') ? "Sincronização Criada" : "Sincronização Atualizada",
      description: `${sync.name} foi ${sync.id.startsWith('sync_') ? 'criada' : 'atualizada'} com sucesso`,
    });
  };

  const handleDeleteSync = (sync: SyncConfiguration) => {
    console.log('🗑️ [SyncConfigurationSection] Delete sync:', sync.name);
    toast({
      title: "Sincronização Removida",
      description: `${sync.name} foi removida com sucesso`,
    });
    // In a real implementation, this would call an API to delete the sync
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sincronização de Dados</h2>
          <p className="text-gray-600">
            Configure e monitore a sincronização automática de dados entre sistemas.
          </p>
        </div>
        <Button onClick={handleNewSync}>
          <Plus className="h-4 w-4" />
          Nova Sincronização
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5 text-green-600" />
              Sincronizações Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {syncConfigurations.filter(s => s.status === 'active').length}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              de {syncConfigurations.length} configuradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Próximas Execuções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {syncConfigurations.filter(s => s.status === 'active').length}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              nas próximas 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-600" />
              Registros Processados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatNumber(syncConfigurations.reduce((sum, s) => sum + s.recordsProcessed, 0))}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              hoje
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configurações de Sincronização</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Frequência</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Execução</TableHead>
                <TableHead>Próxima Execução</TableHead>
                <TableHead>Registros</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {syncConfigurations.map((sync) => (
                <TableRow key={sync.id}>
                  <TableCell className="font-medium">{sync.name}</TableCell>
                  <TableCell>{sync.source}</TableCell>
                  <TableCell>{sync.target}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {getFrequencyText(sync.frequency)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getStatusColor(sync.status)}`}>
                      {getStatusText(sync.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(sync.lastRun)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(sync.nextRun)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatNumber(sync.recordsProcessed)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRunSync(sync)}
                        disabled={runningSyncs.has(sync.id)}
                        title="Executar Sincronização"
                      >
                        {runningSyncs.has(sync.id) ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleToggleSync(sync)}
                        disabled={pausingSyncs.has(sync.id)}
                        title={sync.status === 'active' ? 'Pausar Sincronização' : 'Ativar Sincronização'}
                      >
                        {pausingSyncs.has(sync.id) ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600" />
                        ) : sync.status === 'active' ? (
                          <Pause className="h-3 w-3" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditSync(sync)}
                        title="Editar Sincronização"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" title="Excluir Sincronização">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja remover a sincronização "{sync.name}"? 
                              Esta ação não pode ser desfeita e todos os dados de configuração serão perdidos.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteSync(sync)}
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

      <SyncConfigModal
        syncConfig={selectedSync}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSync}
      />
    </div>
  );
};
