export type UserRole = 
  | 'admin' 
  | 'operator_lapangan' 
  | 'peneliti_ekologi' 
  | 'validator_data' 
  | 'public';

export type WorkspaceMode = 'public' | 'research' | 'admin';

export interface StationData {
  id: string;
  name: string;
  position_label: string;
  prototype_id: string;
  latitude: number;
  longitude: number;
  depth_m: number;
  temperature_c: number;
  salinity_psu: number;
  ph: number;
  dissolved_oxygen_mg_l: number;
  turbidity_ntu: number;
  status: 'Active' | 'Maintenance' | 'Offline';
  sound_level_db: number;
  health_status: 'Sehat' | 'Bleaching' | 'Degradasi';
  last_sync: string;
}

export interface PrototypeComponentPart {
  type: string;
  pos?: [number, number, number];
  rot?: [number, number, number];
  size?: number[];
  color?: string;
  texture?: string;
  metal?: number;
  opacity?: number;
  from?: [number, number, number];
  to?: [number, number, number];
  points?: [number, number, number][];
  edges?: boolean;
}

export interface PrototypeComponent {
  id: number;
  name: string;
  spec: string;
  price_rp: number;
  function: string;
  explode: [number, number, number];
  parts: PrototypeComponentPart[];
}

export interface CoralLifeForm {
  name: string;
  scientific_name: string;
  growth_form: string;
  description: string;
  optimal_temp_c: string;
  tolerance_notes: string;
  tunda_status: string;
  image_url: string;
  associated_fish: string[];
}

export interface FishSpecies {
  id: string;
  common_name: string;
  scientific_name: string;
  family: string;
  trophic_group: 'Herbivora' | 'Karnivora' | 'Omnivora' | 'Planktivora' | 'Koralivora';
  associated_coral_form: string;
  depth_range_m: string;
  abundance_per_100m2: number;
  ecological_role: string;
}

export interface FieldObservation {
  id: string;
  station_id: string;
  operator_name: string;
  date_time: string;
  depth_m: number;
  water_temp_c: number;
  turbidity_ntu: number;
  audio_file_name?: string;
  audio_duration_sec?: number;
  image_count: number;
  live_coral_cover_pct: number;
  notes: string;
  validation_status: 'Draft' | 'Pending Validation' | 'Approved' | 'Returned' | 'Rejected';
  validator_notes?: string;
  validator_name?: string;
}

export interface AlertNotification {
  id: string;
  station_id: string;
  condition_type: 'Coral Bleaching' | 'Low Fish Activity' | 'Reef Degradation' | 'Thermal Stress (DHW > 4)';
  severity: 'Warning' | 'High' | 'Critical';
  timestamp: string;
  description: string;
  likely_cause: string[];
  recommendations: string[];
  verification_status: 'Pending Verification' | 'Verified by Researcher' | 'Dispatched to Officer';
  officer_phone: string;
  whatsapp_dispatched: boolean;
  dispatch_timestamp?: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  authors: string[];
  year: number;
  category: 'Laporan Teknis' | 'Artikel Ilmiah' | 'Dataset Spasial' | 'Ringkasan Ekologi';
  abstract: string;
  citation: string;
  file_size_mb: number;
  download_count: number;
  is_public: boolean;
}

export interface ResearchLogbookEntry {
  id: string;
  date: string;
  title: string;
  station_id?: string;
  author: string;
  category: 'Ekspedisi Lapangan' | 'Pemasangan Sensor' | 'Pemeliharaan Hardware' | 'Analisis Laboratorium';
  content: string;
  is_published: boolean;
}
