
import { Report } from '@/hooks/useReports';

// Utility function to trigger file download
const downloadFile = (content: string | Blob, filename: string, mimeType: string) => {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generate CSV content
const generateCSV = (data: any[], headers: string[]): string => {
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header.toLowerCase().replace(' ', '_')] || '';
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    }).join(','))
  ].join('\n');
  
  return csvContent;
};

// Generate PDF content (simplified HTML to PDF approach)
const generatePDF = async (title: string, data: any): Promise<Blob> => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; border-bottom: 2px solid #3B82F6; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .summary { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .total { font-weight: bold; color: #059669; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="summary">
        <h3>Resumo Executivo</h3>
        ${JSON.stringify(data, null, 2).replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')}
      </div>
    </body>
    </html>
  `;
  
  return new Blob([htmlContent], { type: 'text/html' });
};

// DRE specific export functions
export const exportDREtoCSV = (period: string, data: any) => {
  const headers = ['Conta', 'Valor', 'Percentual'];
  const dreData = [
    { conta: 'Receita Total', valor: `R$ ${data.totalReceita?.toLocaleString() || '245.780'}`, percentual: '100%' },
    { conta: 'Mensalidades', valor: `R$ ${(data.totalReceita * 0.796)?.toLocaleString() || '195.624'}`, percentual: '79.6%' },
    { conta: 'Matrículas', valor: `R$ ${(data.totalReceita * 0.132)?.toLocaleString() || '32.456'}`, percentual: '13.2%' },
    { conta: 'Outras Receitas', valor: `R$ ${(data.totalReceita * 0.072)?.toLocaleString() || '17.700'}`, percentual: '7.2%' },
    { conta: 'Despesa Total', valor: `R$ ${data.totalDespesa?.toLocaleString() || '192.000'}`, percentual: '78.1%' },
    { conta: 'Pessoal', valor: `R$ ${(data.totalDespesa * 0.583)?.toLocaleString() || '112.000'}`, percentual: '45.6%' },
    { conta: 'Aluguel', valor: `R$ ${(data.totalDespesa * 0.182)?.toLocaleString() || '35.000'}`, percentual: '14.2%' },
    { conta: 'Marketing', valor: `R$ ${(data.totalDespesa * 0.125)?.toLocaleString() || '24.000'}`, percentual: '9.8%' },
    { conta: 'Outras Despesas', valor: `R$ ${(data.totalDespesa * 0.109)?.toLocaleString() || '21.000'}`, percentual: '8.5%' },
    { conta: 'Lucro Líquido', valor: `R$ ${data.lucroLiquido?.toLocaleString() || '53.780'}`, percentual: '21.9%' }
  ];
  
  const csvContent = generateCSV(dreData, headers);
  downloadFile(csvContent, `DRE_${period.replace(/\s+/g, '_')}.csv`, 'text/csv');
};

export const exportDREtoPDF = async (period: string, data: any) => {
  const pdfBlob = await generatePDF(`Demonstrativo de Resultado - ${period}`, {
    periodo: period,
    receita_total: data.totalReceita || 245780,
    despesa_total: data.totalDespesa || 192000,
    lucro_liquido: data.lucroLiquido || 53780,
    margem_liquida: '21.9%'
  });
  
  downloadFile(pdfBlob, `DRE_${period.replace(/\s+/g, '_')}.pdf`, 'application/pdf');
};

export const exportDREtoExcel = async (period: string, data: any) => {
  // For now, we'll use CSV format with .xlsx extension
  // In a real implementation, you'd use a library like xlsx or exceljs
  const headers = ['Conta', 'Valor', 'Percentual'];
  const dreData = [
    { conta: 'Receita Total', valor: data.totalReceita || 245780, percentual: '100%' },
    { conta: 'Mensalidades', valor: (data.totalReceita || 245780) * 0.796, percentual: '79.6%' },
    { conta: 'Matrículas', valor: (data.totalReceita || 245780) * 0.132, percentual: '13.2%' },
    { conta: 'Outras Receitas', valor: (data.totalReceita || 245780) * 0.072, percentual: '7.2%' },
    { conta: 'Despesa Total', valor: data.totalDespesa || 192000, percentual: '78.1%' },
    { conta: 'Pessoal', valor: (data.totalDespesa || 192000) * 0.583, percentual: '45.6%' },
    { conta: 'Aluguel', valor: (data.totalDespesa || 192000) * 0.182, percentual: '14.2%' },
    { conta: 'Marketing', valor: (data.totalDespesa || 192000) * 0.125, percentual: '9.8%' },
    { conta: 'Outras Despesas', valor: (data.totalDespesa || 192000) * 0.109, percentual: '8.5%' },
    { conta: 'Lucro Líquido', valor: data.lucroLiquido || 53780, percentual: '21.9%' }
  ];
  
  const csvContent = generateCSV(dreData, headers);
  downloadFile(csvContent, `DRE_${period.replace(/\s+/g, '_')}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
};

// Report download functions
export const downloadReportFile = async (report: Report) => {
  const filename = `${report.title.replace(/\s+/g, '_')}_${report.period.replace(/\s+/g, '_')}`;
  
  if (report.data) {
    switch (report.type) {
      case 'dre':
        await exportDREtoPDF(report.period, report.data);
        break;
      case 'custos':
        const costHeaders = ['Categoria', 'Valor', 'Percentual'];
        const costData = report.data.principais.map((item: any) => ({
          categoria: item.categoria,
          valor: `R$ ${item.valor.toLocaleString()}`,
          percentual: `${item.percentual}%`
        }));
        const costCsv = generateCSV(costData, costHeaders);
        downloadFile(costCsv, `${filename}.csv`, 'text/csv');
        break;
      case 'kpi':
        const kpiData = {
          total_colaboradores: report.data.totalColaboradores,
          performance_media: `${report.data.performanceMedia}%`,
          top_performers: report.data.topPerformers
        };
        const kpiBlob = await generatePDF(report.title, kpiData);
        downloadFile(kpiBlob, `${filename}.pdf`, 'application/pdf');
        break;
      default:
        // Generic JSON download for other report types
        const jsonContent = JSON.stringify(report.data, null, 2);
        downloadFile(jsonContent, `${filename}.json`, 'application/json');
    }
  } else {
    // Fallback for reports without data
    const reportInfo = {
      titulo: report.title,
      descricao: report.description,
      periodo: report.period,
      status: report.status,
      ultima_atualizacao: report.lastUpdated.toLocaleDateString('pt-BR')
    };
    const infoBlob = await generatePDF(report.title, reportInfo);
    downloadFile(infoBlob, `${filename}.pdf`, 'application/pdf');
  }
};

// Generate other reports
export const generateReportFile = async (reportType: string) => {
  const mockData = {
    'DRE Mensal': { receita: 245780, despesa: 192000, lucro: 53780 },
    'Fluxo de Caixa': { entrada: 280000, saida: 225000, saldo: 55000 },
    'Inadimplência': { total: 3.4, unidades: [{ nome: 'Campo Grande', taxa: 3.2 }] },
    'Análise de Alunos': { total: 1247, novos: 89, cancelamentos: 23 },
    'Rentabilidade por Unidade': { 
      unidades: [
        { nome: 'Campo Grande', margem: 22.0 },
        { nome: 'Recreio', margem: 21.4 },
        { nome: 'Barra', margem: 22.3 }
      ]
    },
    'Comparativo Anual': { crescimento: 15.2, meta: 12.0, performance: 'Acima da meta' }
  };
  
  const data = mockData[reportType as keyof typeof mockData] || {};
  const filename = `${reportType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
  
  if (reportType.includes('CSV') || reportType.includes('Excel')) {
    const headers = Object.keys(data);
    const csvContent = generateCSV([data], headers);
    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  } else {
    const pdfBlob = await generatePDF(reportType, data);
    downloadFile(pdfBlob, `${filename}.pdf`, 'application/pdf');
  }
};
