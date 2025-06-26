
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export const ReportsDREPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');

  // Mock data for demonstrations
  const dreData = [
    { item: 'Receita Bruta', valor: 850000, percentual: 100 },
    { item: 'Deduções', valor: -85000, percentual: -10 },
    { item: 'Receita Líquida', valor: 765000, percentual: 90 },
    { item: 'CMV', valor: -306000, percentual: -36 },
    { item: 'Lucro Bruto', valor: 459000, percentual: 54 },
    { item: 'Despesas Operacionais', valor: -255000, percentual: -30 },
    { item: 'EBITDA', valor: 204000, percentual: 24 },
    { item: 'Depreciação', valor: -25500, percentual: -3 },
    { item: 'EBIT', valor: 178500, percentual: 21 },
    { item: 'Resultado Financeiro', valor: -12750, percentual: -1.5 },
    { item: 'Lucro Antes do IR', valor: 165750, percentual: 19.5 },
    { item: 'IR/CSLL', valor: -41437.5, percentual: -4.9 },
    { item: 'Lucro Líquido', valor: 124312.5, percentual: 14.6 }
  ];

  const monthlyData = [
    { mes: 'Jan', receita: 65000, despesas: 45000, lucro: 20000 },
    { mes: 'Fev', receita: 70000, despesas: 48000, lucro: 22000 },
    { mes: 'Mar', receita: 75000, despesas: 50000, lucro: 25000 },
    { mes: 'Abr', receita: 68000, despesas: 47000, lucro: 21000 },
    { mes: 'Mai', receita: 72000, despesas: 49000, lucro: 23000 },
    { mes: 'Jun', receita: 78000, despesas: 52000, lucro: 26000 }
  ];

  const costCenterData = [
    { centro: 'Vendas', valor: 125000, cor: '#8884d8' },
    { centro: 'Marketing', valor: 85000, cor: '#82ca9d' },
    { centro: 'Administrativo', valor: 95000, cor: '#ffc658' },
    { centro: 'Operacional', valor: 110000, cor: '#ff7300' }
  ];

  const expenseReports = [
    { id: 1, tipo: 'Despesas Administrativas', periodo: 'Jun/2024', valor: 95000, status: 'Finalizado' },
    { id: 2, tipo: 'Custos Operacionais', periodo: 'Jun/2024', valor: 110000, status: 'Finalizado' },
    { id: 3, tipo: 'Despesas de Vendas', periodo: 'Jun/2024', valor: 125000, status: 'Em Análise' },
    { id: 4, tipo: 'Despesas Financeiras', periodo: 'Jun/2024', valor: 12750, status: 'Finalizado' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios & DRE</h1>
          <p className="text-gray-600 mt-2">Demonstrativos financeiros e relatórios de gestão</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {selectedPeriod}
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dre" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dre">DRE Gerencial</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="costs">Centro de Custos</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="dre" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  DRE Detalhada - {selectedPeriod}
                </CardTitle>
                <CardDescription>
                  Demonstrativo do Resultado do Exercício
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dreData.map((item, index) => (
                      <TableRow key={index} className={item.valor < 0 ? 'text-red-600' : item.item.includes('Lucro') ? 'text-green-600 font-semibold' : ''}>
                        <TableCell className="font-medium">{item.item}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.valor)}</TableCell>
                        <TableCell className="text-right">{item.percentual.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evolução Mensal</CardTitle>
                <CardDescription>Receitas vs Despesas vs Lucro</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    receita: { label: "Receita", color: "#8884d8" },
                    despesas: { label: "Despesas", color: "#82ca9d" },
                    lucro: { label: "Lucro", color: "#ffc658" }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="receita" fill="#8884d8" />
                      <Bar dataKey="despesas" fill="#82ca9d" />
                      <Bar dataKey="lucro" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Relatórios</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+2 desde o mês passado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Aguardando revisão</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(342750)}</div>
                <p className="text-xs text-muted-foreground">Período atual</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Despesas</CardTitle>
              <CardDescription>Lista de relatórios por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo de Relatório</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.tipo}</TableCell>
                      <TableCell>{report.periodo}</TableCell>
                      <TableCell className="text-right">{formatCurrency(report.valor)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          report.status === 'Finalizado' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Centro de Custo</CardTitle>
                <CardDescription>Análise de custos por departamento</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    vendas: { label: "Vendas", color: "#8884d8" },
                    marketing: { label: "Marketing", color: "#82ca9d" },
                    administrativo: { label: "Administrativo", color: "#ffc658" },
                    operacional: { label: "Operacional", color: "#ff7300" }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costCenterData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ centro, valor }) => `${centro}: ${formatCurrency(valor)}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="valor"
                      >
                        {costCenterData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cor} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhamento de Custos</CardTitle>
                <CardDescription>Valores por centro de custo</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Centro de Custo</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-right">% Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {costCenterData.map((item, index) => {
                      const total = costCenterData.reduce((sum, item) => sum + item.valor, 0);
                      const percentage = ((item.valor / total) * 100).toFixed(1);
                      
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: item.cor }}
                              />
                              {item.centro}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(item.valor)}</TableCell>
                          <TableCell className="text-right">{percentage}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendência de Lucro</CardTitle>
                <CardDescription>Evolução do lucro líquido mensal</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    lucro: { label: "Lucro", color: "#22c55e" }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="lucro" 
                        stroke="#22c55e" 
                        strokeWidth={3}
                        dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicadores Financeiros</CardTitle>
                <CardDescription>Principais métricas do período</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Margem Bruta</span>
                  <span className="font-semibold text-green-600">54.0%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Margem EBITDA</span>
                  <span className="font-semibold text-blue-600">24.0%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Margem Líquida</span>
                  <span className="font-semibold text-purple-600">14.6%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">ROI</span>
                  <span className="font-semibold text-orange-600">19.5%</span>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-sm font-medium">Crescimento vs Mês Anterior</span>
                  <span className="font-semibold text-green-600">+8.2%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
