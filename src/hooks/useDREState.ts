
import { useState, useCallback } from 'react';
import { DRETemplate, DREConfiguration, DREData } from '@/types/dre';
import { useUnit } from '@/contexts/UnitContext';

export interface DREState {
  templates: DRETemplate[];
  selectedTemplate: string;
  configuration: Partial<DREConfiguration>;
  generatedData: DREData | null;
  isGenerating: boolean;
  filters: {
    units: string[];
    dateRange?: { from: Date; to: Date };
    comparisonRange?: { from: Date; to: Date };
    includeInactive: boolean;
    excludeZeroValues: boolean;
    minimumAmount: number;
  };
  displayOptions: {
    showPercentages: boolean;
    showVariance: boolean;
    showComparison: boolean;
    currency: string;
    decimalPlaces: number;
  };
}

interface UseDREStateReturn {
  state: DREState;
  actions: {
    setSelectedTemplate: (templateId: string) => void;
    updateFilters: (filters: Partial<DREState['filters']>) => void;
    updateDisplayOptions: (options: Partial<DREState['displayOptions']>) => void;
    setGeneratedData: (data: DREData | null) => void;
    setIsGenerating: (isGenerating: boolean) => void;
    updateTemplates: (templates: DRETemplate[]) => void;
    resetState: () => void;
  };
  getTemplateById: (id: string) => DRETemplate | undefined;
  getFilteredTemplates: () => DRETemplate[];
  validateConfiguration: () => { isValid: boolean; errors: string[] };
}

const initialState: DREState = {
  templates: [],
  selectedTemplate: '',
  configuration: {},
  generatedData: null,
  isGenerating: false,
  filters: {
    units: ['all'],
    includeInactive: false,
    excludeZeroValues: true,
    minimumAmount: 0
  },
  displayOptions: {
    showPercentages: true,
    showVariance: true,
    showComparison: false,
    currency: 'BRL',
    decimalPlaces: 2
  }
};

export const useDREState = (): UseDREStateReturn => {
  const [state, setState] = useState<DREState>(initialState);
  const { selectedUnit } = useUnit();

  const setSelectedTemplate = useCallback((templateId: string) => {
    setState(prev => ({ ...prev, selectedTemplate: templateId }));
  }, []);

  const updateFilters = useCallback((filters: Partial<DREState['filters']>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filters }
    }));
  }, []);

  const updateDisplayOptions = useCallback((options: Partial<DREState['displayOptions']>) => {
    setState(prev => ({
      ...prev,
      displayOptions: { ...prev.displayOptions, ...options }
    }));
  }, []);

  const setGeneratedData = useCallback((data: DREData | null) => {
    setState(prev => ({ ...prev, generatedData: data }));
  }, []);

  const setIsGenerating = useCallback((isGenerating: boolean) => {
    setState(prev => ({ ...prev, isGenerating }));
  }, []);

  const updateTemplates = useCallback((templates: DRETemplate[]) => {
    setState(prev => ({ ...prev, templates }));
  }, []);

  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  const getTemplateById = useCallback((id: string) => {
    return state.templates.find(template => template.id === id);
  }, [state.templates]);

  const getFilteredTemplates = useCallback(() => {
    return state.templates.filter(template => {
      // Filter templates based on current unit context if needed
      if (selectedUnit === 'all') return true;
      return template.isPublic || template.tags.includes(selectedUnit);
    });
  }, [state.templates, selectedUnit]);

  const validateConfiguration = useCallback(() => {
    const errors: string[] = [];
    
    if (!state.selectedTemplate) {
      errors.push('Selecione um template DRE');
    }
    
    if (!state.filters.dateRange?.from || !state.filters.dateRange?.to) {
      errors.push('Defina um período válido');
    }
    
    if (state.filters.units.length === 0) {
      errors.push('Selecione pelo menos uma unidade');
    }

    if (state.filters.dateRange && state.filters.comparisonRange) {
      if (state.filters.comparisonRange.from >= state.filters.dateRange.from) {
        errors.push('O período de comparação deve ser anterior ao período principal');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [state]);

  return {
    state,
    actions: {
      setSelectedTemplate,
      updateFilters,
      updateDisplayOptions,
      setGeneratedData,
      setIsGenerating,
      updateTemplates,
      resetState
    },
    getTemplateById,
    getFilteredTemplates,
    validateConfiguration
  };
};
