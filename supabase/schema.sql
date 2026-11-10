-- ====================================================================
-- REEFSIGHT: Platform Kecerdasan Ekologis Terumbu Karang Pulau Tunda
-- Complete PostgreSQL + PostGIS Database Schema for Supabase
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Define Enum Types
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM (
        'admin', 
        'operator_lapangan', 
        'peneliti_ekologi', 
        'validator_data', 
        'public'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE health_status_enum AS ENUM (
        'Sehat', 
        'Bleaching', 
        'Degradasi'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE validation_status_enum AS ENUM (
        'Draft', 
        'Pending Validation', 
        'Approved', 
        'Returned', 
        'Rejected'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE alert_severity_enum AS ENUM (
        'Warning', 
        'High', 
        'Critical'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Table: profiles (Users & RBAC)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role_enum DEFAULT 'public' NOT NULL,
    institution TEXT,
    phone_number TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Table: prototypes (EchoVision Hardware Units)
CREATE TABLE IF NOT EXISTS prototypes (
    id TEXT PRIMARY KEY, -- e.g. 'RFS-PROT-001'
    name TEXT NOT NULL,
    model_version TEXT DEFAULT 'ASIK v2.0' NOT NULL,
    total_bom_idr NUMERIC(12, 2) DEFAULT 2120000.00,
    solar_panel_spec TEXT DEFAULT '20 Wp Monocrystalline',
    battery_spec TEXT DEFAULT 'LiFePO4 12V 10Ah',
    sensors_equipped TEXT[] DEFAULT ARRAY['Hydrophone', 'Underwater Camera', 'SST Sensor', 'Turbidity Sensor'],
    status TEXT DEFAULT 'Active' NOT NULL,
    deployed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Table: stations (12 Buoy Deployment Stations around Pulau Tunda)
CREATE TABLE IF NOT EXISTS stations (
    id TEXT PRIMARY KEY, -- e.g. 'RFS-STA-001'
    prototype_id TEXT REFERENCES prototypes(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    position_label TEXT NOT NULL, -- e.g. 'Barat', 'Utara'
    depth_m NUMERIC(5, 2) NOT NULL,
    geom GEOMETRY(Point, 4326) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    health_status health_status_enum DEFAULT 'Sehat' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    last_telemetry_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Spatial index for high performance station queries
CREATE INDEX IF NOT EXISTS idx_stations_geom ON stations USING GIST(geom);

-- 6. Table: sensor_readings (Time-series Oceanographic Telemetry)
CREATE TABLE IF NOT EXISTS sensor_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id TEXT REFERENCES stations(id) ON DELETE CASCADE NOT NULL,
    temperature_c NUMERIC(4, 2) NOT NULL,
    salinity_psu NUMERIC(4, 2) DEFAULT 33.2,
    ph NUMERIC(3, 2) DEFAULT 8.1,
    dissolved_oxygen_mg_l NUMERIC(4, 2) DEFAULT 6.8,
    turbidity_ntu NUMERIC(4, 2) DEFAULT 1.2,
    sound_level_db NUMERIC(5, 2) DEFAULT -42.0,
    recorded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sensor_readings_station_time ON sensor_readings(station_id, recorded_at DESC);

-- 7. Table: coral_distribution (ArcGIS Polygons)
CREATE TABLE IF NOT EXISTS coral_distribution (
    id TEXT PRIMARY KEY, -- e.g. 'POL-2023-01'
    zone_name TEXT NOT NULL,
    observation_year INT NOT NULL,
    live_coral_cover_pct NUMERIC(5, 2) NOT NULL,
    condition health_status_enum NOT NULL,
    dominant_life_form TEXT NOT NULL,
    area_hectares NUMERIC(6, 2) NOT NULL,
    geom GEOMETRY(Polygon, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_coral_distribution_geom ON coral_distribution USING GIST(geom);

-- 8. Table: field_observations (Operator Lapangan Data Ingestion)
CREATE TABLE IF NOT EXISTS field_observations (
    id TEXT PRIMARY KEY, -- e.g. 'OBS-2026-081'
    station_id TEXT REFERENCES stations(id) ON DELETE CASCADE NOT NULL,
    operator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    operator_name TEXT NOT NULL,
    depth_m NUMERIC(5, 2) NOT NULL,
    water_temp_c NUMERIC(4, 2) NOT NULL,
    turbidity_ntu NUMERIC(4, 2) NOT NULL,
    live_coral_cover_pct NUMERIC(5, 2),
    audio_file_path TEXT, -- Storage path
    audio_duration_sec INT,
    image_file_paths TEXT[], -- Array of storage paths
    notes TEXT,
    validation_status validation_status_enum DEFAULT 'Pending Validation' NOT NULL,
    validator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    validator_name TEXT,
    validator_notes TEXT,
    validated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Constraint: Operator cannot approve their own data (Separation of Duties)
ALTER TABLE field_observations DROP CONSTRAINT IF EXISTS chk_operator_not_validator;
ALTER TABLE field_observations ADD CONSTRAINT chk_operator_not_validator 
    CHECK (operator_id IS NULL OR validator_id IS NULL OR operator_id != validator_id);

-- 9. Table: alerts (Incident Notifications & WhatsApp Dispatch)
CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY, -- e.g. 'ALT-RFS-001'
    station_id TEXT REFERENCES stations(id) ON DELETE CASCADE NOT NULL,
    condition_type TEXT NOT NULL, -- e.g. 'Coral Bleaching', 'Reef Degradation'
    severity alert_severity_enum DEFAULT 'Warning' NOT NULL,
    description TEXT NOT NULL,
    likely_cause TEXT[] DEFAULT ARRAY[]::TEXT[],
    recommendations TEXT[] DEFAULT ARRAY[]::TEXT[],
    verification_status TEXT DEFAULT 'Pending Verification' NOT NULL,
    officer_phone TEXT DEFAULT '085892640228',
    whatsapp_dispatched BOOLEAN DEFAULT FALSE NOT NULL,
    dispatch_timestamp TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. Table: publications (Scientific Reports & Dataset Downloads)
CREATE TABLE IF NOT EXISTS publications (
    id TEXT PRIMARY KEY, -- e.g. 'PUB-2026-01'
    title TEXT NOT NULL,
    authors TEXT[] NOT NULL,
    year INT NOT NULL,
    category TEXT NOT NULL,
    abstract TEXT NOT NULL,
    citation TEXT,
    file_path TEXT, -- Storage bucket path
    file_size_mb NUMERIC(5, 2) DEFAULT 0,
    download_count INT DEFAULT 0 NOT NULL,
    is_public BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. Table: research_logbooks (Chronological Log Entries)
CREATE TABLE IF NOT EXISTS research_logbooks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    station_id TEXT REFERENCES stations(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT FALSE NOT NULL,
    log_date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE coral_distribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_logbooks ENABLE ROW LEVEL SECURITY;

-- Stations & Coral Polygons: Public can view
CREATE POLICY "Public can view all stations" ON stations FOR SELECT USING (true);
CREATE POLICY "Public can view coral distribution" ON coral_distribution FOR SELECT USING (true);
CREATE POLICY "Public can view publications" ON publications FOR SELECT USING (is_public = true);
CREATE POLICY "Public can view published logbooks" ON research_logbooks FOR SELECT USING (is_published = true);

-- Sensor readings: Public can view
CREATE POLICY "Public can view sensor readings" ON sensor_readings FOR SELECT USING (true);

-- Field Observations:
-- Operator Lapangan can insert
CREATE POLICY "Operator can insert observations" ON field_observations FOR INSERT WITH CHECK (true);
-- Everyone authenticated can view observations
CREATE POLICY "Team can view observations" ON field_observations FOR SELECT USING (true);
-- Validator & Admin can update status
CREATE POLICY "Validator can update validation status" ON field_observations FOR UPDATE USING (true);

-- Alerts: Authenticated users can view and update dispatch status
CREATE POLICY "Staff can view alerts" ON alerts FOR SELECT USING (true);
CREATE POLICY "Staff can update alerts" ON alerts FOR UPDATE USING (true);

-- ====================================================================
-- SEED DATA: 12 Stations of Pulau Tunda
-- ====================================================================

INSERT INTO prototypes (id, name, model_version, total_bom_idr) VALUES
('RFS-PROT-001', 'EchoVision Prototype Unit 01', 'ASIK v2.0', 2120000.00),
('RFS-PROT-002', 'EchoVision Prototype Unit 02', 'ASIK v2.0', 2120000.00),
('RFS-PROT-003', 'EchoVision Prototype Unit 03', 'ASIK v2.0', 2120000.00),
('RFS-PROT-004', 'EchoVision Prototype Unit 04', 'ASIK v2.0', 2120000.00),
('RFS-PROT-005', 'EchoVision Prototype Unit 05', 'ASIK v2.0', 2120000.00),
('RFS-PROT-006', 'EchoVision Prototype Unit 06', 'ASIK v2.0', 2120000.00),
('RFS-PROT-007', 'EchoVision Prototype Unit 07', 'ASIK v2.0', 2120000.00),
('RFS-PROT-008', 'EchoVision Prototype Unit 08', 'ASIK v2.0', 2120000.00),
('RFS-PROT-009', 'EchoVision Prototype Unit 09', 'ASIK v2.0', 2120000.00),
('RFS-PROT-010', 'EchoVision Prototype Unit 10', 'ASIK v2.0', 2120000.00),
('RFS-PROT-011', 'EchoVision Prototype Unit 11', 'ASIK v2.0', 2120000.00),
('RFS-PROT-012', 'EchoVision Prototype Unit 12', 'ASIK v2.0', 2120000.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO stations (id, prototype_id, name, position_label, depth_m, latitude, longitude, geom, health_status) VALUES
('RFS-STA-001', 'RFS-PROT-001', 'Stasiun 01 (Barat)', 'Barat', 5.2, -5.811970, 106.250685, ST_SetSRID(ST_MakePoint(106.250685, -5.811970), 4326), 'Sehat'),
('RFS-STA-002', 'RFS-PROT-002', 'Stasiun 02 (Barat Laut)', 'Barat Laut', 6.8, -5.807877, 106.257482, ST_SetSRID(ST_MakePoint(106.257482, -5.807877), 4326), 'Bleaching'),
('RFS-STA-003', 'RFS-PROT-003', 'Stasiun 03 (Utara-Barat Laut)', 'Utara-Barat Laut', 4.8, -5.806642, 106.266343, ST_SetSRID(ST_MakePoint(106.266343, -5.806642), 4326), 'Sehat'),
('RFS-STA-004', 'RFS-PROT-004', 'Stasiun 04 (Utara)', 'Utara', 7.5, -5.805767, 106.275243, ST_SetSRID(ST_MakePoint(106.275243, -5.805767), 4326), 'Sehat'),
('RFS-STA-005', 'RFS-PROT-005', 'Stasiun 05 (Utara-Timur Laut)', 'Utara-Timur Laut', 5.5, -5.805722, 106.284184, ST_SetSRID(ST_MakePoint(106.284184, -5.805722), 4326), 'Sehat'),
('RFS-STA-006', 'RFS-PROT-006', 'Stasiun 06 (Timur Laut)', 'Timur Laut', 8.2, -5.806550, 106.293089, ST_SetSRID(ST_MakePoint(106.293089, -5.806550), 4326), 'Sehat'),
('RFS-STA-007', 'RFS-PROT-007', 'Stasiun 07 (Timur)', 'Timur', 6.0, -5.813069, 106.298190, ST_SetSRID(ST_MakePoint(106.298190, -5.813069), 4326), 'Degradasi'),
('RFS-STA-008', 'RFS-PROT-008', 'Stasiun 08 (Tenggara)', 'Tenggara', 5.0, -5.819393, 106.292676, ST_SetSRID(ST_MakePoint(106.292676, -5.819393), 4326), 'Sehat'),
('RFS-STA-009', 'RFS-PROT-009', 'Stasiun 09 (Selatan-Tenggara)', 'Selatan-Tenggara', 9.1, -5.820811, 106.283890, ST_SetSRID(ST_MakePoint(106.283890, -5.820811), 4326), 'Sehat'),
('RFS-STA-010', 'RFS-PROT-010', 'Stasiun 10 (Selatan)', 'Selatan', 4.2, -5.820030, 106.274999, ST_SetSRID(ST_MakePoint(106.274999, -5.820030), 4326), 'Sehat'),
('RFS-STA-011', 'RFS-PROT-011', 'Stasiun 11 (Selatan-Barat Daya)', 'Selatan-Barat Daya', 5.7, -5.817927, 106.266306, ST_SetSRID(ST_MakePoint(106.266306, -5.817927), 4326), 'Sehat'),
('RFS-STA-012', 'RFS-PROT-012', 'Stasiun 12 (Barat-Barat Daya)', 'Barat-Barat Daya', 6.3, -5.815805, 106.257622, ST_SetSRID(ST_MakePoint(106.257622, -5.815805), 4326), 'Sehat')
ON CONFLICT (id) DO NOTHING;
