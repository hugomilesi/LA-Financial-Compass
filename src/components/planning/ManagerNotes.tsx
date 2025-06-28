
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Save, X, MessageSquare, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useUnit } from '@/contexts/UnitContext';

interface ManagerNotesProps {
  selectedPeriod: { year: number; month: number };
  selectedUnit: string; // Keep for compatibility but use context
}

interface Note {
  id: string;
  title: string;
  content: string;
  category: 'observacao' | 'acao' | 'alerta' | 'sucesso';
  date: Date;
  unit: string;
  author: string;
}

export const ManagerNotes = ({ selectedPeriod }: ManagerNotesProps) => {
  const { selectedUnit, getUnitDisplayName } = useUnit();
  const [notes, setNotes] = useState<Note[]>(generateNotesForUnit());
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<Note['category']>('observacao');

  function generateNotesForUnit(): Note[] {
    const baseNotes: Note[] = [
      {
        id: '1',
        title: 'Performance Junho 2024',
        content: selectedUnit === 'all' 
          ? 'Consolidado apresentou crescimento de 8.5% comparado ao mês anterior. Destaque para Campo Grande com melhor margem.'
          : `Unidade ${getUnitDisplayName(selectedUnit)} teve performance acima da média do grupo.`,
        category: 'sucesso',
        date: new Date('2024-06-30'),
        unit: selectedUnit,
        author: 'Gerente Financeiro'
      },
      {
        id: '2',
        title: 'Ações para Julho',
        content: selectedUnit === 'all'
          ? 'Implementar otimização de custos em todas as unidades. Foco especial na Barra para melhorar ocupação.'
          : `Revisar estratégia de captação e retenção específica para ${getUnitDisplayName(selectedUnit)}.`,
        category: 'acao',
        date: new Date('2024-06-29'),
        unit: selectedUnit,
        author: 'Diretor Operacional'
      }
    ];

    if (selectedUnit !== 'all') {
      baseNotes.push({
        id: '3',
        title: 'Observação Operacional',
        content: `Necessário acompanhar de perto os indicadores de ${getUnitDisplayName(selectedUnit)} no próximo trimestre.`,
        category: 'observacao',
        date: new Date('2024-06-28'),
        unit: selectedUnit,
        author: 'Coordenador'
      });
    }

    return baseNotes;
  }

  // Update notes when unit changes
  React.useEffect(() => {
    setNotes(generateNotesForUnit());
  }, [selectedUnit]);

  const getCategoryIcon = (category: Note['category']) => {
    switch (category) {
      case 'sucesso': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'alerta': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'acao': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: Note['category']) => {
    switch (category) {
      case 'sucesso': return 'border-green-200 bg-green-50';
      case 'alerta': return 'border-red-200 bg-red-50';
      case 'acao': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getCategoryBadgeColor = (category: Note['category']) => {
    switch (category) {
      case 'sucesso': return 'bg-green-100 text-green-800';
      case 'alerta': return 'bg-red-100 text-red-800';
      case 'acao': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddNote = () => {
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: newNoteTitle,
        content: newNoteContent,
        category: newNoteCategory,
        date: new Date(),
        unit: selectedUnit,
        author: 'Usuário Atual'
      };
      
      setNotes(prev => [newNote, ...prev]);
      setNewNoteTitle('');
      setNewNoteContent('');
      setIsAddingNote(false);
    }
  };

  const monthName = new Date(selectedPeriod.year, selectedPeriod.month - 1).toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Observações Gerenciais - {monthName}</h2>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {getUnitDisplayName(selectedUnit)}
          </Badge>
          <Button onClick={() => setIsAddingNote(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Observação
          </Button>
        </div>
      </div>

      {isAddingNote && (
        <Card className="border-primary-200">
          <CardHeader>
            <CardTitle className="text-lg">Nova Observação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Título</label>
              <input
                type="text"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Título da observação..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Categoria</label>
              <select
                value={newNoteCategory}
                onChange={(e) => setNewNoteCategory(e.target.value as Note['category'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="observacao">Observação</option>
                <option value="acao">Ação Necessária</option>
                <option value="alerta">Alerta</option>
                <option value="sucesso">Sucesso</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Conteúdo</label>
              <Textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Descreva sua observação..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddNote} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNoteTitle('');
                  setNewNoteContent('');
                }}
                size="sm"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id} className={getCategoryColor(note.category)}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(note.category)}
                  <CardTitle className="text-lg">{note.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryBadgeColor(note.category)}>
                    {note.category === 'observacao' ? 'Observação' :
                     note.category === 'acao' ? 'Ação' :
                     note.category === 'alerta' ? 'Alerta' : 'Sucesso'}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{note.content}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Por: {note.author}</span>
                <span>{note.date.toLocaleDateString('pt-BR')}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma observação encontrada
            </h3>
            <p className="text-gray-500 mb-4">
              Adicione observações para acompanhar o desempenho de {getUnitDisplayName(selectedUnit)}.
            </p>
            <Button onClick={() => setIsAddingNote(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeira Observação
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
