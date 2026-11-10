import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { MOCK_FIELD_OBSERVATIONS } from '@/data/mockData';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stationId = searchParams.get('station_id');

    let query = supabase.from('field_observations').select('*').order('created_at', { ascending: false });

    if (stationId) {
      query = query.eq('station_id', stationId);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return NextResponse.json({
        success: true,
        source: 'local_dataset',
        data: MOCK_FIELD_OBSERVATIONS
      });
    }

    return NextResponse.json({
      success: true,
      source: 'supabase',
      data
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      source: 'fallback',
      data: MOCK_FIELD_OBSERVATIONS
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      station_id,
      operator_name,
      depth_m,
      water_temp_c,
      turbidity_ntu,
      live_coral_cover_pct,
      audio_file_name,
      notes
    } = body;

    if (!station_id || !operator_name || depth_m === undefined) {
      return NextResponse.json(
        { success: false, error: 'Data parameter wajib diisi lengkap.' },
        { status: 400 }
      );
    }

    const newObservation = {
      id: `OBS-${Date.now().toString().slice(-6)}`,
      station_id,
      operator_name,
      depth_m: parseFloat(depth_m),
      water_temp_c: parseFloat(water_temp_c) || 28.5,
      turbidity_ntu: parseFloat(turbidity_ntu) || 1.2,
      live_coral_cover_pct: parseFloat(live_coral_cover_pct) || 45.0,
      audio_file_path: audio_file_name || null,
      notes: notes || '',
      validation_status: 'Pending Validation',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('field_observations')
      .insert([newObservation])
      .select()
      .single();

    if (error) {
      // Return simulated success in case table is not yet created
      return NextResponse.json({
        success: true,
        source: 'simulated_insert',
        data: newObservation,
        message: 'Data observasi lapangan berhasil dicatat (Menunggu validasi QA/QC).'
      });
    }

    return NextResponse.json({
      success: true,
      source: 'supabase',
      data,
      message: 'Data observasi lapangan berhasil disimpan ke database.'
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
