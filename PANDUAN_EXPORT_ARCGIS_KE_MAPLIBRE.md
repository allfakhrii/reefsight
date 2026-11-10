# Panduan Ekspor Data Spasial ArcGIS & QGIS ke MapLibre GL JS
### Platform REEFSIGHT — Pulau Tunda, Banten

Dokumen ini adalah panduan teknis langkah-demi-langkah bagi **Tim GIS / Peneliti Ekologi** dan **Developer** untuk mengekspor data hasil interpretasi spasial terumbu karang dari ArcGIS/QGIS ke format **GeoJSON (WGS 84)** agar siap ditampilkan di peta interaktif **MapLibre GL JS**.

---

## 1. Standar Geospasial REEFSIGHT

Agar data poligon terumbu karang dan titik stasiun pas dengan basemap dunia tanpa bergeser (*offset*), seluruh data wajib mengikuti standar berikut:

* **Sistem Koordinat (CRS)**: `EPSG:4326 - WGS 84` (Geographic Coordinate System).
  > **Catatan**: Jika data mentah di ArcGIS menggunakan sistem koordinat proyeksi seperti `WGS 84 / UTM Zone 48S` (EPSG:32748), data **wajib di-reproject** ke `EPSG:4326` saat ekspor.
* **Format File Output**: `.geojson`
* **Struktur Atribut Layer (Disarankan)**:
  Pastikan tabel atribut shapefile/feature class memiliki kolom-kolom berikut:
  * `id` *(String/Int)*: ID unik poligon/stasiun (misal: `RFS-POL-001`).
  * `zona` *(String)*: Nama zona (misal: `Karang Bagian Timur`, `Laguna`).
  * `tahun` *(Int)*: Tahun pengamatan (misal: `2020`, `2023`, `2024`).
  * `tutupan_pct` *(Float)*: Persentase tutupan karang hidup (misal: `45.8`).
  * `kondisi` *(String)*: Status kondisi karang (`Sehat`, `Bleaching`, `Mati/Degradasi`).
  * `life_form` *(String)*: Bentuk dominan (`Acropora Branching`, `Massive`, `Foliose`, dll).
  * `luas_ha` *(Float)*: Luas area dalam satuan hektar.

---

## 2. Cara Ekspor dari ArcGIS Pro

1. Buka project kamu di **ArcGIS Pro**.
2. Pastikan layer tutupan karang Pulau Tunda sudah aktif di panel *Contents*.
3. Buka panel **Geoprocessing** (*View* -> *Geoprocessing*).
4. Cari tool bernama: **Features To JSON**.
5. Isi parameter berikut:
   * **Input Features**: Pilih layer tutupan karang kamu.
   * **Output JSON**: Tentukan lokasi penyimpanan file dan beri nama file dengan ekstensi `.geojson` (contoh: `tutupan_karang_pulau_tunda_2023.geojson`).
   * **Format JSON**: Centang opsi **GeoJSON** (format RFC 7946).
   * **Output to GeoJSON**: Pastikan kotak dicentang (`Checked`).
6. Buka tab **Environments** di jendela tool yang sama:
   * Pada bagian **Output Coordinate System**, pilih **GCS_WGS_1984** (`EPSG:4326`).
7. Klik tombol **Run**. File `.geojson` siap digunakan!

---

## 3. Cara Ekspor dari ArcMap (10.x)

Jika kamu menggunakan ArcMap versi lama:

1. Buka **ArcToolbox**.
2. Masuk ke: **Conversion Tools** -> **JSON** -> **Features to JSON**.
3. Masukkan layer karang pada **Input Features**.
4. Beri nama file output: `nama_layer.geojson`.
5. Centang opsi **Output to GeoJSON**.
6. Klik **Environments** di bagian bawah jendela:
   * Pilih **Output Coordinate System** -> Pilih **Geographic Coordinate System** -> **World** -> **WGS 1984**.
7. Klik **OK** untuk memproses.

---

## 4. Cara Ekspor dari QGIS (Alternatif Open Source)

Jika tim riset menggunakan QGIS:

1. Klik kanan layer terumbu karang di panel *Layers*.
2. Pilih **Export** -> **Save Features As...**
3. Atur konfigurasi berikut:
   * **Format**: Pilih `GeoJSON`.
   * **File name**: Pilih direktori penyimpanan (misal: `karang_2023.geojson`).
   * **CRS**: Pilih `EPSG:4326 - WGS 84`.
   * **Geometry type**: Pilih `Automatic` atau `Polygon` / `MultiPolygon`.
   * **Coordinate precision**: Isi `6` (cukup akurat hingga skala milimeter dan menghemat ukuran file).
4. Klik **OK**.

---

## 5. Optimasi Ukuran File (Jika File > 5 MB)

Jika layer ArcGIS memiliki detail poligon yang terlalu rapat sehingga file GeoJSON berukuran sangat besar (misal > 5–10 MB), peta web bisa menjadi lambat dimuat. 

Lakukan simplifikasi geometri tanpa mengurangi bentuk pulau/karang:
1. Buka situs gratis: [https://mapshaper.org](https://mapshaper.org).
2. Tarik dan letakkan file `.geojson` kamu ke browser.
3. Klik tombol **Simplify** di pojok kanan atas.
4. Pilih metode: **Visvalingam / weighted area**.
5. Geser slider simplifikasi ke angka sekitar **10% – 25%** (perhatikan bentuk karang tetap utuh dan rapi).
6. Klik **Export** di kanan atas -> Pilih format **GeoJSON**. Ukuran file biasanya akan berkurang drastis hingga 70-80% lebih ringan!

---

## 6. Implementasi di MapLibre GL JS (Next.js)

Simpan file hasil ekspor ke dalam folder:
`public/data/coral_tunda_2023.geojson`

### A. Contoh Kode Render Layer Poligon di Komponen Next.js:

```typescript
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function CoralMap() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // 1. Inisialisasi Peta MapLibre dengan Basemap Satelit ArcGIS Esri
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'esri-satellite': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256,
            attribution: '© Esri, Maxar, Earthstar Geographics'
          }
        },
        layers: [
          {
            id: 'satellite-basemap',
            type: 'raster',
            source: 'esri-satellite'
          }
        ]
      },
      center: [106.1667, -5.8167], // Koordinat Pulau Tunda
      zoom: 13,
      pitch: 35 // Kemiringan 3D modern
    });

    map.on('load', () => {
      // 2. Load File GeoJSON Hasil Ekspor ArcGIS
      map.addSource('tutupan-karang', {
        type: 'geojson',
        data: '/data/coral_tunda_2023.geojson'
      });

      // 3. Render Area Poligon dengan Pewarnaan Dinamis Berdasarkan Kondisi
      map.addLayer({
        id: 'layer-karang-fill',
        type: 'fill',
        source: 'tutupan-karang',
        paint: {
          'fill-color': [
            'match',
            ['get', 'kondisi'],
            'Sehat', '#10b981',       // Emerald Green
            'Bleaching', '#f59e0b',   // Amber
            'Mati/Degradasi', '#ef4444', // Red Rose
            '#06b6d4'                 // Default Cyan
          ],
          'fill-opacity': 0.65
        }
      });

      // 4. Tambahkan Garis Tepi (Outline)
      map.addLayer({
        id: 'layer-karang-line',
        type: 'line',
        source: 'tutupan-karang',
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.2,
          'line-opacity': 0.8
        }
      });

      // 5. Popup Interaktif Saat Poligon Diklik
      map.on('click', 'layer-karang-fill', (e) => {
        if (!e.features || !e.features[0]) return;
        const props = e.features[0].properties;

        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <div style="font-family: sans-serif; padding: 6px;">
              <h3 style="margin: 0 0 4px; font-size: 14px; font-weight: bold;">${props.zona || 'Area Karang'}</h3>
              <p style="margin: 2px 0; font-size: 12px;"><b>Kondisi:</b> ${props.kondisi || '-'}</p>
              <p style="margin: 2px 0; font-size: 12px;"><b>Tutupan:</b> ${props.tutupan_pct || 0}%</p>
              <p style="margin: 2px 0; font-size: 12px;"><b>Life Form:</b> ${props.life_form || '-'}</p>
            </div>
          `)
          .addTo(map);
      });

      // Ubah kursor jadi pointer saat hover di atas poligon
      map.on('mouseenter', 'layer-karang-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'layer-karang-fill', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} className="w-full h-full min-h-[500px] rounded-xl overflow-hidden shadow-lg" />;
}
```

---

## 7. Setup Fitur Map Swipe (Perbandingan Antar-Tahun)

Untuk fitur **Coral Change Analysis / Map Swipe** (misal membandingkan tutupan karang tahun 2020 vs 2023):

1. Install plugin pembanding resmi MapLibre:
   ```bash
   npm install @maplibre/maplibre-gl-compare
   ```
2. Buat 2 instance peta:
   * **Peta Kiri (Sebelum)**: Me-load GeoJSON tahun 2020 (`coral_tunda_2020.geojson`).
   * **Peta Kanan (Sesudah)**: Me-load GeoJSON tahun 2023 (`coral_tunda_2023.geojson`).
3. Hubungkan keduanya dengan satu slider geser (`Compare`):
   ```typescript
   import Compare from '@maplibre/maplibre-gl-compare';
   import '@maplibre/maplibre-gl-compare/dist/maplibre-gl-compare.css';

   // Inisialisasi mapBefore & mapAfter
   const compare = new Compare(mapBefore, mapAfter, '#comparison-container', {});
   ```

---

## 8. Checklist Validasi Data Sebelum Diserahkan ke Tim Web
- [ ] Format file adalah `.geojson`.
- [ ] Sistem proyeksi koordinat adalah **WGS 84 (EPSG:4326)**.
- [ ] Poligon tidak *self-intersecting* (tidak bertumpuk secara tidak valid).
- [ ] Kolom atribut memiliki minimal: `kondisi`, `tutupan_pct`, `tahun`.
- [ ] Ukuran file di bawah 5 MB (sudah dioptimasi dengan Mapshaper jika perlu).
- [ ] File diletakkan di `public/data/` atau diunggah ke bucket **Supabase Storage**.
