import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { PULAU_TUNDA_STATIONS } from '@/data/mockData';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('stations')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      // Return static/mock baseline data if Supabase is not yet populated
      return NextResponse.json({
        success: true,
        source: 'local_dataset',
        data: PULAU_TUNDA_STATIONS
      });
    }

    return NextResponse.json({
      success: true,
      source: 'supabase_postgis',
      data
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      source: 'fallback',
      data: PULAU_TUNDA_STATIONS
    });
  }
}
