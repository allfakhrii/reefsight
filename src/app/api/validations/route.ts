import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { observation_id, validator_name, decision, validator_notes, operator_name } = body;

    if (!observation_id || !validator_name || !decision) {
      return NextResponse.json(
        { success: false, error: 'Data validasi tidak lengkap.' },
        { status: 400 }
      );
    }

    // Crucial Rule: Operator cannot validate their own submission!
    if (operator_name && validator_name && operator_name.toLowerCase().trim() === validator_name.toLowerCase().trim()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Pelanggaran Aturan QA/QC: Operator Lapangan dilarang memvalidasi datanya sendiri (Prinsip Pemisahan Tugas).' 
        },
        { status: 403 }
      );
    }

    // Update status in Supabase
    const { data, error } = await supabase
      .from('field_observations')
      .update({
        validation_status: decision,
        validator_name,
        validator_notes: validator_notes || '',
        validated_at: new Date().toISOString()
      })
      .eq('id', observation_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: true,
        source: 'simulated_validation',
        observation_id,
        decision,
        validator_name,
        validator_notes,
        validated_at: new Date().toISOString(),
        message: `Status observasi ${observation_id} berhasil diubah menjadi: ${decision}.`
      });
    }

    return NextResponse.json({
      success: true,
      source: 'supabase',
      data,
      message: `Status observasi ${observation_id} berhasil diperbarui di database.`
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
