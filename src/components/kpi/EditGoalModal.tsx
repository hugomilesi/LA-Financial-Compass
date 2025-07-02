import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, RotateCcw } from 'lucide-react';

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpiName: string;
  currentGoal: number;
  unit?: string;
  onSave: (newGoal: number) => Promise<boolean>;
  onReset: () => Promise<boolean>;
  isUpdating: boolean;
}

export const EditGoalModal = ({
  isOpen,
  onClose,
  kpiName,
  currentGoal,
  unit = '',
  onSave,
  onReset,
  isUpdating
}: EditGoalModalProps) => {
  const [goalValue, setGoalValue] = useState(currentGoal.toString());

  const handleSave = async () => {
    const numericValue = parseFloat(goalValue);
    if (isNaN(numericValue) || numericValue <= 0) {
      return;
    }

    const success = await onSave(numericValue);
    if (success) {
      onClose();
    }
  };

  const handleReset = async () => {
    const success = await onReset();
    if (success) {
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isUpdating) {
      setGoalValue(currentGoal.toString());
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Meta - {kpiName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-value">Nova Meta</Label>
            <div className="flex items-center gap-2">
              <Input
                id="goal-value"
                type="number"
                value={goalValue}
                onChange={(e) => setGoalValue(e.target.value)}
                placeholder="Digite a nova meta"
                disabled={isUpdating}
                min="0"
                step="any"
              />
              {unit && (
                <span className="text-sm text-muted-foreground min-w-fit">
                  {unit}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isUpdating}
              className="flex items-center gap-2"
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
              Resetar Padrão
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isUpdating}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isUpdating || !goalValue || parseFloat(goalValue) <= 0}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};