
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Credential } from '@/types/systemSettings';
import { Eye, EyeOff, Edit, Trash2, Plus, Key, Shield, AlertCircle } from 'lucide-react';

interface CredentialsSectionProps {
  credentials: Credential[];
}

export const CredentialsSection = ({ credentials }: CredentialsSectionProps) => {
  const { toast } = useToast();
  const [visibleCredentials, setVisibleCredentials] = useState<Set<string>>(new Set());

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Credenciais & Tokens</h2>
          <p className="text-gray-600">
            Gerencie chaves de API, tokens de acesso e outras credenciais de segurança.
          </p>
        </div>
        <Button>
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
                        <AlertCircle className="h-4 w-4 text-yellow-500" title="Expira em breve" />
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
                      >
                        {visibleCredentials.has(credential.id) ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
