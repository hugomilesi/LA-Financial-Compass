
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Save, Copy, Trash2, AlertTriangle } from 'lucide-react';
import { UNITS, useUnit } from '@/contexts/UnitContext';
import { useToast } from '@/hooks/use-toast';

interface UnitDREConfig {
  unitId: string;
  templateId?: string;
  customSettings: {
    currency: string;
    decimalPlaces: number;
    showPercentages: boolean;
    showVariance: boolean;
    excludeZeroValues: boolean;
    minimumAmount: number;
  };
  costCenterFilters: string[];
  accountFilters: string[];
  isActive: boolean;
}

interface DREUnitConfigurationProps {
  selectedUnits: string[];
  unitConfigs: Record<string, UnitDREConfig>;
  onConfigChange: (unitId: string, config: UnitDREConfig) => void;
  onConfigReset: (unitId: string) => void;
  availableTemplates: Array<{ id: string; name: string }>;
}

export const DREUnitConfiguration = ({
  selectedUnits,
  unitConfigs,
  onConfigChange,
  onConfigReset,
  availableTemplates
}: DREUnitConfigurationProps) => {
  const { getUnitDisplayName } = useUnit();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(selectedUnits[0] || 'all');

  const getUnitConfig = (unitId: string): UnitDREConfig => {
    return unitConfigs[unitId] || {
      unitId,
      customSettings: {
        currency: 'BRL',
        decimalPlaces: 2,
        showPercentages: true,
        showVariance: true,
        excludeZeroValues: true,
        minimumAmount: 0
      },
      costCenterFilters: [],
      accountFilters: [],
      isActive: true
    };
  };

  const updateUnitConfig = (unitId: string, updates: Partial<UnitDREConfig>) => {
    const currentConfig = getUnitConfig(unitId);
    const newConfig = { ...currentConfig, ...updates };
    onConfigChange(unitId, newConfig);
  };

  const copyConfigToOtherUnits = (sourceUnitId: string) => {
    const sourceConfig = getUnitConfig(sourceUnitId);
    const otherUnits = selectedUnits.filter(id => id !== sourceUnitId && id !== 'all');
    
    otherUnits.forEach(unitId => {
      onConfigChange(unitId, {
        ...sourceConfig,
        unitId
      });
    });

    toast({
      title: "Configurações copiadas",
      description: `Configurações aplicadas a ${otherUnits.length} unidades`
    });
  };

  const resetUnitConfig = (unitId: string) => {
    onConfigReset(unitId);
    toast({
      title: "Configurações resetadas",
      description: `Configurações da unidade ${getUnitDisplayName(unitId)} foram resetadas`
    });
  };

  const unitsToShow = selectedUnits.filter(id => id !== 'all');

  if (unitsToShow.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-gray-500">
            Selecione unidades específicas para configurar parâmetros individuais
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Configurações por Unidade
        </CardTitle>
        <CardDescription>
          Configure parâmetros específicos para cada unidade selecionada
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${unitsToShow.length}, 1fr)` }}>
            {unitsToShow.map(unitId => (
              <TabsTrigger key={unitId} value={unitId} className="text-xs">
                {getUnitDisplayName(unitId)}
                {!getUnitConfig(unitId).isActive && (
                  <AlertTriangle className="w-3 h-3 ml-1 text-orange-500" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {unitsToShow.map(unitId => {
            const config = getUnitConfig(unitId);
            
            return (
              <TabsContent key={unitId} value={unitId} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {getUnitDisplayName(unitId)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Configurações específicas para esta unidade
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyConfigToOtherUnits(unitId)}
                      disabled={unitsToShow.length === 1}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copiar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resetUnitConfig(unitId)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Resetar
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Active Status */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`active-${unitId}`}
                    checked={config.isActive}
                    onCheckedChange={(checked) => 
                      updateUnitConfig(unitId, { isActive: !!checked })
                    }
                  />
                  <Label htmlFor={`active-${unitId}`}>
                    Incluir esta unidade no DRE
                  </Label>
                </div>

                {config.isActive && (
                  <>
                    {/* Template Selection */}
                    <div>
                      <Label>Template Específico (Opcional)</Label>
                      <Select
                        value={config.templateId || ''}
                        onValueChange={(value) => 
                          updateUnitConfig(unitId, { 
                            templateId: value || undefined 
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Usar template padrão" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Usar template padrão</SelectItem>
                          {availableTemplates.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Display Settings */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium">Configurações de Exibição</Label>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`currency-${unitId}`}>Moeda</Label>
                          <Select
                            value={config.customSettings.currency}
                            onValueChange={(value) => 
                              updateUnitConfig(unitId, {
                                customSettings: {
                                  ...config.customSettings,
                                  currency: value
                                }
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BRL">Real (BRL)</SelectItem>
                              <SelectItem value="USD">Dólar (USD)</SelectItem>
                              <SelectItem value="EUR">Euro (EUR)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor={`decimal-${unitId}`}>Casas Decimais</Label>
                          <Select
                            value={config.customSettings.decimalPlaces.toString()}
                            onValueChange={(value) => 
                              updateUnitConfig(unitId, {
                                customSettings: {
                                  ...config.customSettings,
                                  decimalPlaces: parseInt(value)
                                }
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`percentages-${unitId}`}
                            checked={config.customSettings.showPercentages}
                            onCheckedChange={(checked) => 
                              updateUnitConfig(unitId, {
                                customSettings: {
                                  ...config.customSettings,
                                  showPercentages: !!checked
                                }
                              })
                            }
                          />
                          <Label htmlFor={`percentages-${unitId}`}>
                            Mostrar percentuais
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`variance-${unitId}`}
                            checked={config.customSettings.showVariance}
                            onCheckedChange={(checked) => 
                              updateUnitConfig(unitId, {
                                customSettings: {
                                  ...config.customSettings,
                                  showVariance: !!checked
                                }
                              })
                            }
                          />
                          <Label htmlFor={`variance-${unitId}`}>
                            Mostrar variações
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`exclude-zero-${unitId}`}
                            checked={config.customSettings.excludeZeroValues}
                            onCheckedChange={(checked) => 
                              updateUnitConfig(unitId, {
                                customSettings: {
                                  ...config.customSettings,
                                  excludeZeroValues: !!checked
                                }
                              })
                            }
                          />
                          <Label htmlFor={`exclude-zero-${unitId}`}>
                            Excluir valores zero
                          </Label>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`minimum-${unitId}`}>
                          Valor Mínimo (para exclusão)
                        </Label>
                        <Input
                          id={`minimum-${unitId}`}
                          type="number"
                          value={config.customSettings.minimumAmount}
                          onChange={(e) => 
                            updateUnitConfig(unitId, {
                              customSettings: {
                                ...config.customSettings,
                                minimumAmount: parseFloat(e.target.value) || 0
                              }
                            })
                          }
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};
