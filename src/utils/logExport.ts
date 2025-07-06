
import { IntegrationLog } from '@/types/systemSettings';

// Utility function to trigger file download
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Convert logs to CSV format
const convertLogsToCSV = (logs: IntegrationLog[]): string => {
  const headers = ['Timestamp', 'Nível', 'Serviço', 'Operação', 'Mensagem', 'Duração (ms)'];
  
  const csvRows = [
    headers.join(','),
    ...logs.map(log => {
      const row = [
        `"${new Date(log.timestamp).toLocaleString('pt-BR')}"`,
        `"${getLevelText(log.level)}"`,
        `"${log.service}"`,
        `"${log.operation}"`,
        `"${log.message.replace(/"/g, '""')}"`, // Escape quotes in message
        log.duration || 0
      ];
      return row.join(',');
    })
  ];
  
  return csvRows.join('\n');
};

// Helper function to get level text in Portuguese
const getLevelText = (level: string) => {
  switch (level) {
    case 'success':
      return 'Sucesso';
    case 'info':
      return 'Informação';
    case 'warning':
      return 'Aviso';
    case 'error':
      return 'Erro';
    default:
      return level;
  }
};

// Export logs to CSV file
export const exportLogsToCSV = (logs: IntegrationLog[], filters?: { search?: string; level?: string; service?: string }) => {
  
  
  let filteredLogs = logs;
  
  // Apply filters if provided
  if (filters) {
    filteredLogs = logs.filter(log => {
      const matchesSearch = !filters.search || 
        log.message.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.service.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.operation.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesLevel = !filters.level || filters.level === 'all' || log.level === filters.level;
      const matchesService = !filters.service || filters.service === 'all' || log.service === filters.service;
      
      return matchesSearch && matchesLevel && matchesService;
    });
  }
  
  
  
  const csvContent = convertLogsToCSV(filteredLogs);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `logs_integracao_${timestamp}.csv`;
  
  downloadFile(csvContent, filename, 'text/csv');
  
  
  
  return filename;
};
