
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { IntegrationLog } from '@/types/systemSettings';
import { exportLogsToCSV } from '@/utils/logExport';
import { Download, FileText, Calendar, Filter, Settings } from 'lucide-react';

interface LogExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: IntegrationLog[];
  currentFilters: {
    search: string;
    level: string;
    service: string;
  };
}

export const LogExportModal = ({ isOpen, onClose, logs, currentFilters }: LogExportModalProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  
  // Export configuration state
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [includeCurrentFilters, setIncludeCurrentFilters] = useState(true);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['success', 'info', 'warning', 'error']);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [maxRecords, setMaxRecords] = useState('');
  const [includeDetails, setIncludeDetails] = useState(true);

  // Get unique services from logs
  const uniqueServices = Array.from(new Set(logs.map(log => log.service)));

  // Initialize selected services if empty
  useState(() => {
    if (selectedServices.length === 0) {
      setSelectedServices(uniqueServices);
    }
  });

  const handleLevelToggle = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const applyFilters = (logsToFilter: IntegrationLog[]) => {
    let filtered = logsToFilter;

    // Apply current UI filters if enabled
    if (includeCurrentFilters) {
      filtered = filtered.filter(log => {
        const matchesSearch = !currentFilters.search || 
          log.message.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
          log.service.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
          log.operation.toLowerCase().includes(currentFilters.search.toLowerCase());
        
        const matchesLevel = currentFilters.level === 'all' || log.level === currentFilters.level;
        const matchesService = currentFilters.service === 'all' || log.service === currentFilters.service;
        
        return matchesSearch && matchesLevel && matchesService;
      });
    }

    // Apply level filters
    filtered = filtered.filter(log => selectedLevels.includes(log.level));

    // Apply service filters
    filtered = filtered.filter(log => selectedServices.includes(log.service));

    // Apply date range filters
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();

      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'custom':
          if (customStartDate) startDate = new Date(customStartDate);
          const endDate = customEndDate ? new Date(customEndDate) : now;
          filtered = filtered.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= startDate && logDate <= endDate;
          });
          return filtered;
      }

      filtered = filtered.filter(log => new Date(log.timestamp) >= startDate);
    }

    // Apply max records limit
    if (maxRecords && parseInt(maxRecords) > 0) {
      filtered = filtered.slice(0, parseInt(maxRecords));
    }

    return filtered;
  };

  const getFilteredLogsCount = () => {
    return applyFilters(logs).length;
  };

  const handleExport = async () => {
    console.log('📊 [LogExportModal] Starting export with configuration:', {
      format: exportFormat,
      dateRange,
      includeCurrentFilters,
      selectedLevels,
      selectedServices,
      maxRecords
    });

    setIsExporting(true);
    
    try {
      const filteredLogs = applyFilters(logs);
      
      if (filteredLogs.length === 0) {
        toast({
          title: "Nenhum Log Encontrado",
          description: "Nenhum log corresponde aos filtros selecionados.",
          variant: "destructive",
        });
        return;
      }

      // For now, we only support CSV export, but the structure is ready for other formats
      const filename = exportLogsToCSV(filteredLogs);
      
      toast({
        title: "Logs Exportados",
        description: `${filteredLogs.length} logs foram exportados para ${filename}`,
      });
      
      console.log('✅ [LogExportModal] Export completed successfully');
      onClose();
    } catch (error) {
      console.error('❌ [LogExportModal] Export failed:', error);
      toast({
        title: "Erro na Exportação",
        description: "Falha ao exportar os logs. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'success': return 'Sucesso';
      case 'info': return 'Informação';
      case 'warning': return 'Aviso';
      case 'error': return 'Erro';
      default: return level;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar Logs de Integração
          </DialogTitle>
          <DialogDescription>
            Configure as opções de exportação para personalizar o arquivo de logs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Formato de Exportação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Comma-separated values)</SelectItem>
                  <SelectItem value="json" disabled>JSON (Em breve)</SelectItem>
                  <SelectItem value="xlsx" disabled>Excel (Em breve)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Date Range */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Período
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os logs</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mês</SelectItem>
                  <SelectItem value="custom">Período personalizado</SelectItem>
                </SelectContent>
              </Select>

              {dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-date">Data inicial</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">Data final</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current filters option */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="current-filters"
                  checked={includeCurrentFilters}
                  onCheckedChange={setIncludeCurrentFilters}
                />
                <Label htmlFor="current-filters">
                  Aplicar filtros atuais da interface
                </Label>
              </div>

              <Separator />

              {/* Level selection */}
              <div>
                <Label className="text-sm font-medium">Níveis de Log</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['success', 'info', 'warning', 'error'].map(level => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`level-${level}`}
                        checked={selectedLevels.includes(level)}
                        onCheckedChange={() => handleLevelToggle(level)}
                      />
                      <Badge className={`text-xs ${getLevelColor(level)}`}>
                        {getLevelText(level)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service selection */}
              <div>
                <Label className="text-sm font-medium">Serviços</Label>
                <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
                  {uniqueServices.map(service => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={`service-${service}`}
                        checked={selectedServices.includes(service)}
                        onCheckedChange={() => handleServiceToggle(service)}
                      />
                      <Label htmlFor={`service-${service}`} className="text-sm">
                        {service}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Opções Avançadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="max-records">Limite máximo de registros</Label>
                <Input
                  id="max-records"
                  type="number"
                  placeholder="Deixe vazio para sem limite"
                  value={maxRecords}
                  onChange={(e) => setMaxRecords(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-details"
                  checked={includeDetails}
                  onCheckedChange={setIncludeDetails}
                />
                <Label htmlFor="include-details">
                  Incluir detalhes técnicos (quando disponível)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Preview Summary */}
          <Card className="bg-gray-50">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600">
                <strong>Resumo da Exportação:</strong>
                <br />
                • {getFilteredLogsCount()} logs serão exportados
                <br />
                • Formato: {exportFormat.toUpperCase()}
                <br />
                • Período: {dateRange === 'all' ? 'Todos os logs' : 
                           dateRange === 'custom' ? 'Período personalizado' :
                           dateRange === 'today' ? 'Hoje' :
                           dateRange === 'week' ? 'Última semana' :
                           'Último mês'}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isExporting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleExport}
            disabled={isExporting || getFilteredLogsCount() === 0}
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Exportar {getFilteredLogsCount()} Logs
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
