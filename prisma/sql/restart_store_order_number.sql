SELECT last_value FROM store_order_seq_clvwrkh6q0000mic410oc8597;
ALTER SEQUENCE store_order_seq_clvwrkh6q0000mic410oc8597 RESTART WITH 1;
SELECT nextval('store_order_seq_clvwrkh6q0000mic410oc8597');


DO $$
DECLARE
    store_id TEXT := 'clvwrkh6q0000mic410oc8597';
    sequence_name TEXT;
BEGIN
    sequence_name := format('store_order_seq_%s', store_id);
    EXECUTE format('ALTER SEQUENCE %I RESTART WITH 1', sequence_name);
END;
$$;


