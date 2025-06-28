
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonthlyGoals } from './planning/MonthlyGoals';
import { FutureProjections } from './planning/FutureProjections';
import { ManagerNotes } from './planning/ManagerNotes';
import { PlanningDashboard } from './planning/PlanningDashboard';
import { PlanningFilters } from './planning/PlanningFilters';

export const PlanningPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planejamento Financeiro</h1>
          <p className="text-gray-600 mt-1">Gerencie metas, projeções e acompanhe o desempenho</p>
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
            selectedUnit="all"
          />
        </TabsContent>

        <TabsContent value="projections" className="space-y-4">
          <FutureProjections 
            selectedPeriod={selectedPeriod}
            selectedUnit="all"
          />
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <ManagerNotes 
            selectedPeriod={selectedPeriod}
            selectedUnit="all"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
