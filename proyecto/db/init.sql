-- =========================
-- LIMPIEZA
-- =========================
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS salesRep CASCADE;
DROP TABLE IF EXISTS offices CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- =========================
-- TABLAS
-- =========================

CREATE TABLE offices (
    office INTEGER PRIMARY KEY,
    city VARCHAR(50) NOT NULL,
    region VARCHAR(50) NOT NULL,
    target NUMERIC(10,2) NOT NULL,
    sales NUMERIC(10,2) NOT NULL
);

CREATE TABLE salesRep (
    empl_num INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    age INTEGER NOT NULL,
    rep_office INTEGER NOT NULL,
    title VARCHAR(50) NOT NULL,
    hire_date DATE NOT NULL,
    manager INTEGER,
    quota NUMERIC(10,2) NOT NULL,
    sales NUMERIC(10,2) NOT NULL,
    CONSTRAINT fk_salesrep_office
        FOREIGN KEY (rep_office) REFERENCES offices(office),
    CONSTRAINT fk_salesrep_manager
        FOREIGN KEY (manager) REFERENCES salesRep(empl_num)
);

CREATE TABLE customers (
    cust_num INTEGER PRIMARY KEY,
    company VARCHAR(100) NOT NULL,
    cust_rep INTEGER NOT NULL,
    credit_limit NUMERIC(10,2) NOT NULL,
    CONSTRAINT fk_customers_salesrep
        FOREIGN KEY (cust_rep) REFERENCES salesRep(empl_num)
);

CREATE TABLE products (
    mfr_id CHAR(3) NOT NULL,
    product_id CHAR(5) NOT NULL,
    description VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    qty_on_hand INTEGER NOT NULL,
    CONSTRAINT pk_products PRIMARY KEY (mfr_id, product_id)
);

CREATE TABLE orders (
    order_num INTEGER PRIMARY KEY,
    order_date DATE NOT NULL,
    cust INTEGER NOT NULL,
    rep INTEGER NOT NULL,
    mfr CHAR(3) NOT NULL,
    product CHAR(5) NOT NULL,
    qty INTEGER NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    CONSTRAINT fk_orders_customer
        FOREIGN KEY (cust) REFERENCES customers(cust_num),
    CONSTRAINT fk_orders_salesrep
        FOREIGN KEY (rep) REFERENCES salesRep(empl_num),
    CONSTRAINT fk_orders_product
        FOREIGN KEY (mfr, product) REFERENCES products(mfr_id, product_id)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role_name VARCHAR(30) NOT NULL
);

-- =========================
-- INDICES
-- =========================

CREATE INDEX idx_salesrep_rep_office ON salesRep(rep_office);
CREATE INDEX idx_customers_cust_rep ON customers(cust_rep);
CREATE INDEX idx_orders_cust ON orders(cust);
CREATE INDEX idx_orders_rep ON orders(rep);
CREATE INDEX idx_orders_product ON orders(mfr, product);

-- =========================
-- VIEW
-- =========================

CREATE OR REPLACE VIEW vw_orders_by_customer AS
SELECT 
    c.company,
    COUNT(o.order_num) AS total_orders,
    COALESCE(SUM(o.amount), 0) AS total_amount
FROM customers c
LEFT JOIN orders o ON c.cust_num = o.cust
GROUP BY c.company;

-- =========================
-- DATOS DE PRUEBA
-- =========================

-- offices
INSERT INTO offices (office, city, region, target, sales) VALUES
(101,'Denver','Western',300000,186042),
(102,'New York','Eastern',575000,692637),
(103,'Chicago','Eastern',800000,735042),
(104,'Atlanta','Eastern',350000,367911),
(105,'Los Angeles','Western',725000,835915);

-- salesRep
INSERT INTO salesRep (empl_num, name, age, rep_office, title, hire_date, manager, quota, sales) VALUES
(102,'Sue Smith',48,101,'Sales Rep','1986-12-10',NULL,350000,464000),
(104,'Bill Adams',37,102,'Sales Rep','1988-02-12',102,350000,367911),
(105,'Mary Jones',31,103,'Sales Rep','1989-10-12',102,300000,392725),
(106,'Sam Clark',52,104,'VP Sales','1988-06-14',NULL,275000,299000),
(108,'Tom Brown',45,105,'Sales Rep','1990-03-01',106,280000,310000);

-- customers
INSERT INTO customers (cust_num, company, cust_rep, credit_limit) VALUES
(2101,'JCP Inc.',102,50000),
(2102,'First Corp.',104,65000),
(2103,'Acme Mfg.',105,50000),
(2104,'Carter & Sons',102,40000),
(2105,'Ace International',108,35000),
(2106,'Smithson Corp.',104,20000),
(2107,'Jones Mfg.',106,65000);

-- products
INSERT INTO products (mfr_id, product_id, description, price, qty_on_hand) VALUES
('REI','2A44L','Ratchet Link',79,210),
('ACI','41003','Widget Remover',2750,25),
('FEA','00114','Reducer',355,38),
('QSA','K47A1','Plate',180,20),
('ACI','41004','900-lb Brace',1875,9),
('ACI','4100Z','Size 3 Widget',107,207),
('REI','2A44R','Size 4 Widget',117,139);

-- orders
INSERT INTO orders (order_num, order_date, cust, rep, mfr, product, qty, amount) VALUES
(112961,'2026-01-17',2101,102,'REI','2A44L',7,553),
(112962,'2026-01-18',2102,104,'ACI','41003',2,5500),
(112978,'2026-01-20',2103,105,'FEA','00114',6,2130),
(113961,'2026-01-21',2104,102,'QSA','K47A1',4,720),
(114961,'2026-01-22',2105,108,'ACI','41004',3,5625),
(115161,'2026-01-23',2106,104,'ACI','4100Z',9,963),
(111963,'2026-01-24',2107,106,'REI','2A44R',10,1170);

-- users
INSERT INTO users (username, password, role_name) VALUES
('admin1', 'admin123', 'admin_role'),
('sales1', 'sales123', 'sales_role'),
('inventory1', 'inventory123', 'inventory_role'),
('report1', 'report123', 'report_role'),
('readonly1', 'readonly123', 'readonly_role');