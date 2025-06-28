
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonthlyGoals } from './planning/MonthlyGoals';
import { FutureProjections } from './planning/FutureProjections';
import { ManagerNotes } from './planning/ManagerNotes';
import { PlanningDashboard } from './planning/PlanningDashboard';
import { PlanningFilters } from './planning/PlanningFilters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUnit, UNITS } from '@/contexts/UnitContext';
import { Calendar } from 'lucide-react';

export const PlanningPage = () => {
  const { selectedUnit, setSelectedUnit, getUnitDisplayName } = useUnit();
  const [selectedPeriod, setSelectedPeriod] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planejamento Financeiro</h1>
          <p className="text-gray-600 mt-1">
            Gerencie metas, projeções e acompanhe o desempenho - {getUnitDisplayName(selectedUnit)}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
          <Calendar className="w-4 h-4 text-gray-500" />
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
      </div>

      <PlanningFilters 
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="goals">Metas Mensais</TabsTrigger>
          <TabsTrigger value="projections">Projeções</TabsTrigger>
          <TabsTrigger value="notes">Observações</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <PlanningDashboard 
            selectedPeriod={selectedPeriod}
          />
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <MonthlyGoals 
            selectedPeriod={selectedPeriod}
            selectedUnit={selectedUnit}
          />
        </TabsContent>

        <TabsContent value="projections" className="space-y-4">
          <FutureProjections 
            selectedPeriod={selectedPeriod}
            selectedUnit={selectedUnit}
          />
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <ManagerNotes 
            selectedPeriod={selectedPeriod}
            selectedUnit={selectedUnit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
