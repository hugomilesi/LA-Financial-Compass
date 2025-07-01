
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, Mail, Plus, Trash2, Edit, Pause, Play } from 'lucide-react';

interface ScheduledReport {
  id: string;
  name: string;
  reportId: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  isActive: boolean;
  nextRun: Date;
  lastRun?: Date;
}

interface ReportSchedulerProps {
  scheduledReports: ScheduledReport[];
  availableReports: Array<{ id: string; name: string }>;
  onSchedule: (schedule: Omit<ScheduledReport, 'id' | 'nextRun' | 'lastRun'>) => void;
  onUpdate: (schedule: ScheduledReport) => void;
  onDelete: (scheduleId: string) => void;
  onToggleActive: (scheduleId: string) => void;
}

export const ReportScheduler = ({
  scheduledReports,
  availableReports,
  onSchedule,
  onUpdate,
  onDelete,
  onToggleActive
}: ReportSchedulerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduledReport | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    reportId: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    dayOfWeek: number;
    dayOfMonth: number;
    time: string;
    recipients: string[];
    format: 'pdf' | 'excel' | 'csv';
    isActive: boolean;
  }>({
    name: '',
    reportId: '',
    frequency: 'monthly',
    dayOfWeek: 1,
    dayOfMonth: 1,
    time: '09:00',
    recipients: [''],
    format: 'pdf',
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      reportId: '',
      frequency: 'monthly',
      dayOfWeek: 1,
      dayOfMonth: 1,
      time: '09:00',
      recipients: [''],
      format: 'pdf',
      isActive: true
    });
    setEditingSchedule(null);
  };

  const handleSave = () => {
    const recipients = formData.recipients.filter(email => email.trim() !== '');
    
    if (editingSchedule) {
      onUpdate({
        ...editingSchedule,
        ...formData,
        recipients
      });
    } else {
      onSchedule({
        ...formData,
        recipients
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (schedule: ScheduledReport) => {
    setFormData({
      name: schedule.name,
      reportId: schedule.reportId,
      frequency: schedule.frequency,
      dayOfWeek: schedule.dayOfWeek || 1,
      dayOfMonth: schedule.dayOfMonth || 1,
      time: schedule.time,
      recipients: schedule.recipients.length > 0 ? schedule.recipients : [''],
      format: schedule.format,
      isActive: schedule.isActive
    });
    setEditingSchedule(schedule);
    setIsDialogOpen(true);
  };

  const addRecipient = () => {
    setFormData(prev => ({
      ...prev,
      recipients: [...prev.recipients, '']
    }));
  };

  const updateRecipient = (index: number, email: string) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.map((recipient, i) => 
        i === index ? email : recipient
      )
    }));
  };

  const removeRecipient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index)
    }));
  };

  const getFrequencyText = (frequency: string) => {
    const texts = {
      daily: 'Diário',
      weekly: 'Semanal',
      monthly: 'Mensal',
      quarterly: 'Trimestral'
    };
    return texts[frequency as keyof typeof texts] || frequency;
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Agendamento de Relatórios
            </CardTitle>
            <CardDescription>
              Configure o envio automático de relatórios por email
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingSchedule ? 'Editar Agendamento' : 'Novo Agendamento'}
                </DialogTitle>
                <DialogDescription>
                  Configure quando e como os relatórios serão enviados automaticamente
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="schedule-name">Nome do Agendamento</Label>
                    <Input
                      id="schedule-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: DRE Mensal - Gerência"
                    />
                  </div>
                  <div>
                    <Label htmlFor="report-select">Relatório</Label>
                    <Select
                      value={formData.reportId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, reportId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um relatório" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableReports.map(report => (
                          <SelectItem key={report.id} value={report.id}>
                            {report.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="frequency">Frequência</Label>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'quarterly') => setFormData(prev => ({ ...prev, frequency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="quarterly">Trimestral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.frequency === 'weekly' && (
                    <div>
                      <Label htmlFor="day-of-week">Dia da Semana</Label>
                      <Select
                        value={formData.dayOfWeek.toString()}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, dayOfWeek: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Segunda-feira</SelectItem>
                          <SelectItem value="2">Terça-feira</SelectItem>
                          <SelectItem value="3">Quarta-feira</SelectItem>
                          <SelectItem value="4">Quinta-feira</SelectItem>
                          <SelectItem value="5">Sexta-feira</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {(formData.frequency === 'monthly' || formData.frequency === 'quarterly') && (
                    <div>
                      <Label htmlFor="day-of-month">Dia do Mês</Label>
                      <Input
                        id="day-of-month"
                        type="number"
                        min="1"
                        max="28"
                        value={formData.dayOfMonth}
                        onChange={(e) => setFormData(prev => ({ ...prev, dayOfMonth: parseInt(e.target.value) }))}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="time">Horário</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="format">Formato</Label>
                  <Select
                    value={formData.format}
                    onValueChange={(value: 'pdf' | 'excel' | 'csv') => setFormData(prev => ({ ...prev, format: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Destinatários</Label>
                    <Button variant="outline" size="sm" onClick={addRecipient}>
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.recipients.map((email, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => updateRecipient(index, e.target.value)}
                          placeholder="email@exemplo.com"
                        />
                        {formData.recipients.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeRecipient(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is-active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
                  />
                  <Label htmlFor="is-active">Ativar agendamento</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>
                    {editingSchedule ? 'Atualizar' : 'Agendar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Frequência</TableHead>
              <TableHead>Próxima Execução</TableHead>
              <TableHead>Destinatários</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduledReports.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{schedule.name}</div>
                    <div className="text-sm text-gray-500">
                      Formato: {schedule.format.toUpperCase()}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getFrequencyText(schedule.frequency)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {schedule.nextRun.toLocaleDateString('pt-BR')} às {schedule.time}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {schedule.recipients.length} destinatário(s)
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(schedule.isActive)}>
                    {schedule.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleActive(schedule.id)}
                      title={schedule.isActive ? 'Pausar' : 'Ativar'}
                    >
                      {schedule.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(schedule)}
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(schedule.id)}
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {scheduledReports.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum agendamento configurado</p>
            <p className="text-sm">Configure o envio automático dos seus relatórios</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
