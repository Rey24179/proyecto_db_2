-- =========================
-- DDL COMPLETO
-- =========================

DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS salesRep CASCADE;
DROP TABLE IF EXISTS offices CASCADE;
DROP TABLE IF EXISTS products CASCADE;

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