import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, password, username, institution, role, phone } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { success: false, message: 'Nama lengkap, email, dan password wajib diisi.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password minimal 6 karakter.' },
        { status: 400 }
      );
    }

    // 1. Create User in Supabase Auth via Admin Client
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        username: username || email.split('@')[0],
        institution: institution || 'Institusi Umum',
        role: role || 'peneliti_ekologi',
        phone: phone || ''
      }
    });

    if (authError) {
      // If user already exists or other auth error
      return NextResponse.json(
        { success: false, message: authError.message },
        { status: 400 }
      );
    }

    // 2. Insert into profiles table if table exists
    try {
      if (authUser?.user) {
        await supabaseAdmin.from('profiles').insert([
          {
            id: authUser.user.id,
            email,
            full_name: fullName,
            role: role || 'peneliti_ekologi',
            institution: institution || 'Institusi Umum',
            phone_number: phone || '',
            is_active: true
          }
        ]);
      }
    } catch (dbErr) {
      // Non-fatal if profiles table migration hasn't been run yet
      console.warn('Profiles table insert skipped or error:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Akun berhasil didaftarkan.',
      user: {
        id: authUser?.user?.id,
        email,
        fullName,
        role: role || 'peneliti_ekologi'
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Terjadi kesalahan saat pendaftaran akun.' },
      { status: 500 }
    );
  }
}
