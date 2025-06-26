
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  previousValue?: string;
  change?: number;
  target?: number;
  icon: LucideIcon;
  format?: 'currency' | 'percentage' | 'number';
  alert?: 'success' | 'warning' | 'danger';
}

export const KPICard = ({ 
  title, 
  value, 
  previousValue, 
  change, 
  target, 
  icon: Icon, 
  format = 'number',
  alert 
}: KPICardProps) => {
  const getAlertColor = () => {
    switch (alert) {
      case 'success': return 'border-success-500 bg-success-50';
      case 'warning': return 'border-warning-500 bg-warning-50';
      case 'danger': return 'border-danger-500 bg-danger-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const getIconColor = () => {
    switch (alert) {
      case 'success': return 'text-success-600';
      case 'warning': return 'text-warning-600';
      case 'danger': return 'text-danger-600';
      default: return 'text-primary-600';
    }
  };

  const getChangeColor = () => {
    if (!change) return 'text-gray-500';
    return change > 0 ? 'text-success-600' : 'text-danger-600';
  };

  return (
    <div className={cn(
      "p-6 rounded-xl border-2 shadow-sm hover:shadow-md transition-all duration-200",
      getAlertColor()
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className={cn("w-5 h-5", getIconColor())} />
            <h3 className="text-sm font-medium text-gray-700">{title}</h3>
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            
            {change !== undefined && (
              <p className={cn("text-sm font-medium", getChangeColor())}>
                {change > 0 ? '+' : ''}{change.toFixed(1)}% vs anterior
              </p>
            )}
            
            {target && (
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Meta: {target.toFixed(1)}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      alert === 'success' ? 'bg-success-500' : 
                      alert === 'warning' ? 'bg-warning-500' : 'bg-danger-500'
                    )}
                    style={{ width: `${Math.min(target, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {alert && (
          <div className={cn(
            "w-3 h-3 rounded-full animate-pulse-glow",
            alert === 'success' ? 'bg-success-500' :
            alert === 'warning' ? 'bg-warning-500' : 'bg-danger-500'
          )} />
        )}
      </div>
    </div>
  );
};
