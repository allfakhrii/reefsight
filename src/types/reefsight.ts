// REEFSIGHT Core Data Models & TypeScript Definitions
// Aligned with Pulau Tunda Marine Ecological Intelligence System Architecture

export type WorkspaceMode = 'public' | 'research' | 'admin';

export type UserRole =
  | 'public'
  | 'operator_lapangan'
  | 'peneliti_ekologi'
  | 'validator_data'
  | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  username: string;
  role: UserRole;
  institution?: string;
  position?: string;
  phone?: string;
  avatarUrl?: string;
  accountStatus: 'Active' | 'Pending' | 'Inactive';
  lastActivity?: string;
  createdAt: string;
}

// 12 Buoy Deployment Stations around Pulau Tunda
export interface Station {
  id: string;
  name: string;
  code: string; // e.g. "ASIK-01", "TUN-01"
  zone: 'North' | 'North-East' | 'East' | 'South-East' | 'South' | 'South-West' | 'West' | 'North-West';
  lat: number;
  lng: number;
  depthMeters: number;
  status: 'Operational' | 'Maintenance' | 'Planned';
  deviceId: string; // e.g. "EV-ASIK01"
  deviceType: 'EchoVision v1.0' | 'ReefCam v1.0' | 'EnviroSense v1.0';
  batteryPct: number;
  solarInputWatts: number;
  surfaceTempC: number;
  salinityPpt: number;
  ph: number;
  dissolvedOxygenMgL: number;
  turbidityNtu: number;
  lastPing: string;
  coralConditionSummary: 'Sehat' | 'Sedang' | 'Degradasi' | 'Bleaching';
}

// EchoVision 3D Hardware Prototype Component & BOM
export interface HardwareComponent3D {
  id: string;
  name: string;
  category: 'Structure' | 'Sensor' | 'Power' | 'Processing' | 'Communication';
  spec: string;
  unitPriceIdr: number;
  qty: number;
  totalPriceIdr: number;
  pos: [number, number, number];
  dimensions?: [number, number, number];
  color: string;
  description: string;
  role: string;
}

// Ecological Simulation Scenario
export interface EcologicalScenario {
  id: 'normal' | 'thermal_stress' | 'high_turbidity' | 'recovery';
  title: string;
  badge: string;
  tempAnomaly: number;
  turbidityNtu: number;
  fishActivityScore: number; // 0 - 100
  acousticAci: number; // Acoustic Complexity Index
  coralBleachingRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  description: string;
  recommendedAction: string;
}

// Field Observation Collection Record
export interface FieldObservation {
  id: string;
  collectionCode?: string;
  stationId?: string;
  station_id?: string;
  stationCode?: string;
  operatorId?: string;
  operatorName?: string;
  operator_name?: string;
  observationDate?: string;
  date_time?: string;
  timeWindow?: string;
  depthM?: number;
  depth_m?: number;
  deviceUsed?: string;
  collectionType?: string;
  fileCount?: number;
  fileSizeBytes?: number;
  audioRecordingUrl?: string;
  photoUrl?: string;
  liveCoralCoverPct?: number;
  live_coral_cover_pct?: number;
  deadCoralCoverPct?: number;
  tempC?: number;
  water_temp_c?: number;
  turbidityNtu?: number;
  turbidity_ntu?: number;
  audio_file_name?: string;
  audio_duration_sec?: number;
  image_count?: number;
  notes?: string;
  completenessPct?: number;
  validationStatus?: string;
  validation_status?: string;
  validationNotes?: string;
  validator_name?: string;
  validator_notes?: string;
  validatedBy?: string;
  validatedAt?: string;
}

// Ecological Anomaly Alert
export interface SystemAlert {
  id: string;
  alertCode: string; // "ALT-2025-0284"
  stationId: string;
  stationCode: string;
  stationName: string;
  detectedAt: string;
  alertType: 'Coral Bleaching' | 'Low Fish Activity' | 'Reef Degradation' | 'Environmental Anomaly' | 'Acoustic Anomaly';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  confidence: number; // e.g. 0.78
  status: 'Pending Review' | 'In Verification' | 'Verified' | 'Resolved';
  source: string;
  summary: string;
  possibleCauses: string[];
  recommendedActions: string[];
  whatsappDispatched: boolean;
  whatsappRecipient?: string;
  whatsappSentAt?: string;
}

// Biodiversity Species Catalog
export interface CoralSpecies {
  id: string;
  scientificName: string;
  commonName: string;
  family: string;
  growthForm: 'Branching' | 'Massive' | 'Encrusting' | 'Foliose' | 'Tabular' | 'Submassive';
  depthRangeM: string;
  abundancePulauTunda: 'Melimpah' | 'Umum' | 'Jarang';
  thermalToleranceC: string;
  imageUrl: string;
  description: string;
  associatedFishFamilies: string[];
}

export interface FishSpecies {
  id: string;
  scientific_name?: string;
  scientificName?: string;
  common_name?: string;
  localName?: string;
  family: string;
  trophic_group?: string;
  trophicGroup?: string;
  depth_range_m?: string;
  observedDepthM?: string;
  relativeAbundance?: string;
  abundance_per_100m2?: number;
  imageUrl?: string;
  image_url?: string;
  associated_coral_form?: string;
  associatedGrowthForms?: string[];
  ecological_role?: string;
}

// Eco-Tourism Zone Recommendation
export interface EcoTourismZone {
  id: string;
  name: string;
  code: string;
  category: 'Potential Diving Spot' | 'Potential Snorkeling Spot' | 'Conservation Zone' | 'Rehabilitation Zone' | 'Research Zone';
  depthRangeM: string;
  liveCoralPct: number;
  deadCoralPct: number;
  fishDiversityScore: number;
  visibilityM: string;
  currentVelocityMs: string;
  humanPressure: 'Rendah' | 'Sedang' | 'Tinggi';
  suitabilityStatus: 'Highly Suitable' | 'Suitable' | 'Conditional' | 'Restricted';
  rationale: string;
}

// Research Logbook Entry
export interface LogbookEntry {
  id: string;
  date: string;
  activityTitle: string;
  location: string;
  leadResearcher: string;
  stage: 'Persiapan' | 'Akuisisi Data Lapangan' | 'Kalibrasi' | 'Validasi' | 'Analisis';
  notes: string;
  imageUrl?: string;
  isPublishedPublic: boolean;
}

// Scientific Publication Document
export interface PublicationDocument {
  id: string;
  title: string;
  authors: string;
  year: number;
  category: 'Laporan Penelitian' | 'Artikel Ilmiah' | 'Dokumentasi Teknis' | 'Dataset Summary';
  abstract: string;
  pdfUrl: string;
  doi?: string;
  downloadCount: number;
}


// Compatibility Aliases for components and mock data
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
  health_status: 'Sehat' | 'Bleaching' | 'Degradasi' | 'Sedang';
  last_sync: string;
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

export interface AlertNotification {
  id: string;
  station_id: string;
  condition_type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  timestamp: string;
  description: string;
  likely_cause: string[];
  recommendations: string[];
  verification_status: string;
  officer_phone?: string;
  whatsapp_dispatched?: boolean;
  dispatch_timestamp?: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  authors: string[];
  year: number;
  category: string;
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
  category: string;
  content: string;
  is_published: boolean;
}


export interface PrototypeComponent {
  id: number;
  name: string;
  category: string;
  spec?: string;
  price_rp?: number;
  pos: number[];
  color?: string;
  explode?: number[];
  explode_dir?: number[];
  role?: string;
  function?: string;
  mesh_type?: string;
  dim?: number[];
  dimensions?: number[];
  description?: string;
  parts: any[];
}
