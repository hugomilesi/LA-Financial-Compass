
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Calendar, User, Plus, Edit, Trash2 } from 'lucide-react';

interface ManagerNotesProps {
  selectedPeriod: { year: number; month: number };
  selectedUnit: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  category: 'strategic' | 'operational' | 'financial' | 'alert';
  priority: 'low' | 'medium' | 'high';
}

export const ManagerNotes = ({ selectedPeriod, selectedUnit }: ManagerNotesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Dados mockados para demonstração
  const [notes] = useState<Note[]>([
    {
      id: '1',
      title: 'Análise de Performance Q1',
      content: 'Os resultados do primeiro trimestre superaram as expectativas em 15%. Principais fatores: aumento das vendas online e otimização de custos operacionais.',
      author: 'João Silva',
      date: '2024-06-20',
      category: 'strategic',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Ajuste de Metas - Unidade Norte',
      content: 'Necessário revisar as metas da Unidade Norte devido à sazonalidade do mercado local. Proposta de redução de 8% na meta mensal.',
      author: 'Maria Santos',
      date: '2024-06-18',
      category: 'operational',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Alerta: Aumento de Custos',
      content: 'Identificado aumento significativo nos custos de matéria-prima. Impacto estimado de R$ 50.000 no orçamento mensal.',
      author: 'Carlos Oliveira',
      date: '2024-06-15',
      category: 'alert',
      priority: 'high'
    },
    {
      id: '4',
      title: 'Oportunidade de Expansão',
      content: 'Análise de mercado indica oportunidade de expansão para região Sul. ROI estimado em 18 meses.',
      author: 'Ana Costa',
      date: '2024-06-12',
      category: 'strategic',
      priority: 'medium'
    }
  ]);

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'strategic', label: 'Estratégico' },
    { value: 'operational', label: 'Operacional' },
    { value: 'financial', label: 'Financeiro' },
    { value: 'alert', label: 'Alerta' }
  ];

  const priorities = [
    { value: 'all', label: 'Todas as Prioridades' },
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Média' },
    { value: 'low', label: 'Baixa' }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strategic': return 'bg-blue-100 text-blue-800';
      case 'operational': return 'bg-green-100 text-green-800';
      case 'financial': return 'bg-purple-100 text-purple-800';
      case 'alert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const filteredNotes = notes.filter(note => {
    const categoryMatch = selectedCategory === 'all' || note.category === selectedCategory;
    const priorityMatch = selectedPriority === 'all' || note.priority === selectedPriority;
    return categoryMatch && priorityMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Observações Gerenciais</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Observação
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Categoria:</span>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Prioridade:</span>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredNotes.map((note) => (
          <Card key={note.id} className={`border-l-4 ${getPriorityColor(note.priority)}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{note.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {note.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(note.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(note.category)}`}>
                    {categories.find(c => c.value === note.category)?.label}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{note.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma observação encontrada
            </h3>
            <p className="text-gray-600">
              Não há observações que correspondam aos filtros selecionados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
