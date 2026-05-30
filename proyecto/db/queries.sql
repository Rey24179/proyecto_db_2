-- JOIN 1
SELECT 
    o.order_num,
    c.company,
    o.order_date,
    o.amount
FROM orders o
JOIN customers c ON o.cust = c.cust_num
ORDER BY o.order_num;

-- JOIN 2
SELECT 
    o.order_num,
    s.name AS sales_rep,
    o.order_date,
    o.amount
FROM orders o
JOIN salesRep s ON o.rep = s.empl_num
ORDER BY o.order_num;

-- JOIN 3
SELECT 
    o.order_num,
    p.description,
    o.qty,
    o.amount
FROM orders o
JOIN products p 
  ON o.mfr = p.mfr_id AND o.product = p.product_id
ORDER BY o.order_num;

-- SUBQUERY 1
SELECT 
    cust_num,
    company,
    credit_limit
FROM customers
WHERE credit_limit > (
    SELECT AVG(credit_limit)
    FROM customers
);

-- SUBQUERY 2
SELECT 
    empl_num,
    name
FROM salesRep s
WHERE EXISTS (
    SELECT 1
    FROM customers c
    WHERE c.cust_rep = s.empl_num
);

-- CTE
WITH total_por_cliente AS (
    SELECT 
        c.cust_num,
        c.company,
        SUM(o.amount) AS total_amount
    FROM customers c
    JOIN orders o ON c.cust_num = o.cust
    GROUP BY c.cust_num, c.company
)
SELECT *
FROM total_por_cliente
ORDER BY total_amount DESC;