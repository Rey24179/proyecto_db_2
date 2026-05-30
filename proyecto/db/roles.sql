-- =========================
-- ROLES
-- =========================

DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'admin_role') THEN
      CREATE ROLE admin_role;
   END IF;
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'sales_role') THEN
      CREATE ROLE sales_role;
   END IF;
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'inventory_role') THEN
      CREATE ROLE inventory_role;
   END IF;
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'report_role') THEN
      CREATE ROLE report_role;
   END IF;
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'readonly_role') THEN
      CREATE ROLE readonly_role;
   END IF;
END
$$;

GRANT ALL PRIVILEGES ON TABLE offices, salesRep, customers, products, orders, users TO admin_role;

GRANT SELECT, INSERT, UPDATE ON TABLE customers TO sales_role;
GRANT SELECT ON TABLE products TO sales_role;
GRANT SELECT, INSERT ON TABLE orders TO sales_role;

GRANT SELECT, INSERT, UPDATE ON TABLE products TO inventory_role;
GRANT SELECT ON TABLE orders TO inventory_role;

GRANT SELECT ON TABLE customers, products, orders, salesRep, offices TO report_role;

GRANT SELECT ON TABLE customers, products, orders TO readonly_role;