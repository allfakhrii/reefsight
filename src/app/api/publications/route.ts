import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { MOCK_PUBLICATIONS } from '@/data/mockData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .eq('is_public', true)
      .order('year', { ascending: false });

    if (error || !data || data.length === 0) {
      return NextResponse.json({
        success: true,
        source: 'local_dataset',
        data: MOCK_PUBLICATIONS
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
      data: MOCK_PUBLICATIONS
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { publication_id } = body;

    if (!publication_id) {
      return NextResponse.json({ success: false, error: 'ID publikasi diperlukan.' }, { status: 400 });
    }

    // Increment download counter
    await supabase.rpc('increment_publication_download', { pub_id: publication_id });

    return NextResponse.json({
      success: true,
      publication_id,
      message: 'Penghitung unduhan berhasil diperbarui.'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
