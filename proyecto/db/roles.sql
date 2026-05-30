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

-- =========================
-- PERMISOS ADMIN
-- =========================
GRANT ALL PRIVILEGES ON TABLE offices TO admin_role;
GRANT ALL PRIVILEGES ON TABLE salesRep TO admin_role;
GRANT ALL PRIVILEGES ON TABLE customers TO admin_role;
GRANT ALL PRIVILEGES ON TABLE products TO admin_role;
GRANT ALL PRIVILEGES ON TABLE orders TO admin_role;
GRANT ALL PRIVILEGES ON TABLE users TO admin_role;

-- =========================
-- PERMISOS SALES
-- =========================
GRANT SELECT, INSERT, UPDATE ON TABLE customers TO sales_role;
GRANT SELECT ON TABLE products TO sales_role;
GRANT SELECT, INSERT ON TABLE orders TO sales_role;
GRANT SELECT ON TABLE salesRep TO sales_role;

-- =========================
-- PERMISOS INVENTORY
-- =========================
GRANT SELECT, INSERT, UPDATE ON TABLE products TO inventory_role;
GRANT SELECT ON TABLE orders TO inventory_role;

-- =========================
-- PERMISOS REPORT
-- =========================
GRANT SELECT ON TABLE offices TO report_role;
GRANT SELECT ON TABLE salesRep TO report_role;
GRANT SELECT ON TABLE customers TO report_role;
GRANT SELECT ON TABLE products TO report_role;
GRANT SELECT ON TABLE orders TO report_role;

-- =========================
-- PERMISOS READONLY
-- =========================
GRANT SELECT ON TABLE customers TO readonly_role;
GRANT SELECT ON TABLE products TO readonly_role;
GRANT SELECT ON TABLE orders TO readonly_role;

-- =========================
-- VIEW
-- =========================
GRANT SELECT ON vw_orders_by_customer TO admin_role;
GRANT SELECT ON vw_orders_by_customer TO report_role;
GRANT SELECT ON vw_orders_by_customer TO readonly_role;