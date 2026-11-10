import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { MOCK_ALERTS } from '@/data/mockData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { alert_id, officer_phone } = body;

    const phone = officer_phone || '085892640228';
    const alertData = MOCK_ALERTS.find(a => a.id === alert_id) || MOCK_ALERTS[0];

    // Format the official WhatsApp notification payload
    const formattedMessage = `*REEFSIGHT FIELD ALERT SYSTEM*
🚨 *Kondisi Terdeteksi:* ${alertData.condition_type}
📍 *Stasiun Penempatan:* ${alertData.station_id} (Pulau Tunda, Banten)
⚠️ *Tingkat Keparahan:* ${alertData.severity}
🕒 *Waktu Kejadian:* ${new Date().toLocaleString('id-ID')} WIB

*Indikasi & Kemungkinan Penyebab:*
${(alertData.likely_cause || []).map((c: string) => `• ${c}`).join('\n')}

*Rekomendasi Tindakan Segera:*
${(alertData.recommendations || []).map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}

_Pesan otomatis dari Admin Workspace REEFSIGHT untuk verifikasi patroli lapangan._`;

    let apiResponseStatus = 'Simulated / Dev Mode';

    // If external WhatsApp API Gateway token is present (e.g. Fonnte / Wablas)
    const gatewayToken = process.env.WHATSAPP_API_TOKEN;
    const gatewayUrl = process.env.WHATSAPP_GATEWAY_URL || 'https://api.fonnte.com/send';

    if (gatewayToken) {
      try {
        const response = await fetch(gatewayUrl, {
          method: 'POST',
          headers: {
            'Authorization': gatewayToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            target: phone,
            message: formattedMessage
          })
        });
        const resData = await response.json();
        apiResponseStatus = resData.status ? 'Dispatched via Gateway' : 'Gateway Error';
      } catch (err: any) {
        apiResponseStatus = `Gateway Request Failed: ${err.message}`;
      }
    }

    // Update alert status in database
    await supabase
      .from('alerts')
      .update({
        whatsapp_dispatched: true,
        officer_phone: phone,
        verification_status: 'Dispatched to Officer',
        dispatch_timestamp: new Date().toISOString()
      })
      .eq('id', alert_id);

    return NextResponse.json({
      success: true,
      alert_id,
      officer_phone: phone,
      gateway_status: apiResponseStatus,
      dispatched_at: new Date().toISOString(),
      preview_message: formattedMessage,
      message: `Notifikasi WhatsApp Alert berhasil diproses dan dikirim ke nomor ${phone}.`
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
