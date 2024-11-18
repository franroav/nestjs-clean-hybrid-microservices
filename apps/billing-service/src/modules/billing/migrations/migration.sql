-- ============================================
-- Migration Script for Billing Service in Banking
-- ============================================

-- Key Improvements:
-- -- UUID for IDs: Better scalability and unique identification across distributed systems.
-- -- CHECK Constraints: Ensuring data integrity (e.g., valid email formats, positive balances).
-- -- JSONB for Payment Details: Secure storage of flexible payment details.
-- -- GIN Index: For fast lookups in JSONB columns.
-- -- Indexes: Speed up queries, especially on frequently searched columns.

-- 1. Drop Existing Schema (if needed) and Create Schema
-- Drop Tables First (to clean up any existing relationships)
DROP TABLE IF EXISTS billing.transactions CASCADE;
DROP TABLE IF EXISTS billing.invoices CASCADE;
DROP TABLE IF EXISTS billing.payment_methods CASCADE;
DROP TABLE IF EXISTS billing.accounts CASCADE;
DROP TABLE IF EXISTS billing.customers CASCADE;
DROP TABLE IF EXISTS billing.billing_cycles CASCADE;

-- 1. Drop Existing Schema (if needed) and Create Schema
DROP SCHEMA IF EXISTS billing CASCADE;
CREATE SCHEMA IF NOT EXISTS billing;



-- 2. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 3. Create Tables
BEGIN;

-- 3.1 Customers Table
CREATE TABLE IF NOT EXISTS billing.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3.2 Accounts Table
CREATE TABLE IF NOT EXISTS billing.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES billing.customers(id) ON DELETE CASCADE,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('Savings', 'Checking')),
    balance DECIMAL(15, 2) DEFAULT 0.00 CHECK (balance >= 0),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3.3 Payment Methods Table
CREATE TABLE IF NOT EXISTS billing.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES billing.customers(id) ON DELETE CASCADE,
    method_type VARCHAR(50) NOT NULL CHECK (method_type IN ('Credit Card', 'Bank Transfer')),
    details JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (customer_id, method_type)
);

-- 3.4 Billing Cycles Table
CREATE TABLE IF NOT EXISTS billing.billing_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL CHECK (end_date > start_date),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3.5 Invoices Table
CREATE TABLE IF NOT EXISTS billing.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    account_id UUID NOT NULL REFERENCES billing.accounts(id) ON DELETE CASCADE,
    billing_cycle_id UUID NOT NULL REFERENCES billing.billing_cycles(id) ON DELETE CASCADE,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL CHECK (due_date > issue_date),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'overdue')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Drop primary key constraint
ALTER TABLE billing.invoices DROP CONSTRAINT IF EXISTS invoices_pkey;

-- -- Re-add the constraint after modifications
-- ALTER TABLE billing.invoices ADD PRIMARY KEY (id);

-- 3.6 Transactions Table
CREATE TABLE IF NOT EXISTS billing.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES billing.invoices(id) ON DELETE CASCADE,
    payment_method_id UUID REFERENCES billing.payment_methods(id) ON DELETE SET NULL,
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('payment', 'refund')),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMIT;

-- 4. Create Indexes for Optimization
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_customers_email') THEN
--         CREATE INDEX idx_customers_email ON billing.customers(email);
--     END IF;

--     IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_accounts_customer_id') THEN
--         CREATE INDEX idx_accounts_customer_id ON billing.accounts(customer_id);
--     END IF;

--     IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_accounts_account_number') THEN
--         CREATE INDEX idx_accounts_account_number ON billing.accounts(account_number);
--     END IF;

--     IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payment_methods_customer_id') THEN
--         CREATE INDEX idx_payment_methods_customer_id ON billing.payment_methods(customer_id);
--     END IF;

--     IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_invoices_account_id') THEN
--         CREATE INDEX idx_invoices_account_id ON billing.invoices(account_id);
--     END IF;

--     IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_invoices_invoice_number') THEN
--         CREATE INDEX idx_invoices_invoice_number ON billing.invoices(invoice_number);
--     END IF;

--     IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_invoice_id') THEN
--         CREATE INDEX idx_transactions_invoice_id ON billing.transactions(invoice_id);
--     END IF;

--     IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_payment_method_id') THEN
--         CREATE INDEX idx_transactions_payment_method_id ON billing.transactions(payment_method_id);
--     END IF;

--     IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_billing_cycles_name') THEN
--         CREATE INDEX idx_billing_cycles_name ON billing.billing_cycles(name);
--     END IF;
-- END $$;

-- 5. Seed Data with Transaction Management
-- DO $$
-- BEGIN
--     BEGIN -- Start transaction block

--         -- Insert Customer and Account for John Doe
--         INSERT INTO billing.customers (first_name, last_name, email, phone, address)
--         VALUES ('John', 'Doe', 'john.doe@example.com', '123-456-7890', '123 Main St, Anytown, USA')
--         ON CONFLICT (email) DO NOTHING;

--         -- Insert Account
--         INSERT INTO billing.accounts (customer_id, account_number, account_type, balance)
--         VALUES (
--             (SELECT id FROM billing.customers WHERE email = 'john.doe@example.com'),
--             'ACC-1001',
--             'Savings',
--             1000.00
--         )
--         ON CONFLICT (account_number) DO NOTHING;

--         -- Insert Payment Method
--         INSERT INTO billing.payment_methods (customer_id, method_type, details)
--         VALUES (
--             (SELECT id FROM billing.customers WHERE email = 'john.doe@example.com'),
--             'Credit Card',
--             '{"card_number": "**** **** **** 1234", "expiry_date": "12/25", "cardholder_name": "John Doe"}'
--         )
--         ON CONFLICT (customer_id, method_type) DO NOTHING;

--         -- Insert Billing Cycle
--         INSERT INTO billing.billing_cycles (name, start_date, end_date)
--         VALUES ('2024 Q4', CURRENT_DATE, CURRENT_DATE + INTERVAL '3 months')
--         ON CONFLICT (name) DO NOTHING;

--         -- Insert Invoice
--         INSERT INTO billing.invoices (invoice_number, account_id, billing_cycle_id, issue_date, due_date, total_amount, status)
--         VALUES ('INV-1001', 
--             (SELECT id FROM billing.accounts WHERE account_number = 'ACC-1001'),
--             (SELECT id FROM billing.billing_cycles WHERE name = '2024 Q4'), 
--             CURRENT_DATE, 
--             CURRENT_DATE + INTERVAL '30 days', 
--             200.00, 
--             'unpaid'
--         );

--         -- Insert Transaction
--         INSERT INTO billing.transactions (invoice_id, payment_method_id, transaction_date, amount, transaction_type)
--         VALUES (
--             (SELECT id FROM billing.invoices WHERE invoice_number = 'INV-1001'), 
--             (SELECT id FROM billing.payment_methods WHERE customer_id = (SELECT id FROM billing.customers WHERE email = 'john.doe@example.com') LIMIT 1),
--             CURRENT_TIMESTAMP, 
--             200.00, 
--             'payment'
--         );

--     EXCEPTION
--         WHEN OTHERS THEN
--             ROLLBACK; -- Rollback transaction on error
--             RAISE; -- Raise error for further handling
--     END;
-- END $$;









-- DO $$
-- BEGIN
--     BEGIN -- Start transaction block
--         -- Insert Customer and Account for John Doe
--         INSERT INTO billing.customers (first_name, last_name, email, phone, address)
--         VALUES ('John', 'Doe', 'john.doe@example.com', '123-456-7890', '123 Main St, Anytown, USA')
--         ON CONFLICT (email) DO NOTHING;

--         INSERT INTO billing.accounts (customer_id, account_number, account_type, balance)
--         SELECT id, 'ACC-1001', 'Savings', 1000.00
--         FROM billing.customers
--         WHERE email = 'john.doe@example.com'
--         ON CONFLICT (account_number) DO NOTHING;

--         -- Insert Customer and Account for Jane Smith
--         INSERT INTO billing.customers (first_name, last_name, email, phone, address)
--         VALUES ('Jane', 'Smith', 'jane.smith@example.com', '098-765-4321', '456 Elm St, Othertown, USA')
--         ON CONFLICT (email) DO NOTHING;

--         INSERT INTO billing.accounts (customer_id, account_number, account_type, balance)
--         SELECT id, 'ACC-2001', 'Savings', 1500.00
--         FROM billing.customers
--         WHERE email = 'jane.smith@example.com'
--         ON CONFLICT (account_number) DO NOTHING;

--         -- Insert Payment Method for John Doe
--         INSERT INTO billing.payment_methods (customer_id, method_type, details)
--         VALUES
--         ((SELECT id FROM billing.customers WHERE email = 'john.doe@example.com'), 'Credit Card', '{"card_number": "**** **** **** 1234", "expiry": "12/25"}'::jsonb)
--         ON CONFLICT (customer_id, method_type) DO NOTHING;

--         -- Insert Payment Method for Jane Smith
--         INSERT INTO billing.payment_methods (customer_id, method_type, details)
--         VALUES
--         ((SELECT id FROM billing.customers WHERE email = 'jane.smith@example.com'), 'Bank Transfer', '{"account_number": "123456789", "bank_name": "Sample Bank"}'::jsonb)
--         ON CONFLICT (customer_id, method_type) DO NOTHING;

--         -- If everything is successful, commit the transaction
--         COMMIT;
--     EXCEPTION WHEN OTHERS THEN
--         -- If there is an error, rollback the transaction
--         ROLLBACK;
--         RAISE; -- Re-throw the exception
--     END;
-- END $$;






























-- 1. Create Schema
-- CREATE SCHEMA IF NOT EXISTS billing;

-- -- 2. Create Tables

-- -- 2.1 Customers Table
-- CREATE TABLE IF NOT EXISTS billing.customers (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     first_name VARCHAR(50) NOT NULL,
--     last_name VARCHAR(50) NOT NULL,
--     email VARCHAR(100) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'), -- Enforce email format
--     phone VARCHAR(20),
--     address TEXT,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- 2.2 Accounts Table
-- CREATE TABLE IF NOT EXISTS billing.accounts (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     customer_id UUID NOT NULL REFERENCES billing.customers(id) ON DELETE CASCADE,
--     account_number VARCHAR(20) UNIQUE NOT NULL,
--     account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('Savings', 'Checking')), -- Ensure valid account type
--     balance DECIMAL(15, 2) DEFAULT 0.00 CHECK (balance >= 0), -- Ensure non-negative balance
--     status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed')), -- Restrict status values
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- 2.3 Payment Methods Table
-- CREATE TABLE IF NOT EXISTS billing.payment_methods (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     customer_id UUID NOT NULL REFERENCES billing.customers(id) ON DELETE CASCADE,
--     method_type VARCHAR(50) NOT NULL CHECK (method_type IN ('Credit Card', 'Bank Transfer')), -- Enforce payment method types
--     details JSONB NOT NULL, -- To store payment method details securely
--     is_active BOOLEAN DEFAULT TRUE,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- 2.4 Billing Cycles Table
-- CREATE TABLE IF NOT EXISTS billing.billing_cycles (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     name VARCHAR(50) NOT NULL,
--     start_date DATE NOT NULL,
--     end_date DATE NOT NULL CHECK (end_date > start_date), -- Ensure valid date range
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- 2.5 Invoices Table
-- CREATE TABLE IF NOT EXISTS billing.invoices (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     invoice_number VARCHAR(50) UNIQUE NOT NULL,
--     account_id UUID NOT NULL REFERENCES billing.accounts(id) ON DELETE CASCADE,
--     billing_cycle_id UUID NOT NULL REFERENCES billing.billing_cycles(id) ON DELETE CASCADE,
--     issue_date DATE NOT NULL,
--     due_date DATE NOT NULL CHECK (due_date > issue_date), -- Ensure due date is after issue date
--     total_amount DECIMAL(10, 2) NOT NULL,
--     status VARCHAR(20) DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'overdue')), -- Restrict valid status
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- 2.6 Transactions Table
-- CREATE TABLE IF NOT EXISTS billing.transactions (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     invoice_id UUID REFERENCES billing.invoices(id) ON DELETE CASCADE,
--     payment_method_id UUID REFERENCES billing.payment_methods(id) ON DELETE SET NULL, -- Set to NULL if payment method deleted
--     transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0), -- Ensure positive transaction amount
--     transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('payment', 'refund')), -- Restrict valid transaction types
--     status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')), -- Restrict valid statuses
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );



-- -- 3. Relationships and Constraints

-- BEGIN;

-- -- Step 1: Drop foreign key constraints
-- ALTER TABLE billing.transactions
-- DROP CONSTRAINT IF EXISTS transactions_invoice_id_fkey;

-- -- Step 2: Drop the primary key on billing.invoices
-- ALTER TABLE billing.invoices
-- DROP CONSTRAINT IF EXISTS invoices_pkey;

-- -- Step 3: Recreate the primary key (optional)
-- ALTER TABLE billing.invoices
-- ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);

-- -- Step 4: Recreate foreign key constraints
-- ALTER TABLE billing.transactions
-- ADD CONSTRAINT transactions_invoice_id_fkey FOREIGN KEY (invoice_id)
-- REFERENCES billing.invoices (id) ON DELETE CASCADE;

-- COMMIT;

-- -- 4. Indexes

-- -- Indexes for faster lookups
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_customers_email') THEN
--         CREATE INDEX idx_customers_email ON billing.customers(email);
--     END IF;
-- END $$;

-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_accounts_customer_id') THEN
--         CREATE INDEX idx_accounts_customer_id ON billing.accounts(customer_id);
--     END IF;
-- END $$;

-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_accounts_account_number') THEN
--         CREATE INDEX idx_accounts_account_number ON billing.accounts(account_number);
--     END IF;
-- END $$;

-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payment_methods_customer_id') THEN
--         CREATE INDEX idx_payment_methods_customer_id ON billing.payment_methods(customer_id);
--     END IF;
-- END $$;

-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_invoices_account_id') THEN
--         CREATE INDEX idx_invoices_account_id ON billing.invoices(account_id);
--     END IF;
-- END $$;

-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_invoices_invoice_number') THEN
--         CREATE INDEX idx_invoices_invoice_number ON billing.invoices(invoice_number);
--     END IF;
-- END $$;

-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_invoice_id') THEN
--         CREATE INDEX idx_transactions_invoice_id ON billing.transactions(invoice_id);
--     END IF;
-- END $$;

-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_transactions_payment_method_id') THEN
--         CREATE INDEX idx_transactions_payment_method_id ON billing.transactions(payment_method_id);
--     END IF;
-- END $$;

-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_billing_cycles_name') THEN
--         CREATE INDEX idx_billing_cycles_name ON billing.billing_cycles(name);
--     END IF;
-- END $$;

-- -- 5. Seed Data with Transaction Management

-- DO $$
-- BEGIN
--     -- Insert Customer and Account for John Doe
--     INSERT INTO billing.customers (first_name, last_name, email, phone, address)
--     VALUES ('John', 'Doe', 'john.doe@example.com', '123-456-7890', '123 Main St, Anytown, USA')
--     ON CONFLICT (email) DO NOTHING;

--     INSERT INTO billing.accounts (customer_id, account_number, account_type, balance)
--     SELECT id, 'ACC-1001', 'Savings', 1000.00
--     FROM billing.customers
--     WHERE email = 'john.doe@example.com' AND id IS NOT NULL
--     ON CONFLICT (account_number) DO NOTHING;

--     -- Insert Customer and Account for Jane Smith
--     INSERT INTO billing.customers (first_name, last_name, email, phone, address)
--     VALUES ('Jane', 'Smith', 'jane.smith@example.com', '098-765-4321', '456 Elm St, Othertown, USA')
--     ON CONFLICT (email) DO NOTHING;

--     INSERT INTO billing.accounts (customer_id, account_number, account_type, balance)
--     SELECT id, 'ACC-2001', 'Savings', 1500.00
--     FROM billing.customers
--     WHERE email = 'jane.smith@example.com' AND id IS NOT NULL
--     ON CONFLICT (account_number) DO NOTHING;

--     -- Insert Payment Method for John Doe
--     INSERT INTO billing.payment_methods (customer_id, method_type, details)
--     VALUES
--     ((SELECT id FROM billing.customers WHERE email = 'john.doe@example.com'), 'Credit Card', '{"card_number": "**** **** **** 1234", "expiry": "12/25"}'::jsonb)
--     ON CONFLICT (customer_id, method_type) DO NOTHING;

--     -- Insert Payment Method for Jane Smith
--     INSERT INTO billing.payment_methods (customer_id, method_type, details)
--     VALUES
--     ((SELECT id FROM billing.customers WHERE email = 'jane.smith@example.com'), 'Bank Transfer', '{"account_number": "123456789", "bank_name": "Sample Bank"}'::jsonb)
--     ON CONFLICT (customer_id, method_type) DO NOTHING;

-- EXCEPTION WHEN OTHERS THEN
--     ROLLBACK;
--     RAISE;
-- END $$;











-- Insert sample accounts
-- INSERT INTO billing.accounts (customer_id, account_number, account_type, balance)
-- VALUES
--     ((SELECT id FROM billing.customers WHERE email = 'john.doe@example.com'), 'ACC-1001', 'Savings', 1000.00)
-- ON CONFLICT (account_number) DO NOTHING;
-- Insert sample accounts only if customer exists
-- 1. Ensure the Customer exists


-- -- Insert sample customers
-- INSERT INTO billing.customers (first_name, last_name, email, phone, address)
-- VALUES
-- ('John', 'Doe', 'john.doe@example.com', '123-456-7890', '123 Main St, Anytown, USA')
-- ON CONFLICT (email) DO NOTHING;

-- INSERT INTO billing.customers (first_name, last_name, email, phone, address)
-- VALUES
-- ('Jane', 'Smith', 'jane.smith@example.com', '098-765-4321', '456 Elm St, Othertown, USA')
-- ON CONFLICT (email) DO NOTHING;

-- -- Insert sample accounts
-- INSERT INTO billing.accounts (customer_id, account_number, account_type, balance)
-- VALUES
-- ((SELECT id FROM billing.customers WHERE email = 'john.doe@example.com'), 'ACC-1001', 'Savings', 1000.00)
-- ON CONFLICT (account_number) DO NOTHING;
-- ((SELECT id FROM billing.customers WHERE email = 'john.doe@example.com'), 'ACC-1002', 'Checking', 500.00)
-- ON CONFLICT (account_number) DO NOTHING;
-- ((SELECT id FROM billing.customers WHERE email = 'jane.smith@example.com'), 'ACC-2001', 'Savings', 1500.00)
-- ON CONFLICT (account_number) DO NOTHING;

-- -- Insert sample payment methods
-- INSERT INTO billing.payment_methods (customer_id, method_type, details)
-- VALUES
-- ((SELECT id FROM billing.customers WHERE email = 'john.doe@example.com'), 'Credit Card', '{"card_number": "1234-5678-9012-3456", "expiry_date": "12/24"}')
-- ON CONFLICT (customer_id, method_type) DO NOTHING;
-- ((SELECT id FROM billing.customers WHERE email = 'jane.smith@example.com'), 'Bank Transfer', '{"account_number": "987654321", "bank_name": "Bank of Example"}')
-- ON CONFLICT (customer_id, method_type) DO NOTHING;


-- -- ============================================
-- -- Migration Script for Billing Service in Banking
-- -- ============================================

-- -- Key Improvements:
-- -- -- UUID for IDs: Better scalability and unique identification across distributed systems.
-- -- -- CHECK Constraints: Ensuring data integrity (e.g., valid email formats, positive balances).
-- -- -- JSONB for Payment Details: Secure storage of flexible payment details.
-- -- -- GIN Index: For fast lookups in JSONB columns.
-- -- -- Indexes: Speed up queries, especially on frequently searched columns.

-- -- 1. Create Schema
-- CREATE SCHEMA IF NOT EXISTS billing;

-- -- 2. Create Tables

-- -- 2.1 Customers Table
-- CREATE TABLE IF NOT EXISTS billing.customers (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     first_name VARCHAR(50) NOT NULL,
--     last_name VARCHAR(50) NOT NULL,
--     email VARCHAR(100) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'), -- Enforce email format
--     phone VARCHAR(20),
--     address TEXT,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- 2.2 Accounts Table
-- CREATE TABLE IF NOT EXISTS billing.accounts (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     customer_id UUID NOT NULL REFERENCES billing.customers(id) ON DELETE CASCADE,
--     account_number VARCHAR(20) UNIQUE NOT NULL,
--     account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('Savings', 'Checking')), -- Ensure valid account type
--     balance DECIMAL(15, 2) DEFAULT 0.00 CHECK (balance >= 0), -- Ensure non-negative balance
--     status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed')), -- Restrict status values
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- 2.3 Payment Methods Table
-- CREATE TABLE IF NOT EXISTS billing.payment_methods (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     customer_id UUID NOT NULL REFERENCES billing.customers(id) ON DELETE CASCADE,
--     method_type VARCHAR(50) NOT NULL CHECK (method_type IN ('Credit Card', 'Bank Transfer')), -- Enforce payment method types
--     details JSONB NOT NULL, -- To store payment method details securely
--     is_active BOOLEAN DEFAULT TRUE,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- 2.4 Billing Cycles Table
-- CREATE TABLE IF NOT EXISTS billing.billing_cycles (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     name VARCHAR(50) NOT NULL,
--     start_date DATE NOT NULL,
--     end_date DATE NOT NULL CHECK (end_date > start_date), -- Ensure valid date range
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- 2.5 Invoices Table
-- CREATE TABLE IF NOT EXISTS billing.invoices (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     invoice_number VARCHAR(50) UNIQUE NOT NULL,
--     account_id UUID NOT NULL REFERENCES billing.accounts(id) ON DELETE CASCADE,
--     billing_cycle_id UUID NOT NULL REFERENCES billing.billing_cycles(id) ON DELETE CASCADE,
--     issue_date DATE NOT NULL,
--     due_date DATE NOT NULL CHECK (due_date > issue_date), -- Ensure due date is after issue date
--     total_amount DECIMAL(10, 2) NOT NULL,
--     status VARCHAR(20) DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'overdue')), -- Restrict valid status
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- 2.6 Transactions Table
-- CREATE TABLE IF NOT EXISTS billing.transactions (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     invoice_id UUID REFERENCES billing.invoices(id) ON DELETE CASCADE,
--     payment_method_id UUID REFERENCES billing.payment_methods(id) ON DELETE SET NULL, -- Set to NULL if payment method deleted
--     transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0), -- Ensure positive transaction amount
--     transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('payment', 'refund')), -- Restrict valid transaction types
--     status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')), -- Restrict valid statuses
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- -- 3. Relationships and Constraints

-- -- Ensure account balance cannot be negative
-- ALTER TABLE billing.accounts
-- ADD CONSTRAINT chk_balance_non_negative CHECK (balance >= 0);

-- -- Ensure transaction amount is positive
-- ALTER TABLE billing.transactions
-- ADD CONSTRAINT chk_transaction_amount_positive CHECK (amount > 0);

-- -- 4. Indexes

-- -- Indexes for faster lookups
-- CREATE INDEX IF NOT EXISTS idx_customers_email ON billing.customers(email);
-- CREATE INDEX IF NOT EXISTS idx_accounts_customer_id ON billing.accounts(customer_id);
-- CREATE INDEX IF NOT EXISTS idx_accounts_account_number ON billing.accounts(account_number);
-- CREATE INDEX IF NOT EXISTS idx_payment_methods_customer_id ON billing.payment_methods(customer_id);
-- CREATE INDEX IF NOT EXISTS idx_invoices_account_id ON billing.invoices(account_id);
-- CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON billing.invoices(invoice_number);
-- CREATE INDEX IF NOT EXISTS idx_transactions_invoice_id ON billing.transactions(invoice_id);
-- CREATE INDEX IF NOT EXISTS idx_transactions_payment_method_id ON billing.transactions(payment_method_id);
-- CREATE INDEX IF NOT EXISTS idx_billing_cycles_name ON billing.billing_cycles(name);
-- CREATE INDEX IF NOT EXISTS idx_payment_details ON billing.payment_methods USING GIN(details); -- JSONB Index for payment method details

-- -- 5. Seed Data (Optional)

-- -- Insert sample customers
-- INSERT INTO billing.customers (first_name, last_name, email, phone, address)
-- VALUES
-- ('John', 'Doe', 'john.doe@example.com', '123-456-7890', '123 Main St, Anytown, USA'),
-- ('Jane', 'Smith', 'jane.smith@example.com', '098-765-4321', '456 Elm St, Othertown, USA');

-- -- Insert sample accounts
-- INSERT INTO billing.accounts (customer_id, account_number, account_type, balance)
-- VALUES
-- ((SELECT id FROM billing.customers WHERE email = 'john.doe@example.com'), 'ACC-1001', 'Savings', 1000.00),
-- ((SELECT id FROM billing.customers WHERE email = 'john.doe@example.com'), 'ACC-1002', 'Checking', 500.00),
-- ((SELECT id FROM billing.customers WHERE email = 'jane.smith@example.com'), 'ACC-2001', 'Savings', 1500.00);

-- -- Insert sample billing cycles
-- INSERT INTO billing.billing_cycles (name, start_date, end_date)
-- VALUES
-- ('January 2024', '2024-01-01', '2024-01-31'),
-- ('February 2024', '2024-02-01', '2024-02-28');

-- -- Insert sample invoices
-- INSERT INTO billing.invoices (invoice_number, account_id, billing_cycle_id, issue_date, due_date, total_amount, status)
-- VALUES
-- ('INV-1001-01', (SELECT id FROM billing.accounts WHERE account_number = 'ACC-1001'), (SELECT id FROM billing.billing_cycles WHERE name = 'January 2024'), '2024-01-05', '2024-02-05', 200.00, 'unpaid'),
-- ('INV-1001-02', (SELECT id FROM billing.accounts WHERE account_number = 'ACC-1001'), (SELECT id FROM billing.billing_cycles WHERE name = 'February 2024'), '2024-02-05', '2024-03-05', 220.00, 'unpaid'),
-- ('INV-2001-01', (SELECT id FROM billing.accounts WHERE account_number = 'ACC-2001'), (SELECT id FROM billing.billing_cycles WHERE name = 'January 2024'), '2024-01-10', '2024-02-10', 180.00, 'unpaid');

-- -- Insert sample payment methods
-- INSERT INTO billing.payment_methods (customer_id, method_type, details)
-- VALUES
-- ((SELECT id FROM billing.customers WHERE email = 'john.doe@example.com'), 'Credit Card', '{"card_number": "4111111111111111", "expiry": "12/25", "cardholder_name": "John Doe"}'),
-- ((SELECT id FROM billing.customers WHERE email = 'jane.smith@example.com'), 'Bank Transfer', '{"bank_name": "Bank A", "account_number": "1234567890", "routing_number": "987654321"}');

-- -- Insert sample transactions
-- INSERT INTO billing.transactions (invoice_id, payment_method_id, transaction_date, amount, transaction_type, status)
-- VALUES
-- ((SELECT id FROM billing.invoices WHERE invoice_number = 'INV-1001-01'), (SELECT id FROM billing.payment_methods WHERE customer_id = (SELECT id FROM billing.customers WHERE email = 'john.doe@example.com') AND method_type = 'Credit Card'), '2024-01-15 10:00:00', 200.00, 'payment', 'completed'),
-- ((SELECT id FROM billing.invoices WHERE invoice_number = 'INV-2001-01'), (SELECT id FROM billing.payment_methods WHERE customer_id = (SELECT id FROM billing.customers WHERE email = 'jane.smith@example.com') AND method_type = 'Bank Transfer'), '2024-01-20 14:30:00', 180.00, 'payment', 'completed');
