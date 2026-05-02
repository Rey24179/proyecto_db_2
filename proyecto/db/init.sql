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

CREATE OR REPLACE VIEW vw_orders_by_customer AS
SELECT 
    c.company,
    COUNT(o.order_num) AS total_orders,
    COALESCE(SUM(o.amount), 0) AS total_amount
FROM customers c
LEFT JOIN orders o ON c.cust_num = o.cust
GROUP BY c.company;


CREATE INDEX idx_salesrep_rep_office
ON salesRep(rep_office);

CREATE INDEX idx_customers_cust_rep
ON customers(cust_rep);

CREATE INDEX idx_orders_cust
ON orders(cust);

CREATE INDEX idx_orders_rep
ON orders(rep);

CREATE INDEX idx_orders_product
ON orders(mfr, product);



-- =========================
-- DATOS DE PRUEBA
-- 25 REGISTROS POR TABLA
-- =========================

-- OFFICES (25)
INSERT INTO offices (office, city, region, target, sales) VALUES
(101,'Denver','Western',300000,186042),
(102,'New York','Eastern',575000,692637),
(103,'Chicago','Eastern',800000,735042),
(104,'Atlanta','Eastern',350000,367911),
(105,'Los Angeles','Western',725000,835915),
(106,'Houston','Southern',420000,398200),
(107,'Phoenix','Western',390000,355100),
(108,'Seattle','Western',510000,489340),
(109,'Boston','Eastern',460000,440210),
(110,'Miami','Southern',375000,360455),
(111,'Dallas','Southern',415000,401300),
(112,'San Francisco','Western',880000,910250),
(113,'Philadelphia','Eastern',430000,421780),
(114,'Detroit','Central',395000,388640),
(115,'Minneapolis','Central',410000,399120),
(116,'Las Vegas','Western',365000,342500),
(117,'Portland','Western',385000,371900),
(118,'Charlotte','Eastern',405000,396450),
(119,'Orlando','Southern',355000,348700),
(120,'San Diego','Western',500000,492300),
(121,'Austin','Southern',470000,458950),
(122,'Cleveland','Central',340000,329875),
(123,'Nashville','Southern',360000,351420),
(124,'Kansas City','Central',345000,338615),
(125,'Baltimore','Eastern',390000,382140);

-- SALESREP (25)
INSERT INTO salesRep (empl_num, name, age, rep_office, title, hire_date, manager, quota, sales) VALUES
(201,'Sue Smith',48,101,'Sales Rep','2018-01-10',NULL,350000,464000),
(202,'Bill Adams',37,102,'Sales Rep','2019-02-12',201,350000,367911),
(203,'Mary Jones',31,103,'Sales Rep','2020-10-12',201,300000,392725),
(204,'Sam Clark',52,104,'Regional Manager','2017-06-14',NULL,450000,499000),
(205,'Tom Brown',45,105,'Sales Rep','2021-03-01',204,280000,310000),
(206,'Linda Green',39,106,'Sales Rep','2019-07-21',204,290000,301450),
(207,'Carlos Diaz',34,107,'Sales Rep','2022-01-15',204,275000,268900),
(208,'Ana Lopez',41,108,'Sales Rep','2018-11-03',201,320000,330700),
(209,'Peter White',44,109,'Sales Rep','2019-09-18',201,310000,305600),
(210,'Nina Patel',36,110,'Sales Rep','2020-04-09',204,295000,287300),
(211,'Jose Ramirez',40,111,'Sales Rep','2018-08-27',204,300000,318900),
(212,'Emily Stone',33,112,'Sales Rep','2021-05-13',201,340000,352100),
(213,'Victor Lee',38,113,'Sales Rep','2019-12-01',201,285000,279500),
(214,'Olivia Hall',35,114,'Sales Rep','2020-02-20',204,275000,281300),
(215,'Daniel King',47,115,'Sales Rep','2017-10-30',204,305000,312450),
(216,'Sophia Young',32,116,'Sales Rep','2022-06-11',204,260000,255900),
(217,'Miguel Torres',43,117,'Sales Rep','2018-03-07',201,295000,299700),
(218,'Laura Scott',37,118,'Sales Rep','2020-07-19',201,280000,286420),
(219,'Kevin Baker',46,119,'Sales Rep','2017-09-25',204,290000,294850),
(220,'Sara Evans',34,120,'Sales Rep','2021-01-08',201,310000,319340),
(221,'Andres Cruz',39,121,'Sales Rep','2019-04-16',204,300000,304780),
(222,'Monica Reed',42,122,'Sales Rep','2018-12-05',204,275000,270660),
(223,'Javier Morales',31,123,'Sales Rep','2022-02-14',204,265000,261330),
(224,'Paula Brooks',45,124,'Sales Rep','2017-11-22',201,285000,289910),
(225,'Diego Flores',36,125,'Sales Rep','2020-09-29',201,295000,298440);

-- CUSTOMERS (25)
INSERT INTO customers (cust_num, company, cust_rep, credit_limit) VALUES
(3001,'JCP Industrial',201,50000),
(3002,'First Manufacturing',202,65000),
(3003,'Acme Fabrication',203,50000),
(3004,'Carter Supplies',201,40000),
(3005,'Ace International',205,35000),
(3006,'Smithson Corp',202,20000),
(3007,'Jones Metal Works',204,65000),
(3008,'Blue Ocean Traders',206,45000),
(3009,'Nova Parts',207,38000),
(3010,'GreenLine Tools',208,55000),
(3011,'Urban Build Co',209,47000),
(3012,'Pioneer Systems',210,60000),
(3013,'Delta Hardware',211,42000),
(3014,'Summit Components',212,75000),
(3015,'Vertex Industries',213,52000),
(3016,'Golden State Supply',214,36000),
(3017,'IronBridge LLC',215,41000),
(3018,'Sunrise Mechanics',216,30000),
(3019,'Metro Equipment',217,58000),
(3020,'Central Tech Parts',218,49000),
(3021,'Liberty Industrial',219,53000),
(3022,'Everest Solutions',220,62000),
(3023,'RedRock Devices',221,34000),
(3024,'Prime Logistics',222,39000),
(3025,'Pacific Engineering',223,68000);

-- PRODUCTS (25)
INSERT INTO products (mfr_id, product_id, description, price, qty_on_hand) VALUES
('REI','2A44L','Ratchet Link',79.00,210),
('ACI','41003','Widget Remover',2750.00,25),
('FEA','00114','Reducer',355.00,38),
('QSA','K47A1','Steel Plate A1',180.00,52),
('ACI','41004','900-lb Brace',1875.00,9),
('ACI','4100Z','Size 3 Widget',107.00,207),
('REI','2A44R','Size 4 Widget',117.00,139),
('FEA','00115','Precision Reducer',410.00,44),
('QSA','K47B2','Steel Plate B2',225.00,31),
('MEC','70001','Hydraulic Pump',3200.00,12),
('MEC','70002','Hydraulic Valve',890.00,27),
('TEC','80010','Control Sensor',460.00,65),
('TEC','80011','Pressure Sensor',520.00,54),
('REI','2B10X','Industrial Clamp',95.00,160),
('REI','2B10Y','Industrial Bolt Kit',68.00,240),
('ACI','41005','Heavy Duty Frame',2150.00,11),
('FEA','00116','Compact Reducer',295.00,58),
('QSA','K47C3','Reinforced Plate C3',260.00,29),
('MEC','70003','Drive Motor',4100.00,8),
('TEC','80012','Flow Controller',780.00,34),
('REI','2C20A','Bearing Set',145.00,98),
('ACI','41006','Support Bracket',330.00,72),
('FEA','00117','Gear Assembly',615.00,22),
('QSA','K47D4','Mounting Plate D4',210.00,47),
('TEC','80013','Digital Gauge',390.00,55);

-- ORDERS (25)
INSERT INTO orders (order_num, order_date, cust, rep, mfr, product, qty, amount) VALUES
(4001,'2026-01-05',3001,201,'REI','2A44L',7,553.00),
(4002,'2026-01-06',3002,202,'ACI','41003',2,5500.00),
(4003,'2026-01-07',3003,203,'FEA','00114',6,2130.00),
(4004,'2026-01-08',3004,201,'QSA','K47A1',4,720.00),
(4005,'2026-01-09',3005,205,'ACI','41004',3,5625.00),
(4006,'2026-01-10',3006,202,'ACI','4100Z',9,963.00),
(4007,'2026-01-11',3007,204,'REI','2A44R',10,1170.00),
(4008,'2026-01-12',3008,206,'FEA','00115',5,2050.00),
(4009,'2026-01-13',3009,207,'QSA','K47B2',8,1800.00),
(4010,'2026-01-14',3010,208,'MEC','70001',1,3200.00),
(4011,'2026-01-15',3011,209,'MEC','70002',4,3560.00),
(4012,'2026-01-16',3012,210,'TEC','80010',6,2760.00),
(4013,'2026-01-17',3013,211,'TEC','80011',3,1560.00),
(4014,'2026-01-18',3014,212,'REI','2B10X',12,1140.00),
(4015,'2026-01-19',3015,213,'REI','2B10Y',15,1020.00),
(4016,'2026-01-20',3016,214,'ACI','41005',2,4300.00),
(4017,'2026-01-21',3017,215,'FEA','00116',7,2065.00),
(4018,'2026-01-22',3018,216,'QSA','K47C3',5,1300.00),
(4019,'2026-01-23',3019,217,'MEC','70003',1,4100.00),
(4020,'2026-01-24',3020,218,'TEC','80012',4,3120.00),
(4021,'2026-01-25',3021,219,'REI','2C20A',9,1305.00),
(4022,'2026-01-26',3022,220,'ACI','41006',11,3630.00),
(4023,'2026-01-27',3023,221,'FEA','00117',3,1845.00),
(4024,'2026-01-28',3024,222,'QSA','K47D4',6,1260.00),
(4025,'2026-01-29',3025,223,'TEC','80013',8,3120.00);