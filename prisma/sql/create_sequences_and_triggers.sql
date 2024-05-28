-- Crear función para crear secuencias para cada tienda
CREATE OR REPLACE FUNCTION create_store_sequence()
RETURNS TRIGGER AS $$
BEGIN
  EXECUTE format('CREATE SEQUENCE IF NOT EXISTS store_order_seq_%s', NEW."id");
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para crear secuencias al insertar una tienda
CREATE TRIGGER create_store_sequence_trigger
AFTER INSERT ON "Store"
FOR EACH ROW
EXECUTE FUNCTION create_store_sequence();

-- Crear función para asignar número de pedido autoincremental por tienda
CREATE OR REPLACE FUNCTION set_store_order_number()
RETURNS TRIGGER AS $$
DECLARE
  nextval bigint;
BEGIN
  EXECUTE format('SELECT nextval(''store_order_seq_%s'')', NEW."storeId") INTO nextval;
  NEW."storeOrderNumber" = nextval;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para asignar número de pedido al insertar una orden
CREATE TRIGGER set_store_order_number_trigger
BEFORE INSERT ON "Order"
FOR EACH ROW
EXECUTE FUNCTION set_store_order_number();
