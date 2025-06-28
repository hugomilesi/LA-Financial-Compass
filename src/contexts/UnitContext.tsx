
import React, { createContext, useContext, useState } from 'react';

export interface Unit {
  id: string;
  name: string;
  displayName: string;
}

export const UNITS: Unit[] = [
  { id: 'all', name: 'all', displayName: 'Todas as Unidades' },
  { id: 'campo-grande', name: 'campo-grande', displayName: 'Campo Grande' },
  { id: 'recreio', name: 'recreio', displayName: 'Recreio' },
  { id: 'barra', name: 'barra', displayName: 'Barra' }
];

interface UnitContextType {
  selectedUnit: string;
  setSelectedUnit: (unitId: string) => void;
  getUnitDisplayName: (unitId: string) => string;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedUnit, setSelectedUnit] = useState<string>('all');

  const getUnitDisplayName = (unitId: string): string => {
    const unit = UNITS.find(u => u.id === unitId);
    return unit?.displayName || 'Unidade Desconhecida';
  };

  return (
    <UnitContext.Provider value={{
      selectedUnit,
      setSelectedUnit,
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
