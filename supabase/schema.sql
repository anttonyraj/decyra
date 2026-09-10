-- =========================================================
-- Decyra Demo Schema, Tables, and RPC Function
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/qckponghfwupdyaamwfw/sql
-- =========================================================

-- 1. Create Demo Schema
CREATE SCHEMA IF NOT EXISTS demo;

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS demo.customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  country TEXT NOT NULL,
  signup_date DATE NOT NULL,
  arr_band TEXT NOT NULL
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS demo.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true
);

-- 4. Sales Reps Table
CREATE TABLE IF NOT EXISTS demo.sales_reps (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  quota NUMERIC NOT NULL,
  start_date DATE NOT NULL
);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS demo.orders (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES demo.customers(id),
  product_id INT REFERENCES demo.products(id),
  sales_rep_id INT REFERENCES demo.sales_reps(id),
  quantity INT NOT NULL,
  unit_price NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  order_date DATE NOT NULL,
  status TEXT NOT NULL
);

-- 6. Insert Seed Data
INSERT INTO demo.customers (name, industry, country, signup_date, arr_band) VALUES
('Acme Corp', 'SaaS', 'US', '2025-01-15', 'enterprise'),
('Stripe Tech', 'FinTech', 'US', '2025-02-10', 'enterprise'),
('HealthPlus Solutions', 'Healthcare', 'CA', '2025-03-01', 'large'),
('Nordic Retailers', 'Retail', 'UK', '2025-01-20', 'mid'),
('Apex Manufacturing', 'Manufacturing', 'DE', '2025-02-28', 'enterprise'),
('CloudScale AI', 'SaaS', 'US', '2025-03-12', 'mid'),
('FinServe Capital', 'FinTech', 'UK', '2025-04-05', 'large'),
('BioMed Innovations', 'Healthcare', 'AU', '2025-04-18', 'mid'),
('Urban Direct', 'Retail', 'US', '2025-05-02', 'small'),
('Atlas Dynamics', 'Manufacturing', 'DE', '2025-05-15', 'large'),
('Vanguard Systems', 'SaaS', 'US', '2025-06-01', 'enterprise'),
('Meridian Trade', 'FinTech', 'CA', '2025-06-14', 'mid')
ON CONFLICT DO NOTHING;

INSERT INTO demo.products (name, category, price, active) VALUES
('Enterprise Analytics Suite', 'Subscription', 2400.00, true),
('Team Intelligence Platform', 'Subscription', 800.00, true),
('Starter Data Connector', 'Subscription', 250.00, true),
('Predictive Insights Module', 'Add-on', 450.00, true),
('Custom SLA Support', 'Service', 1200.00, true),
('Dedicated Migration Onboarding', 'Service', 3500.00, true)
ON CONFLICT DO NOTHING;

INSERT INTO demo.sales_reps (name, region, quota, start_date) VALUES
('Sarah Jenkins', 'North', 120000.00, '2024-06-01'),
('Michael Chang', 'South', 100000.00, '2024-08-15'),
('David Miller', 'East', 150000.00, '2024-03-10'),
('Elena Rostova', 'West', 110000.00, '2024-11-01')
ON CONFLICT DO NOTHING;

INSERT INTO demo.orders (customer_id, product_id, sales_rep_id, quantity, unit_price, total, order_date, status) VALUES
(1, 1, 1, 5, 2400.00, 12000.00, CURRENT_DATE - INTERVAL '15 days', 'delivered'),
(1, 4, 1, 10, 450.00, 4500.00, CURRENT_DATE - INTERVAL '12 days', 'delivered'),
(2, 1, 3, 8, 2400.00, 19200.00, CURRENT_DATE - INTERVAL '20 days', 'delivered'),
(2, 5, 3, 2, 1200.00, 2400.00, CURRENT_DATE - INTERVAL '10 days', 'delivered'),
(3, 2, 2, 6, 800.00, 4800.00, CURRENT_DATE - INTERVAL '25 days', 'delivered'),
(4, 3, 4, 12, 250.00, 3000.00, CURRENT_DATE - INTERVAL '5 days', 'delivered'),
(5, 6, 1, 2, 3500.00, 7000.00, CURRENT_DATE - INTERVAL '30 days', 'delivered'),
(5, 1, 1, 4, 2400.00, 9600.00, CURRENT_DATE - INTERVAL '8 days', 'delivered'),
(6, 2, 4, 4, 800.00, 3200.00, CURRENT_DATE - INTERVAL '40 days', 'delivered'),
(7, 1, 3, 6, 2400.00, 14400.00, CURRENT_DATE - INTERVAL '18 days', 'delivered'),
(8, 2, 2, 5, 800.00, 4000.00, CURRENT_DATE - INTERVAL '2 days', 'delivered'),
(9, 3, 2, 4, 250.00, 1000.00, CURRENT_DATE - INTERVAL '1 day', 'pending'),
(10, 1, 1, 7, 2400.00, 16800.00, CURRENT_DATE - INTERVAL '7 days', 'delivered'),
(11, 1, 3, 9, 2400.00, 21600.00, CURRENT_DATE - INTERVAL '14 days', 'delivered'),
(12, 2, 4, 8, 800.00, 6400.00, CURRENT_DATE - INTERVAL '9 days', 'delivered')
ON CONFLICT DO NOTHING;

-- 7. Create Demo Query Runner Function (RPC)
CREATE OR REPLACE FUNCTION public.run_demo_query(query_text text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  EXECUTE format('SELECT coalesce(jsonb_agg(row_to_json(t)), ''[]''::jsonb) FROM (%s) t', query_text) INTO result;
  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.run_demo_query(text) TO anon, authenticated, service_role;

-- 8. Create Connections Table (for custom Postgres / Snowflake user databases)
CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  username TEXT NOT NULL,
  password_encrypted TEXT NOT NULL,
  database_name TEXT NOT NULL,
  host TEXT,
  port INT,
  ssl_enabled BOOLEAN DEFAULT false,
  connection_type TEXT DEFAULT 'postgres',
  account TEXT,
  warehouse TEXT,
  schema_name TEXT,
  role TEXT,
  schema_info TEXT,
  status TEXT DEFAULT 'active',
  last_tested_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can manage their own connections"
  ON public.connections FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 9. Create Waitlist Table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  connector TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Anyone can insert to waitlist"
  ON public.waitlist FOR INSERT TO anon, authenticated
  WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 10. Create Query History & Favorites Table
CREATE TABLE IF NOT EXISTS public.queries_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  sql TEXT NOT NULL,
  intent TEXT,
  row_count INT DEFAULT 0,
  is_favorite BOOLEAN DEFAULT false,
  connection_id TEXT DEFAULT 'demo',
  connection_name TEXT DEFAULT 'Demo Database',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.queries_history ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can manage their own query history"
  ON public.queries_history FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

