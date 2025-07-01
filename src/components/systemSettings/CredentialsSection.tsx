
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { Credential } from '@/types/systemSettings';
import { CredentialConfigModal } from './CredentialConfigModal';
import { Eye, EyeOff, Edit, Trash2, Plus, Key, Shield, AlertCircle } from 'lucide-react';

interface CredentialsSectionProps {
  credentials: Credential[];
}

export const CredentialsSection = ({ credentials }: CredentialsSectionProps) => {
  const { toast } = useToast();
  const { updateCredential } = useSystemSettings();
  const [visibleCredentials, setVisibleCredentials] = useState<Set<string>>(new Set());
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'invalid':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'valid':
        return 'Válido';
      case 'expired':
        return 'Expirado';
      case 'invalid':
        return 'Inválido';
      default:
        return 'Desconhecido';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'API_KEY':
        return <Key className="h-4 w-4" />;
      case 'TOKEN':
        return <Shield className="h-4 w-4" />;
      case 'OAUTH':
        return <Shield className="h-4 w-4" />;
      case 'DATABASE':
        return <Shield className="h-4 w-4" />;
      case 'CERTIFICATE':
        return <Shield className="h-4 w-4" />;
      default:
        return <Key className="h-4 w-4" />;
    }
  };

  const toggleCredentialVisibility = (credentialId: string) => {
    const newVisible = new Set(visibleCredentials);
    if (newVisible.has(credentialId)) {
      newVisible.delete(credentialId);
    } else {
      newVisible.add(credentialId);
    }
    setVisibleCredentials(newVisible);
  };

  const handleNewCredential = () => {
    setSelectedCredential(null);
    setIsModalOpen(true);
  };

  const handleEditCredential = (credential: Credential) => {
    setSelectedCredential(credential);
    setIsModalOpen(true);
  };

  const handleDeleteCredential = async (credential: Credential) => {
    // In a real implementation, this would call a delete API
    toast({
      title: "Credencial Removida",
      description: `${credential.name} foi removido com sucesso`,
    });
  };

  const handleSaveCredential = async (credential: Credential) => {
    await updateCredential(credential);
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const isExpiringSoon = (expiresAt?: string) => {
    if (!expiresAt) return false;
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const maskValue = (value: string) => {
    if (value.length <= 8) return '*'.repeat(value.length);
    return value.substring(0, 4) + '*'.repeat(value.length - 8) + value.substring(value.length - 4);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Credenciais & Tokens</h2>
          <p className="text-gray-600">
            Gerencie chaves de API, tokens de acesso e outras credenciais de segurança.
          </p>
        </div>
        <Button onClick={handleNewCredential}>
          <Plus className="h-4 w-4" />
          Adicionar Credencial
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Credenciais Configuradas</CardTitle>
          <CardDescription>
            Todas as credenciais são criptografadas e armazenadas com segurança.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expira em</TableHead>
                <TableHead>Último Uso</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {credentials.map((credential) => (
                <TableRow key={credential.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(credential.type)}
                      <span className="font-medium">{credential.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {credential.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{credential.service}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getStatusColor(credential.status)}`}>
                        {getStatusText(credential.status)}
                      </Badge>
                      {isExpiringSoon(credential.expiresAt) && (
                        <div title="Expira em breve">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {credential.expiresAt ? formatDate(credential.expiresAt) : 'Nunca'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(credential.lastUsed)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleCredentialVisibility(credential.id)}
                        title={visibleCredentials.has(credential.id) ? 'Ocultar' : 'Mostrar'}
                      >
                        {visibleCredentials.has(credential.id) ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditCredential(credential)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja remover a credencial "{credential.name}"? 
                              Esta ação não pode ser desfeita e pode afetar integrações que dependem desta credencial.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteCredential(credential)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Show credential values when toggled */}
          {Array.from(visibleCredentials).map((credentialId) => {
            const credential = credentials.find(c => c.id === credentialId);
            if (!credential) return null;

            return (
              <Card key={`${credentialId}-details`} className="mt-4 bg-gray-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Valor da Credencial: {credential.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-mono text-sm bg-white p-3 rounded border">
                    {credential.masked ? maskValue('sk_test_1234567890abcdef') : 'sk_test_1234567890abcdef'}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    ⚠️ Mantenha esta informação segura e não compartilhe com terceiros não autorizados.
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      <CredentialConfigModal
        credential={selectedCredential}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCredential}
      />
    </div>
  );
};
