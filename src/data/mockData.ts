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
    scientific_name: 'Acropora formosa / Acropora nobilis',
    growth_form: 'Branching (Bercabang)',
    description: 'Koloni bercabang tegak menyerupai tanduk rusa dengan cabang memanjang dan pertumbuhan relatif cepat. Menyediakan celah perlindungan bagi ikan kecil dan juvenile.',
    optimal_temp_c: '26.0°C – 29.0°C',
    tolerance_notes: 'Acropora nobilis tercatat dominan di lereng karang Pulau Tunda. Rentan terhadap kenaikan anomali termal laut.',
    tunda_status: 'Tercatat dalam kajian ekologi Pulau Tunda dengan sebaran luas di lereng utara dan barat.',
    image_url: '/images/biodiversity/branching.jpg',
    associated_fish: ['Chromis viridis (Damselfish)', 'Dascyllus trimaculatus', 'Chaetodon trifascialis']
  },
  {
    name: 'Acropora Tabulate',
    scientific_name: 'Acropora hyacinthus / Acropora clathrata',
    growth_form: 'Tabulate (Meja)',
    description: 'Koloni melebar horizontal membentuk struktur menyerupai meja datar bertingkat dengan kanopi luas penangkap sinar matahari.',
    optimal_temp_c: '26.0°C – 28.5°C',
    tolerance_notes: 'Toleransi sedang terhadap arus; rentan terhadap sedimentasi dan patahan gelombang badai.',
    tunda_status: 'Kategori terumbu meja penting dalam pemetaan bentik rataan terumbu Pulau Tunda.',
    image_url: '/images/biodiversity/branching.jpg',
    associated_fish: ['Chaetodon trifascialis', 'Pomacanthus sexstriatus', 'Chromis viridis']
  },
  {
    name: 'Coral Massive',
    scientific_name: 'Porites lutea / Goniastrea sp.',
    growth_form: 'Massive (Gumpalan Bongkah)',
    description: 'Koloni menggumpal membulat menyerupai kubah dengan struktur kapur kokoh. Goniastrea sp. merupakan takson dominan terumbu Pulau Tunda.',
    optimal_temp_c: '26.0°C – 29.5°C',
    tolerance_notes: 'Resistensi tinggi terhadap fluktuasi suhu dan kekeruhan air berkat jaringan epitel yang tebal.',
    tunda_status: 'Goniastrea sp. terkonfirmasi dan dilaporkan dominan pada lokasi penelitian Pulau Tunda.',
    image_url: '/images/biodiversity/massive.jpg',
    associated_fish: ['Scarus rivulatus (Ikan Kakatua)', 'Cephalopholis boenak (Kerapu)', 'Acanthurus sp.']
  },
  {
    name: 'Coral Foliose',
    scientific_name: 'Montipora foliosa / Montipora capricornis',
    growth_form: 'Foliose (Lembaran / Daun)',
    description: 'Koloni membentuk lembaran berlipat menyerupai daun atau kelopak bertingkat, memaksimalkan absorpsi cahaya pada perairan lereng.',
    optimal_temp_c: '26.0°C – 29.0°C',
    tolerance_notes: 'Montipora capricornis tercatat dalam penelitian Pulau Tunda dan termasuk taksa dengan sebaran luas.',
    tunda_status: 'Tercatat di perairan lereng timur dan tenggara Pulau Tunda (kedalaman 3–18 m).',
    image_url: '/images/biodiversity/foliose.jpg',
    associated_fish: ['Siganus virgatus (Baronang)', 'Chromis viridis', 'Pomacanthus sexstriatus']
  },
  {
    name: 'Coral Encrusting',
    scientific_name: 'Montipora tuberculosa / Leptastrea purpurea',
    growth_form: 'Encrusting (Kerak Melapisi)',
    description: 'Koloni menempel dan melapisi batuan dasar atau pecahan karang keras, memperkuat substrat dan menahan erosi dasar laut.',
    optimal_temp_c: '26.0°C – 30.0°C',
    tolerance_notes: 'Sangat tangguh terhadap hempasan gelombang kencang di perairan dangkal terbuka.',
    tunda_status: 'Pionir rekrutmen koloni karang pada zona transisi barat daya Pulau Tunda.',
    image_url: '/images/biodiversity/encrusting.jpg',
    associated_fish: ['Ecsenius sp. (Blenny)', 'Cirrhitichthys falco', 'Gobiodon sp.']
  },
  {
    name: 'Coral Submassive',
    scientific_name: 'Pocillopora verrucosa / Stylophora pistillata',
    growth_form: 'Submassive (Semi-Gumpalan Percabangan Pendek)',
    description: 'Koloni berbentuk semi-gumpalan dengan percabangan pendek dan rapat, membentuk mikrohabitat bagi ikan kecil dan invertebrata.',
    optimal_temp_c: '27.0°C – 29.5°C',
    tolerance_notes: 'Struktur cabang kokoh menahan dinamika arus pasang surut Selat Sunda.',
    tunda_status: 'Tersebar di rataan terumbu dangkal selatan dan barat Pulau Tunda (2–15 m).',
    image_url: '/images/biodiversity/branching.jpg',
    associated_fish: ['Cephalopholis boenak', 'Pomacanthus sexstriatus', 'Siganus virgatus']
  }
];

export const REEF_FISH_CATALOG: FishSpecies[] = [
  {
    id: 'FISH-01',
    common_name: 'Kepe-kepe Garis Biru (Butterflyfish)',
    scientific_name: 'Chaetodon trifascialis',
    family: 'Chaetodontidae',
    trophic_group: 'Koralivora',
    associated_coral_form: 'Acropora Tabulate & Acropora Branching',
    depth_range_m: '2 – 15 m',
    abundance_per_100m2: 14,
    image_url: '/images/biodiversity/kepe-kepe.jpg',
    ecological_role: 'Koralivora obligat pemakan polip Acropora hidup; bio-indikator utama kesehatan terumbu karang.'
  },
  {
    id: 'FISH-02',
    common_name: 'Ikan Kakatua (Rivulated Parrotfish)',
    scientific_name: 'Scarus rivulatus',
    family: 'Scaridae',
    trophic_group: 'Herbivora',
    associated_coral_form: 'Coral Massive & Dead Coral with Algae',
    depth_range_m: '1 – 30 m',
    abundance_per_100m2: 28,
    image_url: '/images/biodiversity/ikan-kakatua.jpg',
    ecological_role: 'Mengikis alga dan material organik substrat untuk membuka ruang penempelan larva anakan karang baru.'
  },
  {
    id: 'FISH-03',
    common_name: 'Kerapu Karang (Chocolate Grouper)',
    scientific_name: 'Cephalopholis boenak',
    family: 'Serranidae',
    trophic_group: 'Karnivora',
    associated_coral_form: 'Coral Massive & Coral Submassive',
    depth_range_m: '4 – 30 m',
    abundance_per_100m2: 6,
    image_url: '/images/biodiversity/kerapu-karang.jpg',
    ecological_role: 'Predator terumbu pemangsa krustasea dan ikan kecil; menjaga keseimbangan rantai trofik terumbu.'
  },
  {
    id: 'FISH-04',
    common_name: 'Damselfish Biru-Hijau',
    scientific_name: 'Chromis viridis',
    family: 'Pomacentridae',
    trophic_group: 'Planktivora',
    associated_coral_form: 'Acropora Branching & Tabulate',
    depth_range_m: '1 – 15 m',
    abundance_per_100m2: 85,
    image_url: '/images/biodiversity/damselfish.jpg',
    ecological_role: 'Hidup berkelompok di atas koloni karang bercabang; memangsa zooplankton dan menyuplai nutrien amonium.'
  },
  {
    id: 'FISH-05',
    common_name: 'Ikan Baronang Lingkis (Rabbitfish)',
    scientific_name: 'Siganus virgatus',
    family: 'Siganidae',
    trophic_group: 'Herbivora',
    associated_coral_form: 'Coral Foliose & Submassive',
    depth_range_m: '0 – 12 m',
    abundance_per_100m2: 22,
    image_url: '/images/biodiversity/baronang.jpg',
    ecological_role: 'Mengendalikan tutupan alga bentik pada substrat karang berbatu dan rataan terumbu Pulau Tunda.'
  },
  {
    id: 'FISH-06',
    common_name: 'Ikan Bidadari Cincin Enam (Six-banded Angelfish)',
    scientific_name: 'Pomacanthus sexstriatus',
    family: 'Pomacanthidae',
    trophic_group: 'Omnivora',
    associated_coral_form: 'Acropora Tabulate & Massive',
    depth_range_m: '3 – 30 m',
    abundance_per_100m2: 8,
    image_url: '/images/biodiversity/ikan-bidadari.jpg',
    ecological_role: 'Memakan spons laut (sponge) dan invertebrata bentik agar tidak menginvasi koloni karang hidup.'
  }
];

export const MACROBENTHOS_CATALOG = [
  {
    id: 'BENTH-01',
    name: 'Echinodermata Terumbu Karang',
    taxa: 'Linckia laevigata, Diadema setosum, Culcita novaeguineae',
    role: 'Bintang laut biru pemakan biofilm, bulu babi pengontrol alga bentik, dan bintang bantal.',
    depth: '1 – 18 m',
    image_url: '/images/biodiversity/echinodermata.jpg',
  },
  {
    id: 'BENTH-02',
    name: 'Moluska & Kima Raksasa',
    taxa: 'Tridacna gigas / Tridacna squamosa, Gastropoda',
    role: 'Bio-filter air laut dengan simbiosis alga zooxanthellae dan pembentuk deposit kalsium karbonat.',
    depth: '2 – 15 m',
    image_url: '/images/biodiversity/moluska.jpg',
  }
];

export const PULAU_TUNDA_TRANSECT_PHOTOS = [
  { id: 'TR-01', file: '/images/coral-surveys/tunda_transect_01.jpg', station: 'ASIK-01 (Barat)', title: 'Survei Transek Karang Cabang Pulau Tunda #1', condition: 'Sehat (HC > 55%)' },
  { id: 'TR-02', file: '/images/coral-surveys/tunda_transect_02.jpg', station: 'ASIK-02 (Barat Laut)', title: 'Monitoring Substrat Karang Massive #2', condition: 'Sedang (HC 42%)' },
  { id: 'TR-03', file: '/images/coral-surveys/tunda_transect_03.jpg', station: 'ASIK-03 (Utara-Barat)', title: 'Inspeksi Tutupan Karang Daun (Foliose) #3', condition: 'Sehat (HC 58%)' },
  { id: 'TR-04', file: '/images/coral-surveys/tunda_transect_04.jpg', station: 'ASIK-04 (Utara)', title: 'Dokumentasi Underwater Transek #4', condition: 'Sehat (HC 62%)' },
  { id: 'TR-05', file: '/images/coral-surveys/tunda_transect_05.jpg', station: 'ASIK-05 (Utara-Timur)', title: 'Survei Rekrutmen Karang Encrusting #5', condition: 'Sehat (HC 54%)' },
  { id: 'TR-06', file: '/images/coral-surveys/tunda_transect_06.jpg', station: 'ASIK-06 (Timur Laut)', title: 'Pengamatan Komunitas Terumbu Karang #6', condition: 'Sedang (HC 48%)' },
  { id: 'TR-07', file: '/images/coral-surveys/tunda_transect_07.jpg', station: 'ASIK-07 (Timur)', title: 'Kondisi Koloni Karang Massive Goniastrea #7', condition: 'Sedang (HC 38%)' },
  { id: 'TR-08', file: '/images/coral-surveys/tunda_transect_08.jpg', station: 'ASIK-08 (Tenggara)', title: 'Survei Bawah Air Mooring Buoy #8', condition: 'Sehat (HC 51%)' },
  { id: 'TR-09', file: '/images/coral-surveys/tunda_transect_09.jpg', station: 'ASIK-09 (Selatan-Tenggara)', title: 'Transek Kuadrat 1x1m Substrat Terumbu #9', condition: 'Sedang (HC 40%)' },
  { id: 'TR-10', file: '/images/coral-surveys/tunda_transect_10.jpg', station: 'ASIK-10 (Selatan)', title: 'Inspeksi Kerusakan Mekanik Karang #10', condition: 'Bleaching / Sedang' },
  { id: 'TR-11', file: '/images/coral-surveys/tunda_transect_11.jpg', station: 'ASIK-11 (Selatan-Barat)', title: 'Pengambilan Sampel Sensor Bawah Air #11', condition: 'Degradasi (HC 24%)' },
  { id: 'TR-12', file: '/images/coral-surveys/tunda_transect_12.jpg', station: 'ASIK-12 (Barat Daya)', title: 'Monitoring Pemulihan Karang Pionir #12', condition: 'Pemulihan (HC 35%)' },
  { id: 'TR-13', file: '/images/coral-surveys/tunda_transect_13.jpg', station: 'ASIK-01 (Barat)', title: 'Dokumentasi Makrobentos & Biota Asosiasi #13', condition: 'Sehat' },
  { id: 'TR-14', file: '/images/coral-surveys/tunda_transect_14.jpg', station: 'ASIK-04 (Utara)', title: 'Tutupan Karang Acropora Nobilis #14', condition: 'Sehat (HC > 65%)' },
  { id: 'TR-15', file: '/images/coral-surveys/tunda_transect_15.jpg', station: 'ASIK-06 (Timur Laut)', title: 'Kerapatan Koloni Karang Otak Favites #15', condition: 'Sedang' },
  { id: 'TR-16', file: '/images/coral-surveys/tunda_transect_16.jpg', station: 'ASIK-08 (Tenggara)', title: 'Zona Pemulihan Terumbu Karang Buatan #16', condition: 'Sehat' },
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


// Additional Mock Data to directly power the UI matching extracted_designs

export const USER_DIRECTORY = [
  {
    id: 'USR-001',
    fullName: 'Reza Gading Oktavian',
    username: 'reza.gading',
    email: 'reza@reefsight.id',
    role: 'admin' as const,
    institution: 'Universitas Pendidikan Indonesia',
    position: 'Tim Pengembang REEFSIGHT',
    phone: '081234567890',
    accountStatus: 'Active' as const,
    lastActivity: '14 Nov 2025, 10:24 WIB',
    createdAt: '02 Jun 2025',
    avatarUrl: ''
  },
  {
    id: 'USR-002',
    fullName: 'Aulia Rahma',
    username: 'aulia.rahma',
    email: 'aulia@reefsight.id',
    role: 'peneliti_ekologi' as const,
    institution: 'Pusat Riset Kelautan BRIN',
    position: 'Peneliti Ekologi Terumbu Karang',
    phone: '081298765432',
    accountStatus: 'Active' as const,
    lastActivity: '14 Nov 2025, 09:17 WIB',
    createdAt: '05 Jun 2025',
    avatarUrl: ''
  },
  {
    id: 'USR-003',
    fullName: 'Dimas Pratama',
    username: 'dimas.p',
    email: 'dimas@reefsight.id',
    role: 'operator_lapangan' as const,
    institution: 'Komunitas Konservasi Pulau Tunda',
    position: 'Operator Lapangan & Penyelam Ilmiah',
    phone: '085892640228',
    accountStatus: 'Active' as const,
    lastActivity: '13 Nov 2025, 17:40 WIB',
    createdAt: '07 Jun 2025',
    avatarUrl: ''
  },
  {
    id: 'USR-004',
    fullName: 'Sinta Nurhaliza',
    username: 'sinta.n',
    email: 'sinta@reefsight.id',
    role: 'validator_data' as const,
    institution: 'Balai Riset Observasi Laut (BROL)',
    position: 'Data Quality & QA/QC Validator',
    phone: '081345678910',
    accountStatus: 'Pending' as const,
    lastActivity: '12 Nov 2025, 14:05 WIB',
    createdAt: '10 Jun 2025',
    avatarUrl: ''
  },
  {
    id: 'USR-005',
    fullName: 'Rizky Handoko',
    username: 'rizky.h',
    email: 'rizky@reefsight.id',
    role: 'peneliti_ekologi' as const,
    institution: 'Institut Pertanian Bogor',
    position: 'Spesialis Bioakustik Laut',
    phone: '081122334455',
    accountStatus: 'Inactive' as const,
    lastActivity: '08 Nov 2025, 11:22 WIB',
    createdAt: '03 Jun 2025',
    avatarUrl: ''
  }
];

export const ECO_TOURISM_ZONES = [
  {
    id: 'ECO-01',
    name: 'ST-01 — Legon Bajo',
    code: 'TUN-01',
    category: 'Potential Diving Spot' as const,
    depthRangeM: '5 – 15 m',
    liveCoralPct: 56.8,
    deadCoralPct: 10.2,
    fishDiversityScore: 3.21,
    visibilityM: '10 – 15 m',
    currentVelocityMs: '0.1 – 0.3 m/s',
    humanPressure: 'Rendah' as const,
    suitabilityStatus: 'Highly Suitable' as const,
    rationale: 'Tutupan karang hidup tinggi, keanekaragaman biota tinggi, visibilitas baik, dan tekanan aktivitas rendah.',
    badgeColor: 'bg-blue-600 text-white'
  },
  {
    id: 'ECO-02',
    name: 'ST-02 — Karang Abang',
    code: 'TUN-02',
    category: 'Potential Snorkeling Spot' as const,
    depthRangeM: '2 – 6 m',
    liveCoralPct: 49.7,
    deadCoralPct: 12.9,
    fishDiversityScore: 2.95,
    visibilityM: '8 – 12 m',
    currentVelocityMs: '0.1 – 0.2 m/s',
    humanPressure: 'Sedang' as const,
    suitabilityStatus: 'Suitable' as const,
    rationale: 'Kedalaman dangkal ramah pemula, perairan tenang dengan kelimpahan ikan karang tinggi.',
    badgeColor: 'bg-cyan-500 text-white'
  },
  {
    id: 'ECO-03',
    name: 'ST-03 — Ciput Utara',
    code: 'TUN-03',
    category: 'Conservation Zone' as const,
    depthRangeM: '4 – 18 m',
    liveCoralPct: 52.0,
    deadCoralPct: 11.7,
    fishDiversityScore: 3.10,
    visibilityM: '12 – 16 m',
    currentVelocityMs: '0.2 – 0.4 m/s',
    humanPressure: 'Rendah' as const,
    suitabilityStatus: 'Restricted' as const,
    rationale: 'Zona inti perlindungan rekrutmen karang Acropora dan habitat pemijahan ikan.',
    badgeColor: 'bg-emerald-600 text-white'
  },
  {
    id: 'ECO-04',
    name: 'ST-04 — Teluk Selatan',
    code: 'TUN-04',
    category: 'Research Zone' as const,
    depthRangeM: '6 – 20 m',
    liveCoralPct: 45.2,
    deadCoralPct: 14.8,
    fishDiversityScore: 2.80,
    visibilityM: '7 – 10 m',
    currentVelocityMs: '0.3 – 0.5 m/s',
    humanPressure: 'Rendah' as const,
    suitabilityStatus: 'Conditional' as const,
    rationale: 'Fokus pemantauan stasiun hydrophone bioakustik jangka panjang dan stasiun kalibrasi sensor.',
    badgeColor: 'bg-purple-600 text-white'
  },
  {
    id: 'ECO-05',
    name: 'ST-05 — Karang Timur',
    code: 'TUN-05',
    category: 'Rehabilitation Zone' as const,
    depthRangeM: '3 – 10 m',
    liveCoralPct: 31.5,
    deadCoralPct: 28.4,
    fishDiversityScore: 2.10,
    visibilityM: '5 – 8 m',
    currentVelocityMs: '0.2 – 0.4 m/s',
    humanPressure: 'Tinggi' as const,
    suitabilityStatus: 'Highly Suitable' as const,
    rationale: 'Memerlukan intervensi transplantasi fragmen karang bercabang dan pembersihan alga makro.',
    badgeColor: 'bg-amber-600 text-white'
  }
];

export const SYSTEM_ALERTS_MOCK = [
  {
    id: 'ALT-2025-0284',
    alertCode: 'ALT-2025-0284',
    stationId: 'TUN-01',
    stationCode: 'TUN-01',
    stationName: 'Legon Bajo (Pulau Tunda)',
    detectedAt: '14 Nov 2025, 10:24 WIB',
    alertType: 'Coral Bleaching' as const,
    severity: 'High' as const,
    confidence: 0.78,
    status: 'Pending Review' as const,
    source: 'Optical Monitoring (ReefCam-01)',
    summary: 'Sistem mendeteksi indikasi pemutihan karang (coral bleaching) berdasarkan analisis citra bawah air pada area terumbu karang stasiun TUN-01. Diperlukan verifikasi oleh Tim Riset menggunakan bukti tambahan (foto/video lapangan) sebelum konfirmasi.',
    possibleCauses: [
      'Anomali kenaikan suhu permukaan laut (SST > 31.4°C)',
      'Intensitas radiasi UV tinggi selama 14 hari berturut-turut',
      'Arus tenang di teluk barat laut memicu retensi panas'
    ],
    recommendedActions: [
      'Lakukan verifikasi visual di lokasi (foto/video transek)',
      'Periksa parameter lingkungan (SST, salinitas, DO)',
      'Bandingkan dengan data historis atau citra sebelumnya',
      'Tentukan status akhir (terkonfirmasi / tidak terkonfirmasi)'
    ],
    whatsappDispatched: false
  },
  {
    id: 'ALT-2025-0283',
    alertCode: 'ALT-2025-0283',
    stationId: 'TUN-02',
    stationCode: 'TUN-02',
    stationName: 'Karang Abang (Pulau Tunda)',
    detectedAt: '14 Nov 2025, 09:47 WIB',
    alertType: 'Low Fish Activity' as const,
    severity: 'Medium' as const,
    confidence: 0.71,
    status: 'In Verification' as const,
    source: 'Acoustic Monitoring (EchoVision-01)',
    summary: 'Acoustic Complexity Index (ACI) mengalami penurunan signifikan di bawah ambang normal (ACI = 0.28). Suara snapping shrimp dan frekuensi ikan herbivora melemah.',
    possibleCauses: [
      'Gangguan kebisingan lalu lintas kapal nelayan lokal',
      'Kekeruhan air temporer akibat pasang surut Selat Sunda'
    ],
    recommendedActions: [
      'Ambil rekaman hidrofon ulang durasi 10 menit',
      'Cek visual schooling fish menggunakan ReefCam-02'
    ],
    whatsappDispatched: true,
    whatsappRecipient: '085892640228 (Dimas Pratama - Operator)'
  },
  {
    id: 'ALT-2025-0282',
    alertCode: 'ALT-2025-0282',
    stationId: 'TUN-03',
    stationCode: 'TUN-03',
    stationName: 'Ciput (Pulau Tunda)',
    detectedAt: '14 Nov 2025, 08:55 WIB',
    alertType: 'Reef Degradation' as const,
    severity: 'High' as const,
    confidence: 0.84,
    status: 'Verified' as const,
    source: 'Integrated Ecological Detection',
    summary: 'Terdeteksi akumulasi pecahan karang mati (rubble) meningkat 8% dalam 30 hari. Indikasi benturan mekanik atau penangkapan ikan tidak ramah lingkungan.',
    possibleCauses: [
      'Penggunaan jangkar perahu nelayan di atas koloni karang',
      'Dinamika arus pasang surut ekstrem'
    ],
    recommendedActions: [
      'Patroli pengawasan bersama Pokmaswas Pulau Tunda',
      'Usulkan pemasangan mooring buoy tambahan di stasiun TUN-03'
    ],
    whatsappDispatched: true,
    whatsappRecipient: '085892640228 (Dimas Pratama - Operator)'
  },
  {
    id: 'ALT-2025-0281',
    alertCode: 'ALT-2025-0281',
    stationId: 'TUN-02',
    stationCode: 'TUN-02',
    stationName: 'Karang Abang (Pulau Tunda)',
    detectedAt: '13 Nov 2025, 16:20 WIB',
    alertType: 'Environmental Anomaly' as const,
    severity: 'Medium' as const,
    confidence: 0.69,
    status: 'Resolved' as const,
    source: 'EnviroSense Sensor Probe',
    summary: 'Kekeruhan perairan (turbidity) melonjak mencapai 3.8 NTU selama 3 jam akibat sedimentasi pasang.',
    possibleCauses: ['Sedimentasi pesisir pasca hujan deras'],
    recommendedActions: ['Sensor otomatis kembali normal setelah arus berganti'],
    whatsappDispatched: true
  },
  {
    id: 'ALT-2025-0280',
    alertCode: 'ALT-2025-0280',
    stationId: 'TUN-01',
    stationCode: 'TUN-01',
    stationName: 'Legon Bajo (Pulau Tunda)',
    detectedAt: '13 Nov 2025, 14:05 WIB',
    alertType: 'Acoustic Anomaly' as const,
    severity: 'Low' as const,
    confidence: 0.66,
    status: 'Verified' as const,
    source: 'Hydrophone RE-HP-01',
    summary: 'Terdeteksi kebisingan akustik motor tempel di zona konservasi terumbu.',
    possibleCauses: ['Perahu wisata melintas di atas transek pengamatan'],
    recommendedActions: ['Edukasi pemandu wisata lokal mengenai rute perahu yang ramah'],
    whatsappDispatched: true
  }
];

export const FIELD_COLLECTIONS_MOCK = [
  {
    id: 'COL-2025-0284',
    collectionCode: 'COL-2025-0284',
    collectionTitle: 'Rekaman Akustik Stasiun TUN-01',
    stationId: 'TUN-01',
    stationCode: 'TUN-01',
    operatorId: 'USR-003',
    operatorName: 'Aulia Rahma & Reza G.',
    observationDate: '14 Nov 2025',
    timeWindow: '10:24 WIB',
    depthM: 10.0,
    deviceUsed: 'EchoVision (EV-01)',
    collectionType: 'Acoustic' as const,
    fileCount: 3,
    fileSizeBytes: 12400000000, // 12.4 GB
    completenessPct: 100,
    validationStatus: 'Pending' as const,
    notes: 'Perekaman suara soundscape selama 30 menit. Kualitas audio jernih tanpa interferensi gelombang.'
  },
  {
    id: 'COL-2025-0283',
    collectionCode: 'COL-2025-0283',
    collectionTitle: 'Pengamatan Terumbu Karang Stasiun TUN-02',
    stationId: 'TUN-02',
    stationCode: 'TUN-02',
    operatorId: 'USR-001',
    operatorName: 'Reza G. Oktavian',
    observationDate: '14 Nov 2025',
    timeWindow: '09:47 WIB',
    depthM: 8.5,
    deviceUsed: 'ReefCam (RC-02)',
    collectionType: 'Optical' as const,
    fileCount: 48,
    fileSizeBytes: 8700000000, // 8.7 GB
    completenessPct: 85,
    validationStatus: 'Pending' as const,
    notes: 'Pengambilan foto dan video kondisi terumbu karang pada transek 50 m (TUN-02). Metadata belum lengkap.'
  },
  {
    id: 'COL-2025-0282',
    collectionCode: 'COL-2025-0282',
    collectionTitle: 'Pengukuran Parameter Lingkungan',
    stationId: 'TUN-03',
    stationCode: 'TUN-03',
    operatorId: 'USR-003',
    operatorName: 'Fajar Pratama',
    observationDate: '13 Nov 2025',
    timeWindow: '08:55 WIB',
    depthM: 12.0,
    deviceUsed: 'EnviroSense (ES-01)',
    collectionType: 'Environmental' as const,
    fileCount: 12,
    fileSizeBytes: 156000000,
    completenessPct: 92,
    validationStatus: 'Needs Revision' as const,
    notes: 'Suhu 29.4°C, salinitas 33.2 ppt, DO 6.8 mg/L. Kalibrasi probe pH perlu diulang.'
  },
  {
    id: 'COL-2025-0281',
    collectionCode: 'COL-2025-0281',
    collectionTitle: 'Survei Ikan Karang (Stasiun TUN-04)',
    stationId: 'TUN-04',
    stationCode: 'TUN-04',
    operatorId: 'USR-002',
    operatorName: 'Aulia Rahma',
    observationDate: '13 Nov 2025',
    timeWindow: '16:20 WIB',
    depthM: 6.0,
    deviceUsed: 'ReefCam (RC-03)',
    collectionType: 'Ecological' as const,
    fileCount: 26,
    fileSizeBytes: 4200000000,
    completenessPct: 100,
    validationStatus: 'Validated' as const,
    notes: 'Pencatatan 68 spesies ikan karang dari 16 famili dengan metode Underwater Visual Census (UVC).'
  },
  {
    id: 'COL-2025-0280',
    collectionCode: 'COL-2025-0280',
    collectionTitle: 'Citra Bawah Air - Monitoring Rutin',
    stationId: 'TUN-01',
    stationCode: 'TUN-01',
    operatorId: 'USR-003',
    operatorName: 'Dimas Saputra',
    observationDate: '11 Nov 2025',
    timeWindow: '14:05 WIB',
    depthM: 10.0,
    deviceUsed: 'ReefCam (RC-01)',
    collectionType: 'Optical' as const,
    fileCount: 37,
    fileSizeBytes: 6100000000,
    completenessPct: 78,
    validationStatus: 'Pending' as const,
    notes: 'Monitoring visual berkala transek permanen stasiun TUN-01.'
  }
];

export const PROTOTYPE_INVENTORY = [
  {
    id: 'DEV-001',
    code: 'EV-ASIK01',
    name: 'EchoVision Buoy v1.0',
    type: 'EchoVision',
    stationAssigned: 'TUN-01 (Legon Bajo)',
    status: 'Operational' as const,
    battery: 94,
    solarInput: 18.2,
    sensors: 'Hydrophone, Underwater Camera, SST, Turbidity',
    firmware: 'v2.4.1',
    lastPing: '14 Nov 2025, 10:24 WIB'
  },
  {
    id: 'DEV-002',
    code: 'EV-ASIK02',
    name: 'EchoVision Buoy v1.0',
    type: 'EchoVision',
    stationAssigned: 'TUN-02 (Karang Abang)',
    status: 'Operational' as const,
    battery: 88,
    solarInput: 17.5,
    sensors: 'Hydrophone, Underwater Camera, SST, Turbidity',
    firmware: 'v2.4.1',
    lastPing: '14 Nov 2025, 09:47 WIB'
  },
  {
    id: 'DEV-003',
    code: 'RC-02',
    name: 'ReefCam High-Res Optical Unit',
    type: 'ReefCam',
    stationAssigned: 'TUN-03 (Ciput)',
    status: 'Operational' as const,
    battery: 91,
    solarInput: 19.0,
    sensors: 'Sony IMX335 4K, Dual Macro Strobe',
    firmware: 'v1.8.0',
    lastPing: '14 Nov 2025, 08:55 WIB'
  },
  {
    id: 'DEV-004',
    code: 'ES-01',
    name: 'EnviroSense Multi-Probe Unit',
    type: 'EnviroSense',
    stationAssigned: 'TUN-04 (Teluk Selatan)',
    status: 'Maintenance' as const,
    battery: 42,
    solarInput: 4.1,
    sensors: 'SST, Dissolved Oxygen, Salinity, pH',
    firmware: 'v2.1.0',
    lastPing: '13 Nov 2025, 18:00 WIB'
  }
];
