
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, FileText, File, Database, MessageCircle, Mail, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'xml' | 'json';
  template?: string;
  includeCharts: boolean;
  includeMetadata: boolean;
  compression: boolean;
  watermark: boolean;
  passwordProtect: boolean;
  password?: string;
}

interface WhatsAppOptions {
  phoneNumber: string;
  message: string;
  attachFile: boolean;
}

interface EmailOptions {
  to: string[];
  subject: string;
  body: string;
  attachFile: boolean;
}

interface AdvancedExportOptionsProps {
  reportData: any;
  reportTitle: string;
  onExport: (options: ExportOptions) => void;
  onWhatsAppShare: (options: WhatsAppOptions, exportOptions: ExportOptions) => void;
  onEmailShare: (options: EmailOptions, exportOptions: ExportOptions) => void;
}

export const AdvancedExportOptions = ({
  reportData,
  reportTitle,
  onExport,
  onWhatsAppShare,
  onEmailShare
}: AdvancedExportOptionsProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('export');
  
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeCharts: true,
    includeMetadata: true,
    compression: false,
    watermark: true,
    passwordProtect: false
  });

  const [whatsAppOptions, setWhatsAppOptions] = useState<WhatsAppOptions>({
    phoneNumber: '',
    message: `Segue o relatório ${reportTitle} em anexo.`,
    attachFile: true
  });

  const [emailOptions, setEmailOptions] = useState<EmailOptions>({
    to: [''],
    subject: `Relatório: ${reportTitle}`,
    body: `Olá,\n\nSegue em anexo o relatório ${reportTitle}.\n\nAtenciosamente,`,
    attachFile: true
  });

  const handleExport = () => {
    onExport(exportOptions);
    setIsDialogOpen(false);
    toast({
      title: "Exportação iniciada",
      description: `O relatório está sendo gerado no formato ${exportOptions.format.toUpperCase()}`
    });
  };

  const handleWhatsAppShare = () => {
    if (!whatsAppOptions.phoneNumber) {
      toast({
        title: "Erro",
        description: "Digite o número do WhatsApp",
        variant: "destructive"
      });
      return;
    }

    onWhatsAppShare(whatsAppOptions, exportOptions);
    setIsDialogOpen(false);
    toast({
      title: "Compartilhamento iniciado",
      description: "O relatório será compartilhado via WhatsApp"
    });
  };

  const handleEmailShare = () => {
    const validEmails = emailOptions.to.filter(email => email.trim() !== '');
    if (validEmails.length === 0) {
      toast({
        title: "Erro",
        description: "Digite pelo menos um email",
        variant: "destructive"
      });
      return;
    }

    onEmailShare({ ...emailOptions, to: validEmails }, exportOptions);
    setIsDialogOpen(false);
    toast({
      title: "Email enviado",
      description: `Relatório enviado para ${validEmails.length} destinatário(s)`
    });
  };

  const addEmailRecipient = () => {
    setEmailOptions(prev => ({
      ...prev,
      to: [...prev.to, '']
    }));
  };

  const updateEmailRecipient = (index: number, email: string) => {
    setEmailOptions(prev => ({
      ...prev,
      to: prev.to.map((recipient, i) => i === index ? email : recipient)
    }));
  };

  const removeEmailRecipient = (index: number) => {
    setEmailOptions(prev => ({
      ...prev,
      to: prev.to.filter((_, i) => i !== index)
    }));
  };

  const formatIcons = {
    pdf: FileText,
    excel: File,
    csv: Database,
    xml: FileText,
    json: Database
  };

  const FormatIcon = formatIcons[exportOptions.format];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar Avançado
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Opções de Exportação e Compartilhamento
          </DialogTitle>
          <DialogDescription>
            Configure as opções de exportação e escolha como compartilhar o relatório
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="format">Formato</Label>
                  <Select
                    value={exportOptions.format}
                    onValueChange={(value: any) => setExportOptions(prev => ({ ...prev, format: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        PDF
                      </SelectItem>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xml">XML</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {exportOptions.format === 'pdf' && (
                  <div>
                    <Label htmlFor="template">Template PDF</Label>
                    <Select
                      value={exportOptions.template || ''}
                      onValueChange={(value) => setExportOptions(prev => ({ ...prev, template: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Padrão</SelectItem>
                        <SelectItem value="executive">Executivo</SelectItem>
                        <SelectItem value="detailed">Detalhado</SelectItem>
                        <SelectItem value="summary">Resumo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {exportOptions.passwordProtect && (
                  <div>
                    <Label htmlFor="password">Senha de Proteção</Label>
                    <Input
                      id="password"
                      type="password"
                      value={exportOptions.password || ''}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Digite uma senha"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Opções de Conteúdo</Label>
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-charts"
                        checked={exportOptions.includeCharts}
                        onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, includeCharts: !!checked }))}
                      />
                      <Label htmlFor="include-charts">Incluir gráficos</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-metadata"
                        checked={exportOptions.includeMetadata}
                        onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, includeMetadata: !!checked }))}
                      />
                      <Label htmlFor="include-metadata">Incluir metadados</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="watermark"
                        checked={exportOptions.watermark}
                        onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, watermark: !!checked }))}
                      />
                      <Label htmlFor="watermark">Marca d'água</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="compression"
                        checked={exportOptions.compression}
                        onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, compression: !!checked }))}
                      />
                      <Label htmlFor="compression">Compressão de arquivo</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="password-protect"
                        checked={exportOptions.passwordProtect}
                        onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, passwordProtect: !!checked }))}
                      />
                      <Label htmlFor="password-protect">Proteger com senha</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleExport} className="flex items-center gap-2">
                <FormatIcon className="w-4 h-4" />
                Exportar {exportOptions.format.toUpperCase()}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="whatsapp" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="whatsapp-phone">Número do WhatsApp</Label>
                  <Input
                    id="whatsapp-phone"
                    value={whatsAppOptions.phoneNumber}
                    onChange={(e) => setWhatsAppOptions(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+55 11 99999-9999"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="whatsapp-attach"
                    checked={whatsAppOptions.attachFile}
                    onCheckedChange={(checked) => setWhatsAppOptions(prev => ({ ...prev, attachFile: !!checked }))}
                  />
                  <Label htmlFor="whatsapp-attach">Anexar arquivo</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="whatsapp-message">Mensagem</Label>
                <textarea
                  id="whatsapp-message"
                  className="w-full h-32 p-3 border rounded-md resize-none"
                  value={whatsAppOptions.message}
                  onChange={(e) => setWhatsAppOptions(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Digite sua mensagem..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleWhatsAppShare} className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Compartilhar no WhatsApp
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Destinatários</Label>
                  <Button variant="outline" size="sm" onClick={addEmailRecipient}>
                    Adicionar
                  </Button>
                </div>
                <div className="space-y-2">
                  {emailOptions.to.map((email, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => updateEmailRecipient(index, e.target.value)}
                        placeholder="email@exemplo.com"
                      />
                      {emailOptions.to.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeEmailRecipient(index)}
                        >
                          Remover
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="email-subject">Assunto</Label>
                <Input
                  id="email-subject"
                  value={emailOptions.subject}
                  onChange={(e) => setEmailOptions(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="email-body">Mensagem</Label>
                <textarea
                  id="email-body"
                  className="w-full h-32 p-3 border rounded-md resize-none"
                  value={emailOptions.body}
                  onChange={(e) => setEmailOptions(prev => ({ ...prev, body: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email-attach"
                  checked={emailOptions.attachFile}
                  onCheckedChange={(checked) => setEmailOptions(prev => ({ ...prev, attachFile: !!checked }))}
                />
                <Label htmlFor="email-attach">Anexar relatório</Label>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleEmailShare} className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Enviar por Email
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
