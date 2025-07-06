
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Unit {
  id: string;
  name: string;
  displayName: string;
}

interface UnitContextType {
  selectedUnit: string;
  setSelectedUnit: (unitId: string) => void;
  units: Unit[];
  getUnitDisplayName: (unitId: string) => string;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [units, setUnits] = useState<Unit[]>([{ id: 'all', name: 'all', displayName: 'Todas as Unidades' }]);

  useEffect(() => {
    const fetchUnits = async () => {
      const { data, error } = await supabase
        .from('units')
        .select('id, name');

      if (error) {
        
      } else if (data) {
        const fetchedUnits: Unit[] = data.map(unit => ({
          id: unit.id,
          name: unit.name,
          displayName: unit.name,
        }));
        setUnits([{ id: 'all', name: 'all', displayName: 'Todas as Unidades' }, ...fetchedUnits]);
      }
    };

    fetchUnits();
  }, []);

  const getUnitDisplayName = (unitId: string): string => {
    const unit = units.find(u => u.id === unitId);
    return unit?.displayName || 'Unidade Desconhecida';
  };

  return (
    <UnitContext.Provider value={{
      selectedUnit,
      setSelectedUnit,
      units,
      getUnitDisplayName
    }}>
      {children}
    </UnitContext.Provider>
  );
};

export const useUnit = (): UnitContextType => {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error('useUnit must be used within a UnitProvider');
  }
  return context;
};
