CREATE TYPE user_role AS ENUM('admin','manager','member');
CREATE TYPE user_country AS ENUM('india','america','global');

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email_id VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'member',
    country user_country NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurants(
    restaurant_id SERIAL PRIMARY KEY,
    restaurant_name VARCHAR(100) UNIQUE NOT NULL,
    country user_country NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE check_order_status AS ENUM('pending','completed','cancelled');
CREATE TYPE payment_status AS ENUM('pending','paid','failed','refunded');
CREATE TYPE payment_type AS ENUM('UPI','CARD','BANK');


CREATE TABLE orders(
    order_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    restaurant_id INT REFERENCES restaurants(restaurant_id) NOT NULL,
    order_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    order_status check_order_status NOT NULL DEFAULT 'pending',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    payment_method payment_type,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menu_items(
    menu_item_id SERIAL PRIMARY KEY,
    restaurant_id INT REFERENCES restaurants(restaurant_id) NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    item_price NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (restaurant_id,item_name)
);

CREATE TABLE order_items(
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) NOT NULL,
    menu_item_id INT REFERENCES menu_items(menu_item_id) NOT NULL,
    order_quantity INT NOT NULL,
    price_at_time NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (order_id,menu_item_id)
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_menu_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);