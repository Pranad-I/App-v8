
CREATE TABLE IF NOT EXISTS devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  device_type text NOT NULL DEFAULT 'unknown',
  ip_address text NOT NULL,
  mac_address text NOT NULL,
  status text NOT NULL DEFAULT 'Unknown',
  risk_level text NOT NULL DEFAULT 'Low',
  first_seen timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now(),
  data_usage_gb numeric(6,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_devices" ON devices FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_devices" ON devices FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_devices" ON devices FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_devices" ON devices FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid REFERENCES devices(id) ON DELETE SET NULL,
  device_name text NOT NULL,
  device_ip text NOT NULL,
  action text NOT NULL,
  performed_by text DEFAULT 'Admin',
  details text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_access_logs" ON access_logs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_access_logs" ON access_logs FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_access_logs" ON access_logs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_access_logs" ON access_logs FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS network_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hour_label text NOT NULL,
  connections int DEFAULT 0,
  approvals int DEFAULT 0,
  blocks int DEFAULT 0,
  quarantines int DEFAULT 0,
  unknowns int DEFAULT 0,
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE network_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_network_activity" ON network_activity FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_network_activity" ON network_activity FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_network_activity" ON network_activity FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_network_activity" ON network_activity FOR DELETE TO anon, authenticated USING (true);
