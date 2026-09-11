-- Run this once against your Postgres database to create the required tables.
-- Usage: psql -U your_db_user -d conference_db -f db/schema.sql

-- Simple key/value store for configurable values that don't have their own table,
-- e.g. the exhibitor fee, which is undecided for now and can be set later via the admin API.
CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- One row per participant category (Farmer, Researcher, CSO, Government, Private Sector, Student, ...).
-- "fields" is a placeholder for the category-specific question list once you have it -
-- e.g. [{"key": "farm_size", "label": "Farm size (acres)", "type": "text"}]
CREATE TABLE IF NOT EXISTS participant_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    fields JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS participants (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    country VARCHAR(100),
    organization VARCHAR(255),
    position VARCHAR(255),
    category_id INTEGER REFERENCES participant_categories(id),
    answers JSONB DEFAULT '{}',           -- category-specific answers, once the field list is final
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending | verified | rejected
    payment_reference TEXT,               -- M-Pesa message, bank slip ref, etc. - filled in once that flow is built
    created_at TIMESTAMP DEFAULT NOW()
);

-- Exhibitors follow the same pending -> verified -> ticket pipeline as participants.
-- Fields match the real "Online Exhibition Registration Form". The fee is one flat
-- rate for everyone (not tiered like participant categories), but the actual amount
-- is still undecided - it's configurable via the "settings" table, not hardcoded here.
CREATE TABLE IF NOT EXISTS exhibitors (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    organization VARCHAR(255) NOT NULL,   -- "Name of Organization or Company (write 'individual' if none)"
    address TEXT NOT NULL,
    country VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,            -- description of what they will exhibit
    payment_method VARCHAR(20) NOT NULL,  -- 'mpesa' | 'bank' - chosen at registration
    website_link VARCHAR(500),
    price NUMERIC(10, 2) NOT NULL,        -- looked up from settings.exhibitor_fee at registration time
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_reference TEXT,               -- actual proof of payment, added once that flow is built
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tickets are generated once a participant or exhibitor is verified.
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    registration_type VARCHAR(20) NOT NULL, -- 'participant' | 'exhibitor'
    registration_id INTEGER NOT NULL,
    issued_at TIMESTAMP DEFAULT NOW()
);
