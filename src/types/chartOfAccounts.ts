
export type AccountType = 'revenue' | 'expense' | 'liability' | 'equity';

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
}
