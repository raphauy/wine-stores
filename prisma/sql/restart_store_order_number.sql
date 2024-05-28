DO $$
DECLARE
    store_id TEXT := 'clv10m49u000387ust8w8u86j';
    sequence_name TEXT;
BEGIN
    sequence_name := format('store_order_seq_%s', store_id);
    EXECUTE format('ALTER SEQUENCE %I RESTART WITH 1', sequence_name);
END;
$$;
