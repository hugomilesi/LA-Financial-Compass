CREATE OR REPLACE FUNCTION get_latest_kpi_data_for_unit(p_unit_id TEXT, p_date_ref DATE)
RETURNS TABLE(kpi_name TEXT, value NUMERIC, date_ref DATE) AS $$
BEGIN
    RETURN QUERY
    WITH latest_kpis AS (
        SELECT 
            kd.kpi_name,
            MAX(kd.date_ref) as max_date
        FROM kpis_data kd
        WHERE (p_unit_id IS NULL OR kd.unit_id = p_unit_id)
          AND kd.date_ref <= p_date_ref
        GROUP BY kd.kpi_name
    )
    SELECT 
        kd.kpi_name,
        kd.value,
        kd.date_ref
    FROM kpis_data kd
    JOIN latest_kpis lk ON kd.kpi_name = lk.kpi_name AND kd.date_ref = lk.max_date
    WHERE (p_unit_id IS NULL OR kd.unit_id = p_unit_id)
      AND kd.date_ref <= p_date_ref;
END;
$$ LANGUAGE plpgsql;