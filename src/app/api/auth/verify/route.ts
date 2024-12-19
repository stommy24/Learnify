import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { error: 'Missing verification token' },
      { status: 400 }
    );
  }

  try {
    const { data: verification, error } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('token', token)
      .single();

    if (error || !verification) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    if (new Date(verification.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      );
    }

    // Update user's email verification status
    await supabase
      .from('users')
      .update({ email_verified: true })
      .eq('id', verification.user_id);

    // Delete the verification token
    await supabase
      .from('email_verifications')
      .delete()
      .eq('token', token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
} 