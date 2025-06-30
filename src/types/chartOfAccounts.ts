
export type AccountType = 'revenue' | 'expense' | 'asset' | 'liability' | 'equity';

export type AccountTag = 'operacional' | 'estrategica' | 'regulatoria' | 'fiscal' | 'gerencial' | 'temporaria';

export type AccountStatus = 'active' | 'inactive' | 'pending' | 'blocked';

export interface Account {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: AccountType;
  parentId?: string;
  isActive: boolean;
  level: number;
  hasChildren: boolean;
  balance?: number;
  tags?: AccountTag[];
  notes?: string;
  status: AccountStatus;
  priority: number;
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountFormData {
  code: string;
  name: string;
  description?: string;
  type: AccountType;
  parentId?: string;
  isActive: boolean;
  tags?: AccountTag[];
  notes?: string;
  status: AccountStatus;
  priority: number;
}

export interface AccountAlert {
  id: string;
  accountId: string;
  type: 'warning' | 'info' | 'error';
  message: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;
}
