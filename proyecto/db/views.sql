-- =========================
-- VIEWS
-- =========================

CREATE OR REPLACE VIEW vw_orders_by_customer AS
SELECT 
    c.company,
    COUNT(o.order_num) AS total_orders,
    COALESCE(SUM(o.amount), 0) AS total_amount
FROM customers c
LEFT JOIN orders o ON c.cust_num = o.cust
GROUP BY c.company;