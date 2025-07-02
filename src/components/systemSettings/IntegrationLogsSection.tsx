import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { IntegrationLog } from '@/types/systemSettings';
import { exportLogsToCSV } from '@/utils/logExport';
import { Search, Filter, Download, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface IntegrationLogsSectionProps {
  logs: IntegrationLog[];
}

export const IntegrationLogsSection = ({ logs }: IntegrationLogsSectionProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'success':
        return 'Sucesso';
      case 'info':
        return 'Info';
      case 'warning':
        return 'Aviso';
      case 'error':
        return 'Erro';
      default:
        return level;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.operation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesService = serviceFilter === 'all' || log.service === serviceFilter;
    
    return matchesSearch && matchesLevel && matchesService;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '-';
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(1)}s`;
  };

  const uniqueServices = Array.from(new Set(logs.map(log => log.service)));

  const handleExportLogs = async () => {
    console.log('📊 [IntegrationLogsSection] Starting logs export...');
    setIsExporting(true);
    
    try {
      const filename = exportLogsToCSV(logs, {
        search: searchTerm,
        level: levelFilter,
        service: serviceFilter
      });
      
      toast({
        title: "Logs Exportados",
        description: `${filteredLogs.length} logs foram exportados para ${filename}`,
      });
      
      console.log('✅ [IntegrationLogsSection] Export completed successfully');
    } catch (error) {
      console.error('❌ [IntegrationLogsSection] Export failed:', error);
      toast({
        title: "Erro na Exportação",
        description: "Falha ao exportar os logs. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Logs de Integração</h2>
          <p className="text-gray-600">
            Monitore e analise logs de todas as integrações e operações do sistema.
          </p>
        </div>
        <Button onClick={handleExportLogs} disabled={isExporting}>
          {isExporting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isExporting ? 'Exportando...' : 'Exportar Logs'}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="level-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Nível
              </label>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os níveis</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="info">Informação</SelectItem>
                  <SelectItem value="warning">Aviso</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="service-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Serviço
              </label>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os serviços</SelectItem>
                  {uniqueServices.map(service => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['success', 'info', 'warning', 'error'].map(level => {
          const count = logs.filter(log => log.level === level).length;
          return (
            <Card key={level}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {getLevelText(level)}
                    </p>
                    <p className="text-2xl font-bold">
                      {count}
                    </p>
                  </div>
                  {getLevelIcon(level)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Logs Recentes</CardTitle>
          <CardDescription>
            Mostrando {filteredLogs.length} de {logs.length} logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Operação</TableHead>
                <TableHead>Mensagem</TableHead>
                <TableHead>Duração</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm font-mono">
                    {formatDate(log.timestamp)}
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getLevelColor(log.level)}`}>
                      {getLevelText(log.level)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{log.service}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {log.operation}
                    </code>
                  </TableCell>
                  <TableCell className="max-w-md truncate">{log.message}</TableCell>
                  <TableCell className="text-sm">
                    {formatDuration(log.duration)}
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
