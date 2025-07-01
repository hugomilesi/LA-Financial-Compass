import { useState, useEffect } from 'react';
import { Account, AccountType } from '@/types/chartOfAccounts';

const STORAGE_KEY = 'la-music-chart-of-accounts';

const defaultAccounts: Account[] = [
  // RECEITAS (REVENUE) - NOVA ESTRUTURA CORRIGIDA SEM SUBDIVISÕES POR UNIDADE
  // 3 - RECEITAS/FATURAMENTO
  {
    id: 'rev-3',
    code: '3',
    name: 'Receitas/Faturamento',
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
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.1.2',
    code: '3.1.2',
    name: 'Passaporte',
    type: 'revenue',
    parentId: 'rev-3.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.1.3',
    code: '3.1.3',
    name: 'Aula Particular',
    type: 'revenue',
    parentId: 'rev-3.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'rev-3.1.4',
    code: '3.1.4',
    name: 'Workshop',
    type: 'revenue',
    parentId: 'rev-3.1',
    isActive: true,
    level: 2,
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
    name: 'Merchandising',
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
    name: 'Evento Corporativo',
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

  // 3.4 - OUTRAS VENDAS
  {
    id: 'rev-3.4',
    code: '3.4',
    name: 'Outras Vendas',
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
    name: 'Parcerias',
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
    name: 'Outras',
    type: 'revenue',
    parentId: 'rev-3.4',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 4. DESPESAS/CUSTOS VARIÁVEIS
  {
    id: 'exp-4',
    code: '4',
    name: 'Despesas/Custos Variáveis',
    type: 'expense',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 4.1 - CUSTO DOS PRODUTOS VENDIDOS (CPV)
  {
    id: 'exp-4.1',
    code: '4.1',
    name: 'Custo dos Produtos Vendidos (CPV)',
    type: 'expense',
    parentId: 'exp-4',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.1',
    code: '4.1.1',
    name: 'Custo - Instrumentos Musicais',
    type: 'expense',
    parentId: 'exp-4.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.2',
    code: '4.1.2',
    name: 'Custo - Acessórios',
    type: 'expense',
    parentId: 'exp-4.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.3',
    code: '4.1.3',
    name: 'Custo - Partituras e Métodos',
    type: 'expense',
    parentId: 'exp-4.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.1.4',
    code: '4.1.4',
    name: 'Custo - Merchandising',
    type: 'expense',
    parentId: 'exp-4.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 4.2 - COMISSÕES E INCENTIVOS
  {
    id: 'exp-4.2',
    code: '4.2',
    name: 'Comissões e Incentivos',
    type: 'expense',
    parentId: 'exp-4',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.1',
    code: '4.2.1',
    name: 'Comissões de Vendas',
    type: 'expense',
    parentId: 'exp-4.2',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.1.1',
    code: '4.2.1.1',
    name: 'Comissão - Cursos',
    type: 'expense',
    parentId: 'exp-4.2.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.1.2',
    code: '4.2.1.2',
    name: 'Comissão - Lojinha',
    type: 'expense',
    parentId: 'exp-4.2.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.1.3',
    code: '4.2.1.3',
    name: 'Comissão - LA Produções',
    type: 'expense',
    parentId: 'exp-4.2.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.2',
    code: '4.2.2',
    name: 'Bonificações por Performance',
    type: 'expense',
    parentId: 'exp-4.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.2.3',
    code: '4.2.3',
    name: 'Incentivos para Professores',
    type: 'expense',
    parentId: 'exp-4.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 4.3 - TAXAS E IMPOSTOS SOBRE VENDAS
  {
    id: 'exp-4.3',
    code: '4.3',
    name: 'Taxas e Impostos sobre Vendas',
    type: 'expense',
    parentId: 'exp-4',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.3.1',
    code: '4.3.1',
    name: 'Taxas de Cartão de Crédito/Débito',
    type: 'expense',
    parentId: 'exp-4.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.3.2',
    code: '4.3.2',
    name: 'ISS sobre Serviços',
    type: 'expense',
    parentId: 'exp-4.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.3.3',
    code: '4.3.3',
    name: 'ICMS sobre Produtos',
    type: 'expense',
    parentId: 'exp-4.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.3.4',
    code: '4.3.4',
    name: 'Simples Nacional',
    type: 'expense',
    parentId: 'exp-4.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 4.4 - DESPESAS VARIÁVEIS DE PRODUÇÃO
  {
    id: 'exp-4.4',
    code: '4.4',
    name: 'Despesas Variáveis de Produção',
    type: 'expense',
    parentId: 'exp-4',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.4.1',
    code: '4.4.1',
    name: 'Custos de Shows e Apresentações',
    type: 'expense',
    parentId: 'exp-4.4',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.4.1.1',
    code: '4.4.1.1',
    name: 'Locação de Equipamentos',
    type: 'expense',
    parentId: 'exp-4.4.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.4.1.2',
    code: '4.4.1.2',
    name: 'Transporte de Equipamentos',
    type: 'expense',
    parentId: 'exp-4.4.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.4.1.3',
    code: '4.4.1.3',
    name: 'Cachê de Artistas Convidados',
    type: 'expense',
    parentId: 'exp-4.4.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.4.2',
    code: '4.4.2',
    name: 'Material para Workshops',
    type: 'expense',
    parentId: 'exp-4.4',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.4.3',
    code: '4.4.3',
    name: 'Custos de Produção Musical',
    type: 'expense',
    parentId: 'exp-4.4',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.4.3.1',
    code: '4.4.3.1',
    name: 'Estúdio de Gravação',
    type: 'expense',
    parentId: 'exp-4.4.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-4.4.3.2',
    code: '4.4.3.2',
    name: 'Músicos Sessão',
    type: 'expense',
    parentId: 'exp-4.4.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 5. DESPESAS FIXAS - NEW SECTION
  {
    id: 'exp-5',
    code: '5',
    name: 'Despesas Fixas',
    type: 'expense',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 5.1 - PESSOAL FIXO
  {
    id: 'exp-5.1',
    code: '5.1',
    name: 'Pessoal Fixo',
    type: 'expense',
    parentId: 'exp-5',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.1.1',
    code: '5.1.1',
    name: 'Salários - Administrativo',
    type: 'expense',
    parentId: 'exp-5.1',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.1.1.1',
    code: '5.1.1.1',
    name: 'Direção Geral',
    type: 'expense',
    parentId: 'exp-5.1.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.1.1.2',
    code: '5.1.1.2',
    name: 'Coordenação Pedagógica',
    type: 'expense',
    parentId: 'exp-5.1.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.1.1.3',
    code: '5.1.1.3',
    name: 'Secretaria',
    type: 'expense',
    parentId: 'exp-5.1.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.1.1.4',
    code: '5.1.1.4',
    name: 'Recepção',
    type: 'expense',
    parentId: 'exp-5.1.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.1.1.5',
    code: '5.1.1.5',
    name: 'Limpeza',
    type: 'expense',
    parentId: 'exp-5.1.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.1.2',
    code: '5.1.2',
    name: 'Salários - Professores Fixos',
    type: 'expense',
    parentId: 'exp-5.1',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.1.2.1',
    code: '5.1.2.1',
    name: 'Professores CLT',
    type: 'expense',
    parentId: 'exp-5.1.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.1.2.2',
    code: '5.1.2.2',
    name: 'Professores PJ Fixos',
    type: 'expense',
    parentId: 'exp-5.1.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.1.3',
    code: '5.1.3',
    name: 'Encargos Trabalhistas',
    type: 'expense',
    parentId: 'exp-5.1',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.1.3.1',
    code: '5.1.3.1',
    name: 'INSS',
    type: 'expense',
    parentId: 'exp-5.1.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.1.3.2',
    code: '5.1.3.2',
    name: 'FGTS',
    type: 'expense',
    parentId: 'exp-5.1.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.1.3.3',
    code: '5.1.3.3',
    name: 'Férias + 1/3',
    type: 'expense',
    parentId: 'exp-5.1.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.1.3.4',
    code: '5.1.3.4',
    name: '13º Salário',
    type: 'expense',
    parentId: 'exp-5.1.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.1.4',
    code: '5.1.4',
    name: 'Benefícios',
    type: 'expense',
    parentId: 'exp-5.1',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.1.4.1',
    code: '5.1.4.1',
    name: 'Vale Transporte',
    type: 'expense',
    parentId: 'exp-5.1.4',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.1.4.2',
    code: '5.1.4.2',
    name: 'Vale Refeição',
    type: 'expense',
    parentId: 'exp-5.1.4',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.1.4.3',
    code: '5.1.4.3',
    name: 'Plano de Saúde',
    type: 'expense',
    parentId: 'exp-5.1.4',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 5.2 - CUSTOS DE OCUPAÇÃO
  {
    id: 'exp-5.2',
    code: '5.2',
    name: 'Custos de Ocupação',
    type: 'expense',
    parentId: 'exp-5',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.2.1',
    code: '5.2.1',
    name: 'Campo Grande',
    type: 'expense',
    parentId: 'exp-5.2',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.2.1.1',
    code: '5.2.1.1',
    name: 'Aluguel - Campo Grande',
    type: 'expense',
    parentId: 'exp-5.2.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.2.1.2',
    code: '5.2.1.2',
    name: 'Condomínio - Campo Grande',
    type: 'expense',
    parentId: 'exp-5.2.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.2.1.3',
    code: '5.2.1.3',
    name: 'IPTU - Campo Grande',
    type: 'expense',
    parentId: 'exp-5.2.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.2.1.4',
    code: '5.2.1.4',
    name: 'Seguro Patrimonial - Campo Grande',
    type: 'expense',
    parentId: 'exp-5.2.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.2.2',
    code: '5.2.2',
    name: 'Recreio',
    type: 'expense',
    parentId: 'exp-5.2',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.2.2.1',
    code: '5.2.2.1',
    name: 'Aluguel - Recreio',
    type: 'expense',
    parentId: 'exp-5.2.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.2.2.2',
    code: '5.2.2.2',
    name: 'Condomínio - Recreio',
    type: 'expense',
    parentId: 'exp-5.2.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.2.2.3',
    code: '5.2.2.3',
    name: 'IPTU - Recreio',
    type: 'expense',
    parentId: 'exp-5.2.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.2.2.4',
    code: '5.2.2.4',
    name: 'Seguro Patrimonial - Recreio',
    type: 'expense',
    parentId: 'exp-5.2.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.2.3',
    code: '5.2.3',
    name: 'Barra',
    type: 'expense',
    parentId: 'exp-5.2',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.2.3.1',
    code: '5.2.3.1',
    name: 'Aluguel - Barra',
    type: 'expense',
    parentId: 'exp-5.2.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.2.3.2',
    code: '5.2.3.2',
    name: 'Condomínio - Barra',
    type: 'expense',
    parentId: 'exp-5.2.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.2.3.3',
    code: '5.2.3.3',
    name: 'IPTU - Barra',
    type: 'expense',
    parentId: 'exp-5.2.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.2.3.4',
    code: '5.2.3.4',
    name: 'Seguro Patrimonial - Barra',
    type: 'expense',
    parentId: 'exp-5.2.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 5.3 - UTILITIES (SERVIÇOS BÁSICOS)
  {
    id: 'exp-5.3',
    code: '5.3',
    name: 'Utilities (Serviços Básicos)',
    type: 'expense',
    parentId: 'exp-5',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.3.1',
    code: '5.3.1',
    name: 'Energia Elétrica',
    type: 'expense',
    parentId: 'exp-5.3',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.3.1.1',
    code: '5.3.1.1',
    name: 'Energia - Campo Grande',
    type: 'expense',
    parentId: 'exp-5.3.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.3.1.2',
    code: '5.3.1.2',
    name: 'Energia - Recreio',
    type: 'expense',
    parentId: 'exp-5.3.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.3.1.3',
    code: '5.3.1.3',
    name: 'Energia - Barra',
    type: 'expense',
    parentId: 'exp-5.3.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.3.2',
    code: '5.3.2',
    name: 'Água e Esgoto',
    type: 'expense',
    parentId: 'exp-5.3',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.3.2.1',
    code: '5.3.2.1',
    name: 'Água - Campo Grande',
    type: 'expense',
    parentId: 'exp-5.3.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.3.2.2',
    code: '5.3.2.2',
    name: 'Água - Recreio',
    type: 'expense',
    parentId: 'exp-5.3.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.3.2.3',
    code: '5.3.2.3',
    name: 'Água - Barra',
    type: 'expense',
    parentId: 'exp-5.3.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.3.3',
    code: '5.3.3',
    name: 'Telefone e Internet',
    type: 'expense',
    parentId: 'exp-5.3',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.3.3.1',
    code: '5.3.3.1',
    name: 'Internet - Campo Grande',
    type: 'expense',
    parentId: 'exp-5.3.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.3.3.2',
    code: '5.3.3.2',
    name: 'Internet - Recreio',
    type: 'expense',
    parentId: 'exp-5.3.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.3.3.3',
    code: '5.3.3.3',
    name: 'Internet - Barra',
    type: 'expense',
    parentId: 'exp-5.3.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.3.3.4',
    code: '5.3.3.4',
    name: 'Telefone Fixo',
    type: 'expense',
    parentId: 'exp-5.3.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.3.3.5',
    code: '5.3.3.5',
    name: 'Celular Corporativo',
    type: 'expense',
    parentId: 'exp-5.3.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 5.4 - TECNOLOGIA E SOFTWARE
  {
    id: 'exp-5.4',
    code: '5.4',
    name: 'Tecnologia e Software',
    type: 'expense',
    parentId: 'exp-5',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.4.1',
    code: '5.4.1',
    name: 'Licenças de Software',
    type: 'expense',
    parentId: 'exp-5.4',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.4.1.1',
    code: '5.4.1.1',
    name: 'Sistema de Gestão Escolar',
    type: 'expense',
    parentId: 'exp-5.4.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.4.1.2',
    code: '5.4.1.2',
    name: 'Office 365',
    type: 'expense',
    parentId: 'exp-5.4.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.4.1.3',
    code: '5.4.1.3',
    name: 'Software de Contabilidade',
    type: 'expense',
    parentId: 'exp-5.4.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.4.1.4',
    code: '5.4.1.4',
    name: 'Antivírus',
    type: 'expense',
    parentId: 'exp-5.4.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.4.2',
    code: '5.4.2',
    name: 'Suporte Técnico',
    type: 'expense',
    parentId: 'exp-5.4',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.4.2.1',
    code: '5.4.2.1',
    name: 'Suporte de TI',
    type: 'expense',
    parentId: 'exp-5.4.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.4.2.2',
    code: '5.4.2.2',
    name: 'Manutenção de Equipamentos',
    type: 'expense',
    parentId: 'exp-5.4.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.4.3',
    code: '5.4.3',
    name: 'Hospedagem e Domínios',
    type: 'expense',
    parentId: 'exp-5.4',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.4.3.1',
    code: '5.4.3.1',
    name: 'Hospedagem de Site',
    type: 'expense',
    parentId: 'exp-5.4.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.4.3.2',
    code: '5.4.3.2',
    name: 'Registro de Domínio',
    type: 'expense',
    parentId: 'exp-5.4.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 5.5 - SERVIÇOS TERCEIRIZADOS
  {
    id: 'exp-5.5',
    code: '5.5',
    name: 'Serviços Terceirizados',
    type: 'expense',
    parentId: 'exp-5',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.5.1',
    code: '5.5.1',
    name: 'Serviços Contábeis',
    type: 'expense',
    parentId: 'exp-5.5',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.5.2',
    code: '5.5.2',
    name: 'Consultoria Jurídica',
    type: 'expense',
    parentId: 'exp-5.5',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.5.3',
    code: '5.5.3',
    name: 'Limpeza e Conservação',
    type: 'expense',
    parentId: 'exp-5.5',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.5.4',
    code: '5.5.4',
    name: 'Segurança',
    type: 'expense',
    parentId: 'exp-5.5',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.5.5',
    code: '5.5.5',
    name: 'Marketing e Publicidade',
    type: 'expense',
    parentId: 'exp-5.5',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.5.5.1',
    code: '5.5.5.1',
    name: 'Agência de Marketing',
    type: 'expense',
    parentId: 'exp-5.5.5',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.5.5.2',
    code: '5.5.5.2',
    name: 'Designer Gráfico',
    type: 'expense',
    parentId: 'exp-5.5.5',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.5.5.3',
    code: '5.5.5.3',
    name: 'Fotógrafo/Videomaker',
    type: 'expense',
    parentId: 'exp-5.5.5',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 5.6 - SEGUROS E TAXAS
  {
    id: 'exp-5.6',
    code: '5.6',
    name: 'Seguros e Taxas',
    type: 'expense',
    parentId: 'exp-5',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.6.1',
    code: '5.6.1',
    name: 'Seguros',
    type: 'expense',
    parentId: 'exp-5.6',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.6.1.1',
    code: '5.6.1.1',
    name: 'Seguro Patrimonial',
    type: 'expense',
    parentId: 'exp-5.6.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.6.1.2',
    code: '5.6.1.2',
    name: 'Seguro de Responsabilidade Civil',
    type: 'expense',
    parentId: 'exp-5.6.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.6.1.3',
    code: '5.6.1.3',
    name: 'Seguro de Equipamentos',
    type: 'expense',
    parentId: 'exp-5.6.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.6.2',
    code: '5.6.2',
    name: 'Taxas e Licenças',
    type: 'expense',
    parentId: 'exp-5.6',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.6.2.1',
    code: '5.6.2.1',
    name: 'Alvará de Funcionamento',
    type: 'expense',
    parentId: 'exp-5.6.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.6.2.2',
    code: '5.6.2.2',
    name: 'Licenças Ambientais',
    type: 'expense',
    parentId: 'exp-5.6.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-5.6.2.3',
    code: '5.6.2.3',
    name: 'Taxa de Funcionamento',
    type: 'expense',
    parentId: 'exp-5.6.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // RENUMBERED EXISTING EXPENSES: 6.1 - DESPESAS OPERACIONAIS (formerly 5.1)
  {
    id: 'exp-6.1',
    code: '6.1',
    name: 'Despesas Operacionais',
    type: 'expense',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 6.1.1 - Custos Diretos de Ensino (formerly 5.1.1)
  {
    id: 'exp-6.1.1',
    code: '6.1.1',
    name: 'Custos Diretos de Ensino',
    type: 'expense',
    parentId: 'exp-6.1',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.1.1',
    code: '6.1.1.1',
    name: 'Folha de Pagamento - Professores',
    type: 'expense',
    parentId: 'exp-6.1.1',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.1.1.1',
    code: '6.1.1.1.1',
    name: 'Salários - Professores',
    type: 'expense',
    parentId: 'exp-6.1.1.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.1.1.2',
    code: '6.1.1.1.2',
    name: 'Encargos Sociais - Professores',
    type: 'expense',
    parentId: 'exp-6.1.1.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.1.1.3',
    code: '6.1.1.1.3',
    name: 'FGTS - Professores',
    type: 'expense',
    parentId: 'exp-6.1.1.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.1.2',
    code: '6.1.1.2',
    name: 'Material de Ensino',
    type: 'expense',
    parentId: 'exp-6.1.1',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.1.2.1',
    code: '6.1.1.2.1',
    name: 'Instrumentos Musicais',
    type: 'expense',
    parentId: 'exp-6.1.1.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.1.2.2',
    code: '6.1.1.2.2',
    name: 'Partituras e Métodos',
    type: 'expense',
    parentId: 'exp-6.1.1.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.1.3',
    code: '6.1.1.3',
    name: 'Aulas Terceirizadas',
    type: 'expense',
    parentId: 'exp-6.1.1',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.1.3.1',
    code: '6.1.1.3.1',
    name: 'Professores Freelance',
    type: 'expense',
    parentId: 'exp-6.1.1.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 6.1.2 - Custos de Unidades (formerly 5.1.2)
  {
    id: 'exp-6.1.2',
    code: '6.1.2',
    name: 'Custos de Unidades',
    type: 'expense',
    parentId: 'exp-6.1',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.1',
    code: '6.1.2.1',
    name: 'Campo Grande',
    type: 'expense',
    parentId: 'exp-6.1.2',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.1.1',
    code: '6.1.2.1.1',
    name: 'Aluguel - Campo Grande',
    type: 'expense',
    parentId: 'exp-6.1.2.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.1.2',
    code: '6.1.2.1.2',
    name: 'Condomínio - Campo Grande',
    type: 'expense',
    parentId: 'exp-6.1.2.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.1.3',
    code: '6.1.2.1.3',
    name: 'Utilities - Campo Grande',
    type: 'expense',
    parentId: 'exp-6.1.2.1',
    isActive: true,
    level: 3,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.1.3.1',
    code: '6.1.2.1.3.1',
    name: 'Energia Elétrica - Campo Grande',
    type: 'expense',
    parentId: 'exp-6.1.2.1.3',
    isActive: true,
    level: 4,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.1.3.2',
    code: '6.1.2.1.3.2',
    name: 'Água - Campo Grande',
    type: 'expense',
    parentId: 'exp-6.1.2.1.3',
    isActive: true,
    level: 4,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.1.3.3',
    code: '6.1.2.1.3.3',
    name: 'Internet - Campo Grande',
    type: 'expense',
    parentId: 'exp-6.1.2.1.3',
    isActive: true,
    level: 4,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.2',
    code: '6.1.2.2',
    name: 'Recreio',
    type: 'expense',
    parentId: 'exp-6.1.2',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.2.1',
    code: '6.1.2.2.1',
    name: 'Aluguel - Recreio',
    type: 'expense',
    parentId: 'exp-6.1.2.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.2.2',
    code: '6.1.2.2.2',
    name: 'Condomínio - Recreio',
    type: 'expense',
    parentId: 'exp-6.1.2.2',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.2.3',
    code: '6.1.2.2.3',
    name: 'Utilities - Recreio',
    type: 'expense',
    parentId: 'exp-6.1.2.2',
    isActive: true,
    level: 3,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.2.3.1',
    code: '6.1.2.2.3.1',
    name: 'Energia Elétrica - Recreio',
    type: 'expense',
    parentId: 'exp-6.1.2.2.3',
    isActive: true,
    level: 4,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.2.3.2',
    code: '6.1.2.2.3.2',
    name: 'Água - Recreio',
    type: 'expense',
    parentId: 'exp-6.1.2.2.3',
    isActive: true,
    level: 4,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.2.3.3',
    code: '6.1.2.2.3.3',
    name: 'Internet - Recreio',
    type: 'expense',
    parentId: 'exp-6.1.2.2.3',
    isActive: true,
    level: 4,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.3',
    code: '6.1.2.3',
    name: 'Barra',
    type: 'expense',
    parentId: 'exp-6.1.2',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.3.1',
    code: '6.1.2.3.1',
    name: 'Aluguel - Barra',
    type: 'expense',
    parentId: 'exp-6.1.2.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.3.2',
    code: '6.1.2.3.2',
    name: 'Condomínio - Barra',
    type: 'expense',
    parentId: 'exp-6.1.2.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.3.3',
    code: '6.1.2.3.3',
    name: 'Utilities - Barra',
    type: 'expense',
    parentId: 'exp-6.1.2.3',
    isActive: true,
    level: 3,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.3.3.1',
    code: '6.1.2.3.3.1',
    name: 'Energia Elétrica - Barra',
    type: 'expense',
    parentId: 'exp-6.1.2.3.3',
    isActive: true,
    level: 4,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.3.3.2',
    code: '6.1.2.3.3.2',
    name: 'Água - Barra',
    type: 'expense',
    parentId: 'exp-6.1.2.3.3',
    isActive: true,
    level: 4,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.1.2.3.3.3',
    code: '6.1.2.3.3.3',
    name: 'Internet - Barra',
    type: 'expense',
    parentId: 'exp-6.1.2.3.3',
    isActive: true,
    level: 4,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 6.2 - DESPESAS ADMINISTRATIVAS (formerly 5.2)
  {
    id: 'exp-6.2',
    code: '6.2',
    name: 'Despesas Administrativas',
    type: 'expense',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 6.2.1 - Pessoal Administrativo (formerly 5.2.1)
  {
    id: 'exp-6.2.1',
    code: '6.2.1',
    name: 'Pessoal Administrativo',
    type: 'expense',
    parentId: 'exp-6.2',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.2.1.1',
    code: '6.2.1.1',
    name: 'Folha Administrativa',
    type: 'expense',
    parentId: 'exp-6.2.1',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.2.1.1.1',
    code: '6.2.1.1.1',
    name: 'Salário - Coordenação',
    type: 'expense',
    parentId: 'exp-6.2.1.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.2.1.1.2',
    code: '6.2.1.1.2',
    name: 'Salário - Secretaria',
    type: 'expense',
    parentId: 'exp-6.2.1.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.2.1.1.3',
    code: '6.2.1.1.3',
    name: 'Encargos Sociais - Administrativo',
    type: 'expense',
    parentId: 'exp-6.2.1.1',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 6.2.2 - Marketing e Comunicação (formerly 5.2.2)
  {
    id: 'exp-6.2.2',
    code: '6.2.2',
    name: 'Marketing e Comunicação',
    type: 'expense',
    parentId: 'exp-6.2',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.2.2.1',
    code: '6.2.2.1',
    name: 'Publicidade Online',
    type: 'expense',
    parentId: 'exp-6.2.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.2.2.2',
    code: '6.2.2.2',
    name: 'Material Gráfico',
    type: 'expense',
    parentId: 'exp-6.2.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.2.2.3',
    code: '6.2.2.3',
    name: 'Eventos e Apresentações',
    type: 'expense',
    parentId: 'exp-6.2.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 6.2.3 - Serviços Administrativos (formerly 5.2.3)
  {
    id: 'exp-6.2.3',
    code: '6.2.3',
    name: 'Serviços Administrativos',
    type: 'expense',
    parentId: 'exp-6.2',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.2.3.1',
    code: '6.2.3.1',
    name: 'Contabilidade',
    type: 'expense',
    parentId: 'exp-6.2.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.2.3.2',
    code: '6.2.3.2',
    name: 'Consultoria Jurídica',
    type: 'expense',
    parentId: 'exp-6.2.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.2.3.3',
    code: '6.2.3.3',
    name: 'Seguros',
    type: 'expense',
    parentId: 'exp-6.2.3',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 6.2.4 - Despesas Gerais (formerly 5.2.4)
  {
    id: 'exp-6.2.4',
    code: '6.2.4',
    name: 'Despesas Gerais',
    type: 'expense',
    parentId: 'exp-6.2',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.2.4.1',
    code: '6.2.4.1',
    name: 'Material de Escritório',
    type: 'expense',
    parentId: 'exp-6.2.4',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.2.4.2',
    code: '6.2.4.2',
    name: 'Limpeza e Conservação',
    type: 'expense',
    parentId: 'exp-6.2.4',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.2.4.3',
    code: '6.2.4.3',
    name: 'Tecnologia',
    type: 'expense',
    parentId: 'exp-6.2.4',
    isActive: true,
    level: 2,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.2.4.3.1',
    code: '6.2.4.3.1',
    name: 'Software e Licenças',
    type: 'expense',
    parentId: 'exp-6.2.4.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.2.4.3.2',
    code: '6.2.4.3.2',
    name: 'Manutenção de Equipamentos',
    type: 'expense',
    parentId: 'exp-6.2.4.3',
    isActive: true,
    level: 3,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // 6.3 - DESPESAS FINANCEIRAS (formerly 5.3)
  {
    id: 'exp-6.3',
    code: '6.3',
    name: 'Despesas Financeiras',
    type: 'expense',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.3.1',
    code: '6.3.1',
    name: 'Juros e Encargos',
    type: 'expense',
    parentId: 'exp-6.3',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.3.1.1',
    code: '6.3.1.1',
    name: 'Juros de Empréstimos',
    type: 'expense',
    parentId: 'exp-6.3.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.3.1.2',
    code: '6.3.1.2',
    name: 'Multas e Juros de Atraso',
    type: 'expense',
    parentId: 'exp-6.3.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.3.2',
    code: '6.3.2',
    name: 'Tarifas Bancárias',
    type: 'expense',
    parentId: 'exp-6.3',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.3.2.1',
    code: '6.3.2.1',
    name: 'Tarifas de Conta Corrente',
    type: 'expense',
    parentId: 'exp-6.3.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'exp-6.3.2.2',
    code: '6.3.2.2',
    name: 'Taxa de Cartão de Crédito',
    type: 'expense',
    parentId: 'exp-6.3.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ASSETS (INVESTIMENTOS) - Mantidos da estrutura original
  {
    id: 'inv-1',
    code: '1.1',
    name: 'Ativo Circulante',
    type: 'asset',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-1.1',
    code: '1.1.1',
    name: 'Caixa e Equivalentes',
    type: 'asset',
    parentId: 'inv-1',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-1.1.1',
    code: '1.1.1.1',
    name: 'Caixa',
    type: 'asset',
    parentId: 'inv-1.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-1.1.2',
    code: '1.1.1.2',
    name: 'Conta Corrente - Banco do Brasil',
    type: 'asset',
    parentId: 'inv-1.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-1.1.3',
    code: '1.1.1.3',
    name: 'Conta Corrente - Itaú',
    type: 'asset',
    parentId: 'inv-1.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-1.2',
    code: '1.1.2',
    name: 'Contas a Receber',
    type: 'asset',
    parentId: 'inv-1',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-1.2.1',
    code: '1.1.2.1',
    name: 'Mensalidades a Receber',
    type: 'asset',
    parentId: 'inv-1.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-1.2.2',
    code: '1.1.2.2',
    name: 'Matrículas a Receber',
    type: 'asset',
    parentId: 'inv-1.2',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-2',
    code: '1.2',
    name: 'Ativo Não Circulante',
    type: 'asset',
    isActive: true,
    level: 0,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-2.1',
    code: '1.2.1',
    name: 'Imobilizado',
    type: 'asset',
    parentId: 'inv-2',
    isActive: true,
    level: 1,
    hasChildren: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-2.1.1',
    code: '1.2.1.1',
    name: 'Instrumentos Musicais',
    type: 'asset',
    parentId: 'inv-2.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-2.1.2',
    code: '1.2.1.2',
    name: 'Equipamentos de Som',
    type: 'asset',
    parentId: 'inv-2.1',
    isActive: true,
    level: 2,
    hasChildren: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'inv-2.1.3',
    code: '1.2.1.3',
    name: 'Móveis e Utensílios',
    type: 'asset',
    parentId: 'inv-2.1',
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
