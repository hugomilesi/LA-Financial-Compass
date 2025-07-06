-- Insert sample data into units table
INSERT INTO units (id, name, slug, description, address, city, state, zip_code, country, phone, email, website, is_active) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Main Campus', 'main-campus', 'Primary educational facility', '123 University Ave', 'Anytown', 'CA', '90210', 'USA', '555-123-4567', 'info@maincampus.edu', 'http://www.maincampus.edu', TRUE),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Downtown Branch', 'downtown-branch', 'Satellite campus in the city center', '456 City Blvd', 'Anytown', 'CA', '90210', 'USA', '555-987-6543', 'info@downtownbranch.edu', 'http://www.downtownbranch.edu', TRUE);

-- Insert sample data into periods table
INSERT INTO periods (id, name, start_date, end_date, type, is_current) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'July 2024', '2024-07-01', '2024-07-31', 'month', TRUE),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Q3 2024', '2024-07-01', '2024-09-30', 'quarter', FALSE);

-- Insert sample data into kpis table
INSERT INTO kpis (name, description, icon, color, unit_type) VALUES
('Alunos Ativos', 'Number of active students', 'users', '#4CAF50', 'number'),
('Receita Total', 'Total revenue generated', 'dollar-sign', '#2196F3', 'currency'),
('Despesa Total', 'Total expenses incurred', 'dollar-sign', '#FF5722', 'currency'),
('Geração de Caixa', 'Cash generated from operations', 'dollar-sign', '#4CAF50', 'currency'),
('Margem Líquida', 'Net profit margin percentage', 'percent', '#9C27B0', 'percentage'),
('Ticket Médio', 'Average revenue per student', 'dollar-sign', '#FFC107', 'currency'),
('Custo por Aluno', 'Average cost per student', 'dollar-sign', '#FFC107', 'currency'),
('Inadimplência (%)', 'Percentage of overdue payments', 'percent', '#F44336', 'percentage');

-- Insert sample data into kpis_data table
INSERT INTO kpis_data (kpi_name, unit_id, date_ref, value) VALUES
('Alunos Ativos', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-07-01', 1500),
('Alunos Ativos', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '2024-07-01', 800),
('Receita Total', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-07-01', 150000.00),
('Receita Total', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '2024-07-01', 75000.00),
('Despesa Total', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-07-01', 100000.00),
('Despesa Total', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '2024-07-01', 50000.00),
('Geração de Caixa', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-07-01', 50000.00),
('Geração de Caixa', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '2024-07-01', 25000.00),
('Margem Líquida', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-07-01', 0.25),
('Margem Líquida', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '2024-07-01', 0.18),
('Ticket Médio', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-07-01', 100.00),
('Ticket Médio', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '2024-07-01', 90.00),
('Custo por Aluno', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-07-01', 50.00),
('Custo por Aluno', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '2024-07-01', 60.00),
('Inadimplência (%)', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-07-01', 0.05),
('Inadimplência (%)', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '2024-07-01', 0.08);

-- Insert sample data into accounts table
INSERT INTO accounts (id, code, name, description, type, parent_id, is_active, level, has_children) VALUES
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', '1000', 'Receitas', 'Contas de Receita', 'revenue', NULL, TRUE, 1, TRUE),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', '1010', 'Mensalidades', 'Receita de mensalidades', 'revenue', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', TRUE, 2, FALSE),
('g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', '2000', 'Despesas', 'Contas de Despesa', 'expense', NULL, TRUE, 1, TRUE),
('h0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', '2010', 'Salários', 'Despesas com salários', 'expense', 'g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', TRUE, 2, FALSE);

-- Insert sample data into cost_center_categories table
INSERT INTO cost_center_categories (id, name, description, type, color, icon, is_active) VALUES
('i0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'Marketing', 'Despesas de Marketing', 'expense', '#FF5722', 'megaphone', TRUE),
('j0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'Vendas', 'Receitas de Vendas', 'income', '#8BC34A', 'shopping-cart', TRUE);

-- Insert sample data into external_integrations table
INSERT INTO external_integrations (id, name, type, status, last_sync, description, icon, configurable) VALUES
('k0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'ERP System', 'ERP', 'connected', '2024-07-04 10:00:00+00', 'Integration with main ERP', 'server', TRUE),
('l0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'CRM Platform', 'CRM', 'disconnected', NULL, 'Integration with CRM for customer data', 'users', TRUE);

-- Insert sample data into webhooks table
INSERT INTO webhooks (id, name, url, method, status, events, last_triggered, retry_count, description) VALUES
('m0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'New Student Alert', 'https://example.com/webhook/new-student', 'POST', 'active', ARRAY['student.created'], NULL, 0, 'Alerts external system on new student enrollment');

-- Insert sample data into credentials table
INSERT INTO credentials (id, name, type, service, status, expires_at, last_used, description, masked) VALUES
('n0eebc99-9c0b-4ef8-bb6d-6bb9bd380a24', 'ERP API Key', 'API_KEY', 'ERP System', 'valid', '2025-07-04 00:00:00+00', '2024-07-04 10:00:00+00', 'API Key for ERP integration', TRUE);

-- Insert sample data into sync_configurations table
INSERT INTO sync_configurations (id, name, source, target, frequency, status, last_run, next_run, records_processed, description) VALUES
('o0eebc99-9c0b-4ef8-bb6d-6bb9bd380a25', 'Student Data Sync', 'ERP System', 'Local DB', 'daily', 'active', '2024-07-03 23:00:00+00', '2024-07-04 23:00:00+00', 1000, 'Synchronizes student data from ERP to local database');

-- Insert sample data into system_parameters table
INSERT INTO system_parameters (id, category, key, value, type, description, editable, sensitive, last_modified, modified_by) VALUES
('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a26', 'General', 'APP_NAME', 'LA Financial Compass', 'string', 'Name of the application', TRUE, FALSE, '2024-07-04 11:00:00+00', NULL),
('q0eebc99-9c0b-4ef8-bb6d-6bb9bd380a27', 'Performance', 'MAX_CONCURRENT_USERS', '500', 'number', 'Maximum number of concurrent users allowed', TRUE, FALSE, '2024-07-04 11:00:00+00', NULL);

-- Insert sample data into unit_alerts table
INSERT INTO unit_alerts (id, unit_id, type, category, title, description, severity, created_at) VALUES
('r0eebc99-9c0b-4ef8-bb6d-6bb9bd380a28', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'warning', 'financial', 'Revenue Below Target', 'Current month revenue is 10% below target.', 'medium', '2024-07-04 12:00:00+00'),
('s0eebc99-9c0b-4ef8-bb6d-6bb9bd380a29', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'info', 'operational', 'New Student Enrollment', '50 new students enrolled this week.', 'low', '2024-07-03 15:00:00+00');
