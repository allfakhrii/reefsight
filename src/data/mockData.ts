import { 
  StationData, 
  CoralLifeForm, 
  FishSpecies, 
  FieldObservation, 
  AlertNotification, 
  PublicationItem, 
  ResearchLogbookEntry 
} from '@/types/reefsight';

export const PULAU_TUNDA_STATIONS: StationData[] = [
  {
    id: 'RFS-STA-001',
    name: 'Stasiun 01 (Barat)',
    position_label: 'Barat',
    prototype_id: 'RFS-PROT-001',
    latitude: -5.811970,
    longitude: 106.250685,
    depth_m: 5.2,
    temperature_c: 28.5,
    salinity_psu: 33.1,
    ph: 8.1,
    dissolved_oxygen_mg_l: 6.7,
    turbidity_ntu: 1.1,
    status: 'Active',
    sound_level_db: -43.2,
    health_status: 'Sehat',
    last_sync: '10 Menit Lalu'
  },
  {
    id: 'RFS-STA-002',
    name: 'Stasiun 02 (Barat Laut)',
    position_label: 'Barat Laut',
    prototype_id: 'RFS-PROT-002',
    latitude: -5.807877,
    longitude: 106.257482,
    depth_m: 6.8,
    temperature_c: 29.8,
    salinity_psu: 33.4,
    ph: 8.0,
    dissolved_oxygen_mg_l: 6.1,
    turbidity_ntu: 2.3,
    status: 'Active',
    sound_level_db: -38.5,
    health_status: 'Bleaching',
    last_sync: '5 Menit Lalu'
  },
  {
    id: 'RFS-STA-003',
    name: 'Stasiun 03 (Utara-Barat Laut)',
    position_label: 'Utara-Barat Laut',
    prototype_id: 'RFS-PROT-003',
    latitude: -5.806642,
    longitude: 106.266343,
    depth_m: 4.8,
    temperature_c: 28.2,
    salinity_psu: 33.2,
    ph: 8.2,
    dissolved_oxygen_mg_l: 6.9,
    turbidity_ntu: 0.9,
    status: 'Active',
    sound_level_db: -45.0,
    health_status: 'Sehat',
    last_sync: '15 Menit Lalu'
  },
  {
    id: 'RFS-STA-004',
    name: 'Stasiun 04 (Utara)',
    position_label: 'Utara',
    prototype_id: 'RFS-PROT-004',
    latitude: -5.805767,
    longitude: 106.275243,
    depth_m: 7.5,
    temperature_c: 28.1,
    salinity_psu: 33.0,
    ph: 8.2,
    dissolved_oxygen_mg_l: 7.1,
    turbidity_ntu: 1.0,
    status: 'Active',
    sound_level_db: -46.2,
    health_status: 'Sehat',
    last_sync: '8 Menit Lalu'
  },
  {
    id: 'RFS-STA-005',
    name: 'Stasiun 05 (Utara-Timur Laut)',
    position_label: 'Utara-Timur Laut',
    prototype_id: 'RFS-PROT-005',
    latitude: -5.805722,
    longitude: 106.284184,
    depth_m: 5.5,
    temperature_c: 28.4,
    salinity_psu: 33.2,
    ph: 8.1,
    dissolved_oxygen_mg_l: 6.8,
    turbidity_ntu: 1.3,
    status: 'Active',
    sound_level_db: -42.0,
    health_status: 'Sehat',
    last_sync: '12 Menit Lalu'
  },
  {
    id: 'RFS-STA-006',
    name: 'Stasiun 06 (Timur Laut)',
    position_label: 'Timur Laut',
    prototype_id: 'RFS-PROT-006',
    latitude: -5.806550,
    longitude: 106.293089,
    depth_m: 8.2,
    temperature_c: 28.6,
    salinity_psu: 33.5,
    ph: 8.0,
    dissolved_oxygen_mg_l: 6.5,
    turbidity_ntu: 1.5,
    status: 'Active',
    sound_level_db: -41.2,
    health_status: 'Sehat',
    last_sync: '20 Menit Lalu'
  },
  {
    id: 'RFS-STA-007',
    name: 'Stasiun 07 (Timur)',
    position_label: 'Timur',
    prototype_id: 'RFS-PROT-007',
    latitude: -5.813069,
    longitude: 106.298190,
    depth_m: 6.0,
    temperature_c: 29.2,
    salinity_psu: 33.1,
    ph: 7.9,
    dissolved_oxygen_mg_l: 5.8,
    turbidity_ntu: 3.1,
    status: 'Maintenance',
    sound_level_db: -35.0,
    health_status: 'Degradasi',
    last_sync: '1 Jam Lalu'
  },
  {
    id: 'RFS-STA-008',
    name: 'Stasiun 08 (Tenggara)',
    position_label: 'Tenggara',
    prototype_id: 'RFS-PROT-008',
    latitude: -5.819393,
    longitude: 106.292676,
    depth_m: 5.0,
    temperature_c: 28.3,
    salinity_psu: 33.3,
    ph: 8.1,
    dissolved_oxygen_mg_l: 6.7,
    turbidity_ntu: 1.4,
    status: 'Active',
    sound_level_db: -44.1,
    health_status: 'Sehat',
    last_sync: '14 Menit Lalu'
  },
  {
    id: 'RFS-STA-009',
    name: 'Stasiun 09 (Selatan-Tenggara)',
    position_label: 'Selatan-Tenggara',
    prototype_id: 'RFS-PROT-009',
    latitude: -5.820811,
    longitude: 106.283890,
    depth_m: 9.1,
    temperature_c: 28.0,
    salinity_psu: 33.5,
    ph: 8.2,
    dissolved_oxygen_mg_l: 7.0,
    turbidity_ntu: 1.1,
    status: 'Active',
    sound_level_db: -47.0,
    health_status: 'Sehat',
    last_sync: '7 Menit Lalu'
  },
  {
    id: 'RFS-STA-010',
    name: 'Stasiun 10 (Selatan)',
    position_label: 'Selatan',
    prototype_id: 'RFS-PROT-010',
    latitude: -5.820030,
    longitude: 106.274999,
    depth_m: 4.2,
    temperature_c: 28.7,
    salinity_psu: 33.2,
    ph: 8.1,
    dissolved_oxygen_mg_l: 6.6,
    turbidity_ntu: 1.7,
    status: 'Active',
    sound_level_db: -43.0,
    health_status: 'Sehat',
    last_sync: '18 Menit Lalu'
  },
  {
    id: 'RFS-STA-011',
    name: 'Stasiun 11 (Selatan-Barat Daya)',
    position_label: 'Selatan-Barat Daya',
    prototype_id: 'RFS-PROT-011',
    latitude: -5.817927,
    longitude: 106.266306,
    depth_m: 5.7,
    temperature_c: 28.4,
    salinity_psu: 33.3,
    ph: 8.1,
    dissolved_oxygen_mg_l: 6.8,
    turbidity_ntu: 1.2,
    status: 'Active',
    sound_level_db: -44.5,
    health_status: 'Sehat',
    last_sync: '3 Menit Lalu'
  },
  {
    id: 'RFS-STA-012',
    name: 'Stasiun 12 (Barat-Barat Daya)',
    position_label: 'Barat-Barat Daya',
    prototype_id: 'RFS-PROT-012',
    latitude: -5.815805,
    longitude: 106.257622,
    depth_m: 6.3,
    temperature_c: 28.5,
    salinity_psu: 33.2,
    ph: 8.1,
    dissolved_oxygen_mg_l: 6.9,
    turbidity_ntu: 1.0,
    status: 'Active',
    sound_level_db: -43.9,
    health_status: 'Sehat',
    last_sync: '9 Menit Lalu'
  }
];

export const CORAL_LIFE_FORMS: CoralLifeForm[] = [
  {
    name: 'Acropora Branching',
    scientific_name: 'Acropora formosa / Acropora sp.',
    growth_form: 'Branching (Bercabang)',
    description: 'Koloni bercabang tegak menyerupai tanduk rusa dengan pertumbuhan cepat. Menjadi habitat utama perlindungan bagi juvenile ikan karang.',
    optimal_temp_c: '25°C – 28.5°C',
    tolerance_notes: 'Rentan terhadap tekanan panas (thermal stress); merupakan jenis yang pertama kali memutih saat kenaikan suhu.',
    tunda_status: 'Ditemukan melimpah di lereng terumbu (reef slope) bagian utara dan barat Pulau Tunda.',
    image_url: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=600&q=80',
    associated_fish: ['Chromis viridis (Damselfish)', 'Dascyllus aruanus', 'Chaetodon trifascialis']
  },
  {
    name: 'Acropora Tabulate',
    scientific_name: 'Acropora hyacinthus / Acropora clathrata',
    growth_form: 'Tabulate (Meja)',
    description: 'Koloni melebar horizontal membentuk struktur menyerupai meja datar bertingkat dengan kanopi luas penangkap sinar matahari.',
    optimal_temp_c: '25°C – 28.8°C',
    tolerance_notes: 'Toleransi sedang terhadap arus kuat; rentan terhadap sedimentasi dan patahan mekanik.',
    tunda_status: 'Dominan di perairan dangkal rataan terumbu (reef flat) utara Pulau Tunda.',
    image_url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=600&q=80',
    associated_fish: ['Chaetodon lunula', 'Pomacanthus semicirculatus', 'Lethrinus harak']
  },
  {
    name: 'Coral Massive',
    scientific_name: 'Porites lutea / Favia speciosa',
    growth_form: 'Massive (Gumpalan Bongkah)',
    description: 'Koloni menggumpal membulat menyerupai kubah besar batu karang keras. Berumur panjang (ratusan tahun) dan laju pertumbuhan lambat (~1 cm/tahun).',
    optimal_temp_c: '24°C – 29.5°C',
    tolerance_notes: 'Resistensi tinggi terhadap fluktuasi suhu dan kekeruhan air berkat jaringan epitel yang tebal.',
    tunda_status: 'Banyak ditemukan di daerah laguna dan perairan dekat pelabuhan Pulau Tunda.',
    image_url: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=600&q=80',
    associated_fish: ['Scarus rivulatus (Parrotfish)', 'Acanthurus triostegus', 'Cephalopholis boenak']
  },
  {
    name: 'Coral Foliose',
    scientific_name: 'Montipora foliosa / Turbinaria reniformis',
    growth_form: 'Foliose (Lembaran / Daun)',
    description: 'Koloni berupa lempengan berlipat menyerupai kelopak bunga atau dedaunan bertingkat, memaksimalkan absorpsi cahaya di air keruh.',
    optimal_temp_c: '25°C – 29.0°C',
    tolerance_notes: 'Cenderung dapat hidup pada kedalaman 6–12 meter dengan intensitas cahaya lebih rendah.',
    tunda_status: 'Tercatat di perairan lereng timur dan tenggara Pulau Tunda.',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    associated_fish: ['Abudefduf sexfasciatus', 'Amphiprion ocellaris', 'Siganus virgatus']
  },
  {
    name: 'Coral Encrusting',
    scientific_name: 'Montipora tuberculosa / Leptastrea purpurea',
    growth_form: 'Encrusting (Kerak Melapisi)',
    description: 'Bentuk pertumbuhan yang menempel dan melapisi batuan dasar atau pecahan karang mati, memperkuat struktur substrat bawah laut.',
    optimal_temp_c: '24°C – 30.0°C',
    tolerance_notes: 'Sangat tangguh terhadap hempasan gelombang kencang di perairan dangkal terbuka.',
    tunda_status: 'Pionir rekrutmen anakan karang pada zona transisi barat daya Pulau Tunda.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    associated_fish: ['Ecsenius yaeyamaensis (Blenny)', 'Cirrhitichthys falco', 'Gobiodon citrinus']
  },
  {
    name: 'Coral Submassive',
    scientific_name: 'Pocillopora verrucosa / Stylophora pistillata',
    growth_form: 'Submassive (Semi-Bongkah Bertonjolan)',
    description: 'Koloni semi-gumpalan dengan pilar-pilar cabang pendek berujung tumpul yang kokoh menahan arus laut sedang.',
    optimal_temp_c: '25°C – 29.2°C',
    tolerance_notes: 'Kemampuan adaptasi baik pada arus pasang surut dinamis Selat Sunda.',
    tunda_status: 'Tersebar di rataan terumbu dangkal selatan Pulau Tunda.',
    image_url: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=600&q=80',
    associated_fish: ['Paracanthurus hepatus', 'Labroides dimidiatus', 'Pseudanthias squamipinnis']
  }
];

export const REEF_FISH_CATALOG: FishSpecies[] = [
  {
    id: 'FISH-01',
    common_name: 'Kepe-kepe Garis Biru (Butterflyfish)',
    scientific_name: 'Chaetodon trifascialis',
    family: 'Chaetodontidae',
    trophic_group: 'Koralivora',
    associated_coral_form: 'Acropora Tabulate & Branching',
    depth_range_m: '2 – 8 m',
    abundance_per_100m2: 14,
    ecological_role: 'Indikator bio-indikator kesehatan karang hidup; memakan polip karang aktif.'
  },
  {
    id: 'FISH-02',
    common_name: 'Ikan Kakatua (Rivulated Parrotfish)',
    scientific_name: 'Scarus rivulatus',
    family: 'Scaridae',
    trophic_group: 'Herbivora',
    associated_coral_form: 'Coral Massive & Dead Coral with Algae',
    depth_range_m: '3 – 12 m',
    abundance_per_100m2: 28,
    ecological_role: 'Mengontrol pertumbuhan alga (macroalgae) pada karang mati agar larva anakan karang dapat menempel.'
  },
  {
    id: 'FISH-03',
    common_name: 'Kerapu Karang (Chocolate Grouper)',
    scientific_name: 'Cephalopholis boenak',
    family: 'Serranidae',
    trophic_group: 'Karnivora',
    associated_coral_form: 'Coral Massive & Submassive',
    depth_range_m: '4 – 15 m',
    abundance_per_100m2: 6,
    ecological_role: 'Predator puncak menjaga keseimbangan populasi krustasea dan ikan-ikan kecil di terumbu.'
  },
  {
    id: 'FISH-04',
    common_name: 'Damselfish Biru-Hijau',
    scientific_name: 'Chromis viridis',
    family: 'Pomacentridae',
    trophic_group: 'Planktivora',
    associated_coral_form: 'Acropora Branching',
    depth_range_m: '1 – 6 m',
    abundance_per_100m2: 85,
    ecological_role: 'Menyaring zooplankton perairan dan menyuplai nutrien amonium ke polip karang inang.'
  },
  {
    id: 'FISH-05',
    common_name: 'Ikan Baronang Lingkis (Rabbitfish)',
    scientific_name: 'Siganus virgatus',
    family: 'Siganidae',
    trophic_group: 'Herbivora',
    associated_coral_form: 'Coral Foliose & Submassive',
    depth_range_m: '2 – 10 m',
    abundance_per_100m2: 22,
    ecological_role: 'Pemakan alga bentik dan rumput laut penutup permukaan karang.'
  },
  {
    id: 'FISH-06',
    common_name: 'Ikan Bidadari Cincin Enam (Six-banded Angelfish)',
    scientific_name: 'Pomacanthus sexstriatus',
    family: 'Pomacanthidae',
    trophic_group: 'Omnivora',
    associated_coral_form: 'Acropora Tabulate & Massive',
    depth_range_m: '5 – 18 m',
    abundance_per_100m2: 8,
    ecological_role: 'Memakan spons laut (sponge) dan alga, mencegah spons menutupi koloni karang hidup.'
  }
];

export const MOCK_FIELD_OBSERVATIONS: FieldObservation[] = [
  {
    id: 'OBS-2026-081',
    station_id: 'RFS-STA-002',
    operator_name: 'Fakhri (Operator Lapangan)',
    date_time: '2026-11-08 09:30 WIB',
    depth_m: 6.8,
    water_temp_c: 29.8,
    turbidity_ntu: 2.3,
    audio_file_name: 'hydrophone_sta02_bleaching_20261108.wav',
    audio_duration_sec: 180,
    image_count: 14,
    live_coral_cover_pct: 38.4,
    notes: 'Terdeteksi pemutihan parsial pada koloni Acropora tabulate. Suara snapping shrimp di rekaman hydrophone menurun drastis dibanding bulan lalu.',
    validation_status: 'Pending Validation'
  },
  {
    id: 'OBS-2026-080',
    station_id: 'RFS-STA-001',
    operator_name: 'Darmawan (Operator Lapangan)',
    date_time: '2026-11-07 14:15 WIB',
    depth_m: 5.2,
    water_temp_c: 28.5,
    turbidity_ntu: 1.1,
    audio_file_name: 'hydrophone_sta01_healthy_20261107.wav',
    audio_duration_sec: 300,
    image_count: 22,
    live_coral_cover_pct: 54.2,
    notes: 'Kondisi karang sangat sehat, aktivitas kawanan Chromis viridis sangat aktif. Perekaman akustik berjalan mulus selama 5 menit.',
    validation_status: 'Approved',
    validator_name: 'Dr. Ilham (Validator Data)',
    validator_notes: 'Data koordinat, citra optik, dan file akustik lengkap dan valid. Siap dipublikasikan ke Public Workspace.'
  },
  {
    id: 'OBS-2026-079',
    station_id: 'RFS-STA-007',
    operator_name: 'Fakhri (Operator Lapangan)',
    date_time: '2026-11-06 11:00 WIB',
    depth_m: 6.0,
    water_temp_c: 29.2,
    turbidity_ntu: 3.1,
    image_count: 8,
    live_coral_cover_pct: 31.5,
    notes: 'Kerusakan mekanik terumbu akibat jangkar perahu nelayan lokal. Perlu koordinasi zonasi konservasi.',
    validation_status: 'Returned',
    validator_name: 'Dr. Ilham (Validator Data)',
    validator_notes: 'File audio akustik belum terunggah. Mohon unggah ulang rekaman hydrophone sebelum disetujui.'
  }
];

export const MOCK_ALERTS: AlertNotification[] = [
  {
    id: 'ALT-RFS-001',
    station_id: 'RFS-STA-002',
    condition_type: 'Coral Bleaching',
    severity: 'High',
    timestamp: '2026-11-08 09:42 WIB',
    description: 'Suhu air laut terdeteksi melampaui ambang batas batas bulanan normal (MMM + 1.2°C). Indikasi stres termal dan pemutihan karang aktif.',
    likely_cause: [
      'Anomali kenaikan suhu permukaan laut (SST anomaly)',
      'Intensitas radiasi UV tinggi selama 14 hari berturut-turut',
      'Arus sirkulasi air tenang lokal di teluk barat laut'
    ],
    recommendations: [
      'Lakukan transek penyelaman optik untuk konfirmasi persentase koloni terdampak',
      'Kirim notifikasi peringatan ke petugas patroli lapangan Pulau Tunda',
      'Batasi aktivitas ekowisata snorkeling di zona RFS-STA-002 sementara waktu'
    ],
    verification_status: 'Verified by Researcher',
    officer_phone: '085892640228',
    whatsapp_dispatched: true,
    dispatch_timestamp: '2026-11-08 10:15 WIB'
  },
  {
    id: 'ALT-RFS-002',
    station_id: 'RFS-STA-007',
    condition_type: 'Reef Degradation',
    severity: 'Critical',
    timestamp: '2026-11-06 11:30 WIB',
    description: 'Penurunan indeks bioakustik (ACI < 0.31) dan peningkatan karang patah/mati akibat tekanan aktivitas perahu.',
    likely_cause: [
      'Penyandaran jangkar perahu di luar titik mooring buoy resmi',
      'Sedimentasi lokal meningkat (turbidity > 3.0 NTU)'
    ],
    recommendations: [
      'Pasang buoy penanda larangan sandar jangkar',
      'Jadwalkan program transplantasi dan pembuatan terumbu buatan (artificial reef)'
    ],
    verification_status: 'Pending Verification',
    officer_phone: '085892640228',
    whatsapp_dispatched: false
  }
];

export const MOCK_PUBLICATIONS: PublicationItem[] = [
  {
    id: 'PUB-2026-01',
    title: 'Struktur Komunitas dan Penilaian Bioakustik Terumbu Karang Menggunakan EchoVision di Pulau Tunda, Banten',
    authors: ['Tim Peneliti REEFSIGHT', 'Laboratorium Oseanografi & Biosains Kelautan'],
    year: 2026,
    category: 'Artikel Ilmiah',
    abstract: 'Penelitian ini memaparkan integrasi sensor bioakustik hydrophone bawah air dan pengolahan citra optik terumbu karang di 12 stasiun Pulau Tunda. Hasil menunjukkan korelasi signifikan antara Acoustic Complexity Index (ACI) dengan tutupan karang hidup (R² = 0.78, p < 0.01).',
    citation: 'REEFSIGHT Research Group. (2026). Eco-Intelligence Bioacoustics Assessment in Pulau Tunda. Marine Science Journal Indonesia, 14(2), 112-128.',
    file_size_mb: 4.8,
    download_count: 142,
    is_public: true
  },
  {
    id: 'PUB-2025-02',
    title: 'Laporan Teknis Rancang Bangun Prototipe EchoVision (ASIK v2.0) Pemantauan Terumbu Karang Nirawak',
    authors: ['Tim Hardware & IoT REEFSIGHT'],
    year: 2025,
    category: 'Laporan Teknis',
    abstract: 'Dokumentasi komprehensif arsitektur mekanik, modul daya panel surya 20 Wp, unit pemrosesan sensor akustik, kamera optik tahan kedalaman 20m, dan komunikasi nirkabel berbasis LoRa/Seluler.',
    citation: 'REEFSIGHT Engineering Tech Report No. TR-2025-01. Serang, Banten.',
    file_size_mb: 8.2,
    download_count: 289,
    is_public: true
  },
  {
    id: 'PUB-2025-03',
    title: 'Dataset Spasial Tutupan Karang dan Parameter Oseanografi Pulau Tunda 2020–2025 (GeoJSON & NetCDF)',
    authors: ['Tim Data Geospasial REEFSIGHT'],
    year: 2025,
    category: 'Dataset Spasial',
    abstract: 'Kompilasi dataset spasial GeoJSON tutupan karang hasil interpretasi citra satelit dan validasi lapangan ArcGIS, serta deret waktu suhu permukaan laut (SST) dan konsentrasi Klorofil-a bulanan.',
    citation: 'REEFSIGHT Open Marine Spatial Data Repository. Pulau Tunda Banten Dataset v2.',
    file_size_mb: 18.5,
    download_count: 512,
    is_public: true
  }
];

export const MOCK_RESEARCH_LOGBOOKS: ResearchLogbookEntry[] = [
  {
    id: 'LOG-001',
    date: '2026-11-05',
    title: 'Ekspedisi Penempatan Prototipe EchoVision di Stasiun RFS-STA-001 s/d 004',
    station_id: 'RFS-STA-001',
    author: 'Operator Lapangan & Tim Riset',
    category: 'Pemasangan Sensor',
    content: 'Pemasangan 4 unit buoy pemantau EchoVision di sisi utara dan barat Pulau Tunda berhasil dilaksanakan. Seluruh sensor hydrophone dan kamera optik mengirimkan telemetri perdana secara stabil ke dashboard.',
    is_published: true
  },
  {
    id: 'LOG-002',
    date: '2026-10-28',
    title: 'Pengambilan Sampel Air dan Pengukuran Profil Oseanografi (SST, pH, Salinitas)',
    author: 'Peneliti Ekologi',
    category: 'Ekspedisi Lapangan',
    content: 'Pengukuran insitu kualitas perairan pada 12 titik buoy. Rata-rata suhu permukaan laut tercatat 28.4°C dengan kejernihan air berkisar 0.9–1.8 NTU, sangat ideal untuk pemantauan optik bentik.',
    is_published: true
  },
  {
    id: 'LOG-003',
    date: '2026-10-15',
    title: 'Kalibrasi Algoritma Deteksi Spektrogram Bioakustik dan Pengujian Akustik di Kolam Uji',
    author: 'Tim Komputasi Sains',
    category: 'Analisis Laboratorium',
    content: 'Penyempurnaan perhitungan Acoustic Complexity Index (ACI) untuk memisahkan suara biota laut dari noise gelombang permukaan laut dangkal.',
    is_published: true
  }
];
