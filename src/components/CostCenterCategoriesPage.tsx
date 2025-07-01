
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Filter, Download, BarChart3, Bell, Target, Building } from 'lucide-react';
import { useCostCenterCategories } from '@/hooks/useCostCenterCategories';
import { useUnit, UNITS } from '@/contexts/UnitContext';
import { usePeriod } from '@/contexts/PeriodContext';
import { CostCenterCategoryCard } from './costCenter/CostCenterCategoryCard';
import { CostCenterMetrics } from './costCenter/CostCenterMetrics';
import { CostCenterFilters } from './costCenter/CostCenterFilters';
import { CostCenterCategoryModal } from './costCenter/CostCenterCategoryModal';
import { CostCenterDetailsModal } from './costCenter/CostCenterDetailsModal';
import { CostCenterChartModal } from './costCenter/CostCenterChartModal';
import { CostCenterAlerts } from './costCenter/CostCenterAlerts';
import { CostCenterStrategicIndicators } from './costCenter/CostCenterStrategicIndicators';
import { CostCenterCategory } from '@/types/costCenter';

export const CostCenterCategoriesPage = () => {
  const { 
    categories, 
    alerts,
    addCategory, 
    updateCategory, 
    deleteCategory, 
    getCategoryMetrics, 
    getCategoriesByUnit,
    markAlertAsRead,
    dismissAlert,
    refreshAlerts
  } = useCostCenterCategories();
  const { selectedUnit, setSelectedUnit, getUnitDisplayName } = useUnit();
  const { getDisplayPeriod } = usePeriod();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CostCenterCategory | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CostCenterCategory | null>(null);
  const [showChartModal, setShowChartModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'amount' | 'percentage'>('amount');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState('categories');

  const displayCategories = getCategoriesByUnit(selectedUnit);
  const metrics = getCategoryMetrics();

  const filteredCategories = displayCategories
    .filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           category.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesActiveFilter = filterActive === null || category.isActive === filterActive;
      return matchesSearch && matchesActiveFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'amount':
          return b.totalAmount - a.totalAmount;
        case 'percentage':
          return b.percentage - a.percentage;
        default:
          return 0;
      }
    });

  const handleAddCategory = (categoryData: Omit<CostCenterCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    addCategory(categoryData);
    setShowAddForm(false);
  };

  const handleUpdateCategory = (categoryData: Omit<CostCenterCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId);
  };

  const handleExportData = () => {
    const csvContent = [
      ['Categoria', 'Descrição', 'Valor', 'Percentual', 'Status'],
      ...filteredCategories.map(cat => [
        cat.name,
        cat.description,
        cat.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        `${cat.percentage.toFixed(1)}%`,
        cat.isActive ? 'Ativo' : 'Inativo'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `centro-custos-categorias-${selectedUnit}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centro de Custos - Categorias</h1>
          <p className="text-gray-600 mt-1">
            {getUnitDisplayName(selectedUnit)} • {getDisplayPeriod()}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          {/* Unit Selector */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
            <Building className="w-4 h-4 text-gray-500" />
            <Select value={selectedUnit} onValueChange={setSelectedUnit}>
              <SelectTrigger className="w-[180px] border-none shadow-none">
                <SelectValue placeholder="Selecionar unidade" />
              </SelectTrigger>
              <SelectContent>
                {UNITS.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => setShowChartModal(true)}
            variant="outline"
            className="gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Gráficos
          </Button>
          <Button
            onClick={handleExportData}
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button
            onClick={() => setShowAddForm(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Categoria
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <CostCenterMetrics metrics={metrics} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Alertas
            {alerts.filter(a => !a.isRead).length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {alerts.filter(a => !a.isRead).length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="indicators" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Indicadores
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          {/* Filters */}
          <CostCenterFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={setSortBy}
            filterActive={filterActive}
            onFilterActiveChange={setFilterActive}
          />

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <CostCenterCategoryCard
                key={category.id}
                category={category}
                onEdit={(category) => setEditingCategory(category)}
                onDelete={handleDeleteCategory}
                onViewDetails={(category) => setSelectedCategory(category)}
              />
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-500">
                  <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Nenhuma categoria encontrada</p>
                  <p>Tente ajustar os filtros ou criar uma nova categoria.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="alerts">
          <CostCenterAlerts
            alerts={alerts}
            onMarkAsRead={markAlertAsRead}
            onDismiss={dismissAlert}
          />
        </TabsContent>

        <TabsContent value="indicators">
          <CostCenterStrategicIndicators categories={displayCategories} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CostCenterCategoryModal
        isOpen={showAddForm || !!editingCategory}
        onClose={() => {
          setShowAddForm(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSave={editingCategory ? handleUpdateCategory : handleAddCategory}
      />

      <CostCenterDetailsModal
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        category={selectedCategory}
      />

      <CostCenterChartModal
        isOpen={showChartModal}
        onClose={() => setShowChartModal(false)}
        categories={filteredCategories}
      />
    </div>
  );
};
