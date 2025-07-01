
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, AlertTriangle, Info, X, Eye, EyeOff } from 'lucide-react';
import { CostCenterAlert } from '@/utils/costCenterData';

interface CostCenterAlertsProps {
  alerts: CostCenterAlert[];
  onMarkAsRead: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
}

export const CostCenterAlerts = ({
  alerts,
  onMarkAsRead,
  onDismiss
}: CostCenterAlertsProps) => {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'warning' | 'critical'>('all');

  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case 'unread':
        return !alert.isRead;
      case 'warning':
        return alert.type === 'warning';
      case 'critical':
        return alert.type === 'critical';
      default:
        return true;
    }
  });

  const displayedAlerts = showAll ? filteredAlerts : filteredAlerts.slice(0, 3);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alertas Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum alerta ativo no momento</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alertas Inteligentes
            {unreadAlerts.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadAlerts.length}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter(filter === 'unread' ? 'all' : 'unread')}
            >
              {filter === 'unread' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {filter === 'unread' ? 'Todos' : 'Não Lidos'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {displayedAlerts.map((alert) => (
          <Alert key={alert.id} className={getAlertColor(alert.type)}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{alert.title}</h4>
                    {!alert.isRead && (
                      <Badge variant="secondary" className="text-xs">
                        Novo
                      </Badge>
                    )}
                  </div>
                  <AlertDescription className="text-sm">
                    {alert.message}
                  </AlertDescription>
                  {alert.threshold && alert.currentValue && (
                    <div className="mt-2 text-xs text-gray-600">
                      Limite: {alert.threshold}% | Atual: {alert.currentValue.toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-1 ml-4">
                {!alert.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead(alert.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDismiss(alert.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Alert>
        ))}
        
        {filteredAlerts.length > 3 && (
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="w-full"
          >
            {showAll ? 'Mostrar Menos' : `Ver Todos (${filteredAlerts.length})`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
