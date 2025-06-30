
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, X, StickyNote } from 'lucide-react';
import { useState } from 'react';

interface AccountNotesProps {
  notes?: string;
  onSave: (notes: string) => void;
  readonly?: boolean;
}

export const AccountNotes = ({ notes, onSave, readonly = false }: AccountNotesProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingNotes, setEditingNotes] = useState(notes || '');

  const handleSave = () => {
    onSave(editingNotes);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingNotes(notes || '');
    setIsEditing(false);
  };

  if (!notes && !isEditing && readonly) return null;

  return (
    <Card className="mt-3">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <StickyNote className="h-4 w-4" />
            Notas Internas
          </CardTitle>
          {!readonly && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-6 w-6 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editingNotes}
              onChange={(e) => setEditingNotes(e.target.value)}
              placeholder="Adicione notas internas sobre esta conta..."
              className="min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                <Save className="h-3 w-3 mr-1" />
                Salvar
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-3 w-3 mr-1" />
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {notes || 'Nenhuma nota adicionada'}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
