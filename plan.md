# Plano: Projeto Lovable com Supabase

## Notes
- O projeto deve ser criado do zero na plataforma Lovable, com integração total ao Supabase.
- Antes de criar o schema, é obrigatório deletar todas as tabelas e dados existentes no Supabase informado.
- O schema deve conter 13 tabelas principais, conforme detalhamento do usuário, com amostras realistas de dados (5-10 linhas por tabela, respeitando relacionamentos).
- É necessário criar todas as relações de FK e configurar RLS permitindo SELECT para usuários autenticados, e INSERT/UPDATE/DELETE para tabelas específicas.
- O frontend deve consumir exclusivamente os dados do Supabase, sem uso de dados mockados ou APIs antigas (ex: NocoDB).
- CRUD completo para "Metas" e "Plano de Contas".
- Implementar loading states e tratamento de erros para todas as chamadas Supabase.
- Fornecer URL do deploy Lovable, confirmar reset/população do banco e integração total.
- A análise dos requisitos/dados será feita a partir da leitura do código-fonte do frontend, conforme orientação do usuário (auto-análise, sem detalhamento manual).
- As entidades/tabelas "Jornada Kanban" e "Pesquisas e Feedbacks" NÃO fazem parte do escopo do projeto, conforme alinhamento com o usuário.

## Task List
- [x] Analisar estrutura do Supabase e frontend atual
- [x] Resetar banco Supabase (deletar todas as tabelas e dados)
- [x] Criar novo schema conforme especificação (13 tabelas, FKs, RLS)
- [x] Popular banco com dados de amostra realistas
- [x] Configurar RLS para SELECT e CRUD em tabelas específicas
- [x] Analisar entidades/dados necessários a partir do código do frontend
- [x] Propor/refinar schema Supabase conforme entidades encontradas
- [x] Analisar hooks/metas e plano de contas no frontend
- [x] Refatorar hooks para consumir dados do Supabase
- [x] Refatorar hook do Plano de Contas para Supabase
- [x] Configurar client Supabase no frontend
- [x] Refatorar componentes React para consumir dados do Supabase
  - [x] Revisar ChartOfAccountsPage e ChartOfAccountsContent para garantir uso exclusivo do hook/Supabase, sem mocks ou APIs antigas
  - [x] Garantir loading/erro visual conectado ao hook
  - [x] Remover qualquer referência residual a dados mockados ou localStorage
  - [x] Revisar AccountTreeItem, AccountForm, AccountTypeSection, ChartOfAccountsFilters e CostCenterDetailsModal para garantir uso exclusivo do hook/Supabase, sem mocks ou APIs antigas
  - [x] Validar integração CRUD em cada componente
- [ ] Implementar CRUD para Metas e Plano de Contas
- [ ] Implementar loading states e tratamento de erros
- [ ] Testar integração end-to-end (dados dinâmicos, CRUD)
- [ ] Realizar deploy do projeto e fornecer URL
- [ ] Validar requisitos finais com o usuário

## Current Goal
Testar integração end-to-end (dados dinâmicos, CRUD)