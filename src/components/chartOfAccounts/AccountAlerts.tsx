
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info, XCircle } from 'lucide-react';
import { AccountAlert } from '@/types/chartOfAccounts';

interface AccountAlertsProps {
  alerts: AccountAlert[];
}

export const AccountAlerts = ({ alerts }: AccountAlertsProps) => {
  if (!alerts || alerts.length === 0) return null;

  const getAlertIcon = (type: AccountAlert['type']) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <Info className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (type: AccountAlert['type']) => {
    switch (type) {
      case 'warning': return 'default';
      case 'info': return 'default';
      case 'error': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <Alert key={alert.id} variant={getAlertVariant(alert.type)}>
          {getAlertIcon(alert.type)}
          <AlertDescription className="text-sm">
            {alert.message}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};
