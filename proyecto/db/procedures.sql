-- =========================
-- FUNCTIONS / STORED PROCEDURES
-- =========================

CREATE OR REPLACE FUNCTION sp_create_customer(
    p_cust_num INTEGER,
    p_company VARCHAR,
    p_cust_rep INTEGER,
    p_credit_limit NUMERIC
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO customers (cust_num, company, cust_rep, credit_limit)
    VALUES (p_cust_num, p_company, p_cust_rep, p_credit_limit);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_update_product_stock(
    p_mfr_id CHAR(3),
    p_product_id CHAR(5),
    p_new_stock INTEGER
)
RETURNS VOID AS $$
BEGIN
    UPDATE products
    SET qty_on_hand = p_new_stock
    WHERE mfr_id = p_mfr_id AND product_id = p_product_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_delete_customer(
    p_cust_num INTEGER
)
RETURNS VOID AS $$
BEGIN
    DELETE FROM customers
    WHERE cust_num = p_cust_num;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_get_sales_report()
RETURNS TABLE(company VARCHAR, total_orders BIGINT, total_amount NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.company,
        COUNT(o.order_num) AS total_orders,
        COALESCE(SUM(o.amount), 0) AS total_amount
    FROM customers c
    LEFT JOIN orders o ON c.cust_num = o.cust
    GROUP BY c.company
    ORDER BY total_amount DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_create_order(
    p_order_num INTEGER,
    p_order_date DATE,
    p_cust INTEGER,
    p_rep INTEGER,
    p_mfr CHAR(3),
    p_product CHAR(5),
    p_qty INTEGER,
    OUT p_message TEXT,
    OUT p_amount NUMERIC
)
AS $$
DECLARE
    v_price NUMERIC;
    v_stock INTEGER;
BEGIN
    SELECT price, qty_on_hand
    INTO v_price, v_stock
    FROM products
    WHERE mfr_id = p_mfr AND product_id = p_product;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El producto no existe';
    END IF;

    IF p_qty > v_stock THEN
        RAISE EXCEPTION 'Stock insuficiente';
    END IF;

    p_amount := v_price * p_qty;

    INSERT INTO orders (order_num, order_date, cust, rep, mfr, product, qty, amount)
    VALUES (p_order_num, p_order_date, p_cust, p_rep, p_mfr, p_product, p_qty, p_amount);

    UPDATE products
    SET qty_on_hand = qty_on_hand - p_qty
    WHERE mfr_id = p_mfr AND product_id = p_product;

    p_message := 'Orden creada correctamente';
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
$$ LANGUAGE plpgsql;