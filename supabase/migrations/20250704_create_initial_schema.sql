-- Create units table
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create periods table
CREATE TABLE periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('month', 'quarter', 'year', 'custom')),
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kpis table (lookup for KPI definitions)
CREATE TABLE kpis (
    name TEXT PRIMARY KEY NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    unit_type TEXT CHECK (unit_type IN ('currency', 'percentage', 'number')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kpis_data table (actual KPI values)
CREATE TABLE kpis_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kpi_name TEXT NOT NULL REFERENCES kpis(name) ON UPDATE CASCADE ON DELETE RESTRICT,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    date_ref DATE NOT NULL,
    value NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (kpi_name, unit_id, date_ref)
);

-- Create kpi_goals table
CREATE TABLE kpi_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    kpi_name TEXT NOT NULL REFERENCES kpis(name) ON UPDATE CASCADE ON DELETE RESTRICT,
    goal_value NUMERIC NOT NULL,
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE, -- NULL for global goals
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (kpi_name, unit_id, user_id)
);

-- Create accounts table (Chart of Accounts)
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('revenue', 'expense', 'liability', 'equity')),
    parent_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    level INTEGER NOT NULL,
    has_children BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cost_center_categories table
CREATE TABLE cost_center_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    color TEXT,
    icon TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cost_center_category_accounts linking table
CREATE TABLE cost_center_category_accounts (
    cost_center_category_id UUID NOT NULL REFERENCES cost_center_categories(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    PRIMARY KEY (cost_center_category_id, account_id)
);

-- Create dre_templates table
CREATE TABLE dre_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dre_line_items table
CREATE TABLE dre_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES dre_templates(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('revenue', 'expense', 'subtotal', 'total')),
    level INTEGER NOT NULL,
    parent_id UUID REFERENCES dre_line_items(id) ON DELETE SET NULL,
    formula TEXT,
    is_calculated BOOLEAN NOT NULL DEFAULT FALSE,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    "order" INTEGER NOT NULL, -- "order" is a reserved keyword, so quote it
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dre_line_item_accounts linking table
CREATE TABLE dre_line_item_accounts (
    dre_line_item_id UUID NOT NULL REFERENCES dre_line_items(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    PRIMARY KEY (dre_line_item_id, account_id)
);

-- Create dre_line_item_cost_centers linking table
CREATE TABLE dre_line_item_cost_centers (
    dre_line_item_id UUID NOT NULL REFERENCES dre_line_items(id) ON DELETE CASCADE,
    cost_center_category_id UUID NOT NULL REFERENCES cost_center_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (dre_line_item_id, cost_center_category_id)
);

-- Create external_integrations table
CREATE TABLE external_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('ERP', 'CRM', 'Payment', 'Analytics', 'Email', 'Other')),
    status TEXT NOT NULL CHECK (status IN ('connected', 'disconnected', 'error')),
    last_sync TIMESTAMP WITH TIME ZONE,
    description TEXT,
    icon TEXT,
    configurable BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create webhooks table
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    method TEXT NOT NULL CHECK (method IN ('POST', 'GET', 'PUT', 'DELETE')),
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'error')),
    events TEXT[] NOT NULL,
    last_triggered TIMESTAMP WITH TIME ZONE,
    retry_count INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create credentials table
CREATE TABLE credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('API_KEY', 'TOKEN', 'OAUTH', 'DATABASE', 'CERTIFICATE')),
    service TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('valid', 'expired', 'invalid')),
    expires_at TIMESTAMP WITH TIME ZONE,
    last_used TIMESTAMP WITH TIME ZONE,
    description TEXT,
    masked BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sync_configurations table
CREATE TABLE sync_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    source TEXT NOT NULL,
    target TEXT NOT NULL,
    frequency TEXT NOT NULL CHECK (frequency IN ('realtime', 'hourly', 'daily', 'weekly', 'monthly')),
    status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'error')),
    last_run TIMESTAMP WITH TIME ZONE,
    next_run TIMESTAMP WITH TIME ZONE,
    records_processed INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create integration_logs table
CREATE TABLE integration_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    level TEXT NOT NULL CHECK (level IN ('info', 'warning', 'error', 'success')),
    service TEXT NOT NULL,
    operation TEXT NOT NULL,
    message TEXT NOT NULL,
    duration NUMERIC,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create system_parameters table
CREATE TABLE system_parameters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    editable BOOLEAN NOT NULL DEFAULT TRUE,
    sensitive BOOLEAN NOT NULL DEFAULT FALSE,
    last_modified TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    modified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unit_alerts table
CREATE TABLE unit_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('warning', 'danger', 'info', 'success')),
    category TEXT NOT NULL CHECK (category IN ('financial', 'operational', 'strategic')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update the get_latest_kpi_data_for_unit function (already modified in previous step)
CREATE OR REPLACE FUNCTION get_latest_kpi_data_for_unit(p_unit_id TEXT, p_date_ref DATE)
RETURNS TABLE(kpi_name TEXT, value NUMERIC, date_ref DATE) AS $$
BEGIN
    RETURN QUERY
    WITH latest_kpis AS (
        SELECT
            kd.kpi_name,
            MAX(kd.date_ref) as max_date
        FROM kpis_data kd
        WHERE (p_unit_id IS NULL OR kd.unit_id = p_unit_id::UUID) -- Cast p_unit_id to UUID
          AND kd.date_ref <= p_date_ref
        GROUP BY kd.kpi_name
    )
    SELECT
        kd.kpi_name,
        kd.value,
        kd.date_ref
    FROM kpis_data kd
    JOIN latest_kpis lk ON kd.kpi_name = lk.kpi_name AND kd.date_ref = lk.max_date
    WHERE (p_unit_id IS NULL OR kd.unit_id = p_unit_id::UUID) -- Cast p_unit_id to UUID
      AND kd.date_ref <= p_date_ref;
END;
$$ LANGUAGE plpgsql;