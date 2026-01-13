CREATE TABLE IF NOT EXISTS counterparties (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(254),
    phone VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_counterparties_name ON counterparties (lower(name));

CREATE TABLE IF NOT EXISTS sales_orders (
    id BIGSERIAL PRIMARY KEY,
    number VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    customer_id BIGINT NOT NULL REFERENCES counterparties(id),
    amount DECIMAL(19, 2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_sales_orders_number ON sales_orders (lower(number));
CREATE INDEX IF NOT EXISTS ix_sales_orders_customer ON sales_orders (customer_id);

CREATE TABLE IF NOT EXISTS purchase_orders (
    id BIGSERIAL PRIMARY KEY,
    number VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    vendor_id BIGINT NOT NULL REFERENCES counterparties(id),
    amount DECIMAL(19, 2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_purchase_orders_number ON purchase_orders (lower(number));
CREATE INDEX IF NOT EXISTS ix_purchase_orders_vendor ON purchase_orders (vendor_id);

CREATE TABLE IF NOT EXISTS task_items (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS work_orders (
    id BIGSERIAL PRIMARY KEY,
    number VARCHAR(50) NOT NULL,
    product_id BIGINT NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_work_orders_number ON work_orders (lower(number));
CREATE INDEX IF NOT EXISTS ix_work_orders_product ON work_orders (product_id);

