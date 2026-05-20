-- Tinius Invest - Database Schema + Seed
-- Run this against your Neon database

CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  cash_nok NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS holdings (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ticker TEXT,
  exchange TEXT,
  currency TEXT NOT NULL DEFAULT 'NOK',
  type TEXT NOT NULL DEFAULT 'stock',
  shares NUMERIC(18,6) NOT NULL,
  gav_per_share NUMERIC(18,6) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  bought_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  holding_id INTEGER REFERENCES holdings(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  ticker TEXT,
  holding_name TEXT NOT NULL,
  shares NUMERIC(18,6),
  price_per_share NUMERIC(18,6),
  currency TEXT NOT NULL DEFAULT 'NOK',
  total_nok NUMERIC(12,2),
  executed_at DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fund_prices (
  id SERIAL PRIMARY KEY,
  holding_id INTEGER NOT NULL REFERENCES holdings(id) ON DELETE CASCADE,
  price_nok NUMERIC(18,6) NOT NULL,
  price_date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed accounts
INSERT INTO accounts (name, type, cash_nok) VALUES
  ('Aksjesparekonto', 'ASK', 2500.00),
  ('Aksjefondskonto', 'AF', 3457.00)
ON CONFLICT DO NOTHING;

-- Seed holdings (use the account IDs from above)
WITH ask AS (SELECT id FROM accounts WHERE type = 'ASK' LIMIT 1),
     af  AS (SELECT id FROM accounts WHERE type = 'AF'  LIMIT 1)
INSERT INTO holdings (account_id, name, ticker, exchange, currency, type, shares, gav_per_share, status, bought_at)
SELECT ask.id, 'ServiceNow', 'NOW', 'NYSE', 'USD', 'stock', 15, 102.26, 'active', '2026-05-18' FROM ask
UNION ALL
SELECT ask.id, 'HubSpot', 'HUBS', 'NYSE', 'USD', 'stock', 5, 210.67, 'active', '2026-05-18' FROM ask
UNION ALL
SELECT af.id, 'Storebrand Indeks Alle Markeder N', NULL, NULL, 'NOK', 'fund', 1, 12500, 'pending', '2026-05-18' FROM af
UNION ALL
SELECT af.id, 'Storebrand Indeks Nye Markeder N', NULL, NULL, 'NOK', 'fund', 1, 12500, 'pending', '2026-05-18' FROM af;

-- Seed initial buy transactions
WITH ask AS (SELECT id FROM accounts WHERE type = 'ASK' LIMIT 1),
     af  AS (SELECT id FROM accounts WHERE type = 'AF'  LIMIT 1),
     now_h AS (SELECT id FROM holdings WHERE ticker = 'NOW' LIMIT 1),
     hubs_h AS (SELECT id FROM holdings WHERE ticker = 'HUBS' LIMIT 1),
     alle_h AS (SELECT id FROM holdings WHERE name = 'Storebrand Indeks Alle Markeder N' LIMIT 1),
     nye_h  AS (SELECT id FROM holdings WHERE name = 'Storebrand Indeks Nye Markeder N' LIMIT 1)
INSERT INTO transactions (account_id, holding_id, type, ticker, holding_name, shares, price_per_share, currency, total_nok, executed_at)
SELECT ask.id, now_h.id, 'buy', 'NOW', 'ServiceNow', 15, 102.26, 'USD', NULL, '2026-05-18' FROM ask, now_h
UNION ALL
SELECT ask.id, hubs_h.id, 'buy', 'HUBS', 'HubSpot', 5, 210.67, 'USD', NULL, '2026-05-18' FROM ask, hubs_h
UNION ALL
SELECT af.id, alle_h.id, 'buy', NULL, 'Storebrand Indeks Alle Markeder N', 1, 12500, 'NOK', 12500, '2026-05-18' FROM af, alle_h
UNION ALL
SELECT af.id, nye_h.id, 'buy', NULL, 'Storebrand Indeks Nye Markeder N', 1, 12500, 'NOK', 12500, '2026-05-18' FROM af, nye_h;
