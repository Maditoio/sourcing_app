CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE country AS ENUM ('DRC', 'Congo-Brazzaville', 'Nigeria', 'Other');
CREATE TYPE role AS ENUM ('user', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'approved', 'quoted', 'payment_pending', 'paid', 'sourcing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE notification_type AS ENUM ('order_approved', 'quote_received', 'payment_confirmed', 'order_shipped', 'order_delivered', 'general');
CREATE TYPE attachment_type AS ENUM ('reference_image', 'proof_of_payment', 'document');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  country country NOT NULL,
  city TEXT,
  delivery_address TEXT,
  role role NOT NULL DEFAULT 'user',
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reference_url TEXT,
  quantity INTEGER DEFAULT 1,
  delivery_country TEXT,
  delivery_city TEXT,
  delivery_address TEXT NOT NULL,
  special_instructions TEXT,
  status order_status NOT NULL DEFAULT 'pending',
  quoted_price NUMERIC(12,2),
  quoted_currency TEXT DEFAULT 'USD',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE order_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type attachment_type,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX orders_user_id_idx ON orders(user_id);
CREATE INDEX orders_status_idx ON orders(status);
CREATE INDEX notifications_user_id_idx ON notifications(user_id);
