import { useState, useEffect } from 'react';
import { Account, AccountType } from '@/types/chartOfAccounts';

const STORAGE_KEY = 'la-music-chart-of-accounts';

const defaultAccounts: Account[] = [
  // RECEITAS (REVENUE) - NOVA ESTRUTURA HIERÁRQUICA
  // 3 - RECEITAS OPERACIONAIS
  {
    id: 'rev-3',
    code: '3',
    name: 'Receitas Operacionais',
    type: 'revenue',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 3.1 - CURSOS
  {
    id: 'rev-3.1',
    code: '3.1',
    name: 'Cursos',
    type: 'revenue',
    parentId: 'rev-3',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.1.1',
    code: '3.1.1',
    name: 'Mensalidades',
    type: 'revenue',
    parentId: 'rev-3.1',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.1.1.1',
    code: '3.1.1.1',
    name: 'Mensalidades - Campo Grande',
    type: 'revenue',
    parentId: 'rev-3.1.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.1.1.2',
    code: '3.1.1.2',
    name: 'Mensalidades - Recreio',
    type: 'revenue',
    parentId: 'rev-3.1.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.1.1.3',
    code: '3.1.1.3',
    name: 'Mensalidades - Barra',
    type: 'revenue',
    parentId: 'rev-3.1.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.1.2',
    code: '3.1.2',
    name: 'Taxas de Matrícula',
    type: 'revenue',
    parentId: 'rev-3.1',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.1.2.1',
    code: '3.1.2.1',
    name: 'Matrícula - Campo Grande',
    type: 'revenue',
    parentId: 'rev-3.1.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.1.2.2',
    code: '3.1.2.2',
    name: 'Matrícula - Recreio',
    type: 'revenue',
    parentId: 'rev-3.1.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.1.2.3',
    code: '3.1.2.3',
    name: 'Matrícula - Barra',
    type: 'revenue',
    parentId: 'rev-3.1.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.1.3',
    code: '3.1.3',
    name: 'Aulas Particulares',
    type: 'revenue',
    parentId: 'rev-3.1',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.1.3.1',
    code: '3.1.3.1',
    name: 'Aulas Particulares - Campo Grande',
    type: 'revenue',
    parentId: 'rev-3.1.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.1.3.2',
    code: '3.1.3.2',
    name: 'Aulas Particulares - Recreio',
    type: 'revenue',
    parentId: 'rev-3.1.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.1.3.3',
    code: '3.1.3.3',
    name: 'Aulas Particulares - Barra',
    type: 'revenue',
    parentId: 'rev-3.1.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.1.4',
    code: '3.1.4',
    name: 'Workshops e Cursos Livres',
    type: 'revenue',
    parentId: 'rev-3.1',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.1.4.1',
    code: '3.1.4.1',
    name: 'Workshops - Campo Grande',
    type: 'revenue',
    parentId: 'rev-3.1.4',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.1.4.2',
    code: '3.1.4.2',
    name: 'Workshops - Recreio',
    type: 'revenue',
    parentId: 'rev-3.1.4',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.1.4.3',
    code: '3.1.4.3',
    name: 'Workshops - Barra',
    type: 'revenue',
    parentId: 'rev-3.1.4',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 3.2 - LOJINHA
  {
    id: 'rev-3.2',
    code: '3.2',
    name: 'Lojinha',
    type: 'revenue',
    parentId: 'rev-3',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.2.1',
    code: '3.2.1',
    name: 'Instrumentos Musicais',
    type: 'revenue',
    parentId: 'rev-3.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.2.2',
    code: '3.2.2',
    name: 'Acessórios',
    type: 'revenue',
    parentId: 'rev-3.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.2.3',
    code: '3.2.3',
    name: 'Partituras e Métodos',
    type: 'revenue',
    parentId: 'rev-3.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.2.4',
    code: '3.2.4',
    name: 'Merchandise',
    type: 'revenue',
    parentId: 'rev-3.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 3.3 - LA PRODUÇÕES
  {
    id: 'rev-3.3',
    code: '3.3',
    name: 'LA Produções',
    type: 'revenue',
    parentId: 'rev-3',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.3.1',
    code: '3.3.1',
    name: 'Shows e Apresentações',
    type: 'revenue',
    parentId: 'rev-3.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.3.2',
    code: '3.3.2',
    name: 'Eventos Corporativos',
    type: 'revenue',
    parentId: 'rev-3.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.3.3',
    code: '3.3.3',
    name: 'Produção Musical',
    type: 'revenue',
    parentId: 'rev-3.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.3.4',
    code: '3.3.4',
    name: 'Locação de Equipamentos',
    type: 'revenue',
    parentId: 'rev-3.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 3.4 - OUTRAS VENDAS OPERACIONAIS
  {
    id: 'rev-3.4',
    code: '3.4',
    name: 'Outras Vendas Operacionais',
    type: 'revenue',
    parentId: 'rev-3',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.4.1',
    code: '3.4.1',
    name: 'Parcerias Educacionais',
    type: 'revenue',
    parentId: 'rev-3.4',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.4.2',
    code: '3.4.2',
    name: 'Consultoria Musical',
    type: 'revenue',
    parentId: 'rev-3.4',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.4.3',
    code: '3.4.3',
    name: 'Outras Receitas',
    type: 'revenue',
    parentId: 'rev-3.4',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 7 - RECEITAS NÃO OPERACIONAIS
  {
    id: 'rev-7',
    code: '7',
    name: 'Receitas Não Operacionais',
    type: 'revenue',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 7.1 - RECEITAS FINANCEIRAS
  {
    id: 'rev-7.1',
    code: '7.1',
    name: 'Receitas Financeiras',
    type: 'revenue',
    parentId: 'rev-7',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-7.1.1',
    code: '7.1.1',
    name: 'Juros de Aplicações Financeiras',
    type: 'revenue',
    parentId: 'rev-7.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-7.1.2',
    code: '7.1.2',
    name: 'Rendimento de Poupança',
    type: 'revenue',
    parentId: 'rev-7.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-7.1.3',
    code: '7.1.3',
    name: 'Descontos Obtidos',
    type: 'revenue',
    parentId: 'rev-7.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 7.2 - RECEITAS EXTRAORDINÁRIAS
  {
    id: 'rev-7.2',
    code: '7.2',
    name: 'Receitas Extraordinárias',
    type: 'revenue',
    parentId: 'rev-7',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-7.2.1',
    code: '7.2.1',
    name: 'Venda de Ativo Imobilizado',
    type: 'revenue',
    parentId: 'rev-7.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-7.2.2',
    code: '7.2.2',
    name: 'Recuperação de Créditos',
    type: 'revenue',
    parentId: 'rev-7.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-7.2.3',
    code: '7.2.3',
    name: 'Doações Recebidas',
    type: 'revenue',
    parentId: 'rev-7.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 7.3 - OUTRAS RECEITAS NÃO OPERACIONAIS
  {
    id: 'rev-7.3',
    code: '7.3',
    name: 'Outras Receitas Não Operacionais',
    type: 'revenue',
    parentId: 'rev-7',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-7.3.1',
    code: '7.3.1',
    name: 'Subvenções Governamentais',
    type: 'revenue',
    parentId: 'rev-7.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-7.3.2',
    code: '7.3.2',
    name: 'Royalties e Licenças',
    type: 'revenue',
    parentId: 'rev-7.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-7.3.3',
    code: '7.3.3',
    name: 'Receitas Eventuais',
    type: 'revenue',
    parentId: 'rev-7.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // DESPESAS (EXPENSE) - Mantidas da estrutura original
  {
    id: 'exp-4.1',
    code: '4.1',
    name: 'Despesas Operacionais',
    type: 'expense',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 4.1.1 - Custos Diretos de Ensino
  {
    id: 'exp-4.1.1',
    code: '4.1.1',
    name: 'Custos Diretos de Ensino',
    type: 'expense',
    parentId: 'exp-4.1',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.1.1',
    code: '4.1.1.1',
    name: 'Folha de Pagamento - Professores',
    type: 'expense',
    parentId: 'exp-4.1.1',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.1.1.1',
    code: '4.1.1.1.1',
    name: 'Salários - Professores',
    type: 'expense',
    parentId: 'exp-4.1.1.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.1.1.2',
    code: '4.1.1.1.2',
    name: 'Encargos Sociais - Professores',
    type: 'expense',
    parentId: 'exp-4.1.1.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.1.1.3',
    code: '4.1.1.1.3',
    name: 'FGTS - Professores',
    type: 'expense',
    parentId: 'exp-4.1.1.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.1.2',
    code: '4.1.1.2',
    name: 'Material de Ensino',
    type: 'expense',
    parentId: 'exp-4.1.1',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.1.2.1',
    code: '4.1.1.2.1',
    name: 'Instrumentos Musicais',
    type: 'expense',
    parentId: 'exp-4.1.1.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.1.2.2',
    code: '4.1.1.2.2',
    name: 'Partituras e Métodos',
    type: 'expense',
    parentId: 'exp-4.1.1.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.1.3',
    code: '4.1.1.3',
    name: 'Aulas Terceirizadas',
    type: 'expense',
    parentId: 'exp-4.1.1',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.1.3.1',
    code: '4.1.1.3.1',
    name: 'Professores Freelance',
    type: 'expense',
    parentId: 'exp-4.1.1.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 4.1.2 - Custos de Unidades
  {
    id: 'exp-4.1.2',
    code: '4.1.2',
    name: 'Custos de Unidades',
    type: 'expense',
    parentId: 'exp-4.1',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.1',
    code: '4.1.2.1',
    name: 'Campo Grande',
    type: 'expense',
    parentId: 'exp-4.1.2',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.1.1',
    code: '4.1.2.1.1',
    name: 'Aluguel - Campo Grande',
    type: 'expense',
    parentId: 'exp-4.1.2.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.1.2',
    code: '4.1.2.1.2',
    name: 'Condomínio - Campo Grande',
    type: 'expense',
    parentId: 'exp-4.1.2.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.1.3',
    code: '4.1.2.1.3',
    name: 'Utilities - Campo Grande',
    type: 'expense',
    parentId: 'exp-4.1.2.1',
    isActive: true,
    level: 3,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.1.3.1',
    code: '4.1.2.1.3.1',
    name: 'Energia Elétrica - Campo Grande',
    type: 'expense',
    parentId: 'exp-4.1.2.1.3',
    isActive: true,
    level: 4,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.1.3.2',
    code: '4.1.2.1.3.2',
    name: 'Água - Campo Grande',
    type: 'expense',
    parentId: 'exp-4.1.2.1.3',
    isActive: true,
    level: 4,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.1.3.3',
    code: '4.1.2.1.3.3',
    name: 'Internet - Campo Grande',
    type: 'expense',
    parentId: 'exp-4.1.2.1.3',
    isActive: true,
    level: 4,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.2',
    code: '4.1.2.2',
    name: 'Recreio',
    type: 'expense',
    parentId: 'exp-4.1.2',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.2.1',
    code: '4.1.2.2.1',
    name: 'Aluguel - Recreio',
    type: 'expense',
    parentId: 'exp-4.1.2.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.2.2',
    code: '4.1.2.2.2',
    name: 'Condomínio - Recreio',
    type: 'expense',
    parentId: 'exp-4.1.2.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.2.3',
    code: '4.1.2.2.3',
    name: 'Utilities - Recreio',
    type: 'expense',
    parentId: 'exp-4.1.2.2',
    isActive: true,
    level: 3,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.2.3.1',
    code: '4.1.2.2.3.1',
    name: 'Energia Elétrica - Recreio',
    type: 'expense',
    parentId: 'exp-4.1.2.2.3',
    isActive: true,
    level: 4,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.2.3.2',
    code: '4.1.2.2.3.2',
    name: 'Água - Recreio',
    type: 'expense',
    parentId: 'exp-4.1.2.2.3',
    isActive: true,
    level: 4,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.2.3.3',
    code: '4.1.2.2.3.3',
    name: 'Internet - Recreio',
    type: 'expense',
    parentId: 'exp-4.1.2.2.3',
    isActive: true,
    level: 4,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.3',
    code: '4.1.2.3',
    name: 'Barra',
    type: 'expense',
    parentId: 'exp-4.1.2',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.3.1',
    code: '4.1.2.3.1',
    name: 'Aluguel - Barra',
    type: 'expense',
    parentId: 'exp-4.1.2.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.3.2',
    code: '4.1.2.3.2',
    name: 'Condomínio - Barra',
    type: 'expense',
    parentId: 'exp-4.1.2.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.3.3',
    code: '4.1.2.3.3',
    name: 'Utilities - Barra',
    type: 'expense',
    parentId: 'exp-4.1.2.3',
    isActive: true,
    level: 3,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.3.3.1',
    code: '4.1.2.3.3.1',
    name: 'Energia Elétrica - Barra',
    type: 'expense',
    parentId: 'exp-4.1.2.3.3',
    isActive: true,
    level: 4,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.3.3.2',
    code: '4.1.2.3.3.2',
    name: 'Água - Barra',
    type: 'expense',
    parentId: 'exp-4.1.2.3.3',
    isActive: true,
    level: 4,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2.3.3.3',
    code: '4.1.2.3.3.3',
    name: 'Internet - Barra',
    type: 'expense',
    parentId: 'exp-4.1.2.3.3',
    isActive: true,
    level: 4,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 4.2 - DESPESAS ADMINISTRATIVAS
  {
    id: 'exp-4.2',
    code: '4.2',
    name: 'Despesas Administrativas',
    type: 'expense',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 4.2.1 - Pessoal Administrativo
  {
    id: 'exp-4.2.1',
    code: '4.2.1',
    name: 'Pessoal Administrativo',
    type: 'expense',
    parentId: 'exp-4.2',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.1.1',
    code: '4.2.1.1',
    name: 'Folha Administrativa',
    type: 'expense',
    parentId: 'exp-4.2.1',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.1.1.1',
    code: '4.2.1.1.1',
    name: 'Salário - Coordenação',
    type: 'expense',
    parentId: 'exp-4.2.1.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.1.1.2',
    code: '4.2.1.1.2',
    name: 'Salário - Secretaria',
    type: 'expense',
    parentId: 'exp-4.2.1.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.1.1.3',
    code: '4.2.1.1.3',
    name: 'Encargos Sociais - Administrativo',
    type: 'expense',
    parentId: 'exp-4.2.1.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 4.2.2 - Marketing e Comunicação
  {
    id: 'exp-4.2.2',
    code: '4.2.2',
    name: 'Marketing e Comunicação',
    type: 'expense',
    parentId: 'exp-4.2',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.2.1',
    code: '4.2.2.1',
    name: 'Publicidade Online',
    type: 'expense',
    parentId: 'exp-4.2.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.2.2',
    code: '4.2.2.2',
    name: 'Material Gráfico',
    type: 'expense',
    parentId: 'exp-4.2.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.2.3',
    code: '4.2.2.3',
    name: 'Eventos e Apresentações',
    type: 'expense',
    parentId: 'exp-4.2.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 4.2.3 - Serviços Administrativos
  {
    id: 'exp-4.2.3',
    code: '4.2.3',
    name: 'Serviços Administrativos',
    type: 'expense',
    parentId: 'exp-4.2',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.3.1',
    code: '4.2.3.1',
    name: 'Contabilidade',
    type: 'expense',
    parentId: 'exp-4.2.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.3.2',
    code: '4.2.3.2',
    name: 'Consultoria Jurídica',
    type: 'expense',
    parentId: 'exp-4.2.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.3.3',
    code: '4.2.3.3',
    name: 'Seguros',
    type: 'expense',
    parentId: 'exp-4.2.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 4.2.4 - Despesas Gerais
  {
    id: 'exp-4.2.4',
    code: '4.2.4',
    name: 'Despesas Gerais',
    type: 'expense',
    parentId: 'exp-4.2',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.4.1',
    code: '4.2.4.1',
    name: 'Material de Escritório',
    type: 'expense',
    parentId: 'exp-4.2.4',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.4.2',
    code: '4.2.4.2',
    name: 'Limpeza e Conservação',
    type: 'expense',
    parentId: 'exp-4.2.4',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.4.3',
    code: '4.2.4.3',
    name: 'Tecnologia',
    type: 'expense',
    parentId: 'exp-4.2.4',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.4.3.1',
    code: '4.2.4.3.1',
    name: 'Software e Licenças',
    type: 'expense',
    parentId: 'exp-4.2.4.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.4.3.2',
    code: '4.2.4.3.2',
    name: 'Manutenção de Equipamentos',
    type: 'expense',
    parentId: 'exp-4.2.4.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 4.3 - DESPESAS FINANCEIRAS
  {
    id: 'exp-4.3',
    code: '4.3',
    name: 'Despesas Financeiras',
    type: 'expense',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.3.1',
    code: '4.3.1',
    name: 'Juros e Encargos',
    type: 'expense',
    parentId: 'exp-4.3',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.3.1.1',
    code: '4.3.1.1',
    name: 'Juros de Empréstimos',
    type: 'expense',
    parentId: 'exp-4.3.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.3.1.2',
    code: '4.3.1.2',
    name: 'Multas e Juros de Atraso',
    type: 'expense',
    parentId: 'exp-4.3.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.3.2',
    code: '4.3.2',
    name: 'Tarifas Bancárias',
    type: 'expense',
    parentId: 'exp-4.3',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.3.2.1',
    code: '4.3.2.1',
    name: 'Tarifas de Conta Corrente',
    type: 'expense',
    parentId: 'exp-4.3.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.3.2.2',
    code: '4.3.2.2',
    name: 'Taxa de Cartão de Crédito',
    type: 'expense',
    parentId: 'exp-4.3.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const useChartOfAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const storedAccounts = localStorage.getItem(STORAGE_KEY);
    if (storedAccounts) {
      try {
        const parsed = JSON.parse(storedAccounts);
        setAccounts(parsed.map((account: any) => ({
          ...account,
          createdAt: new Date(account.createdAt),
          updatedAt: new Date(account.updatedAt)
        })));
      } catch (error) {
        console.error('Error parsing stored accounts:', error);
        setAccounts(defaultAccounts);
      }
    } else {
      setAccounts(defaultAccounts);
    }
  }, []);

  const saveToStorage = (updatedAccounts: Account[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAccounts));
    setAccounts(updatedAccounts);
  };

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const addAccount = (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAccount: Account = {
      ...accountData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedAccounts = [...accounts, newAccount];
    
    // Update parent hasChildren if needed
    if (newAccount.parentId) {
      const parentIndex = updatedAccounts.findIndex(acc => acc.id === newAccount.parentId);
      if (parentIndex !== -1) {
        updatedAccounts[parentIndex].hasChildren = true;
      }
    }

    saveToStorage(updatedAccounts);
  };

  const updateAccount = (id: string, accountData: Partial<Omit<Account, 'id' | 'createdAt'>>) => {
    const updatedAccounts = accounts.map(account => 
      account.id === id 
        ? { ...account, ...accountData, updatedAt: new Date() }
        : account
    );
    saveToStorage(updatedAccounts);
  };

  const deleteAccount = (id: string) => {
    const accountToDelete = accounts.find(acc => acc.id === id);
    if (!accountToDelete) return;

    // Check if account has children
    const hasChildren = accounts.some(acc => acc.parentId === id);
    if (hasChildren) {
      alert('Não é possível excluir uma conta que possui subcontas. Exclua primeiro as subcontas.');
      return;
    }

    const updatedAccounts = accounts.filter(account => account.id !== id);
    
    // Update parent hasChildren if this was the last child
    if (accountToDelete.parentId) {
      const siblingsCount = accounts.filter(acc => 
        acc.parentId === accountToDelete.parentId && acc.id !== id
      ).length;
      
      if (siblingsCount === 0) {
        const parentIndex = updatedAccounts.findIndex(acc => acc.id === accountToDelete.parentId);
        if (parentIndex !== -1) {
          updatedAccounts[parentIndex].hasChildren = false;
        }
      }
    }

    saveToStorage(updatedAccounts);
  };

  const getChildAccounts = (parentId: string) => {
    return accounts.filter(account => account.parentId === parentId);
  };

  const getAccountPath = (accountId: string): Account[] => {
    const path: Account[] = [];
    let currentAccount = accounts.find(acc => acc.id === accountId);
    
    while (currentAccount) {
      path.unshift(currentAccount);
      currentAccount = currentAccount.parentId 
        ? accounts.find(acc => acc.id === currentAccount!.parentId)
        : undefined;
    }
    
    return path;
  };

  return {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    getChildAccounts,
    getAccountPath
  };
};
