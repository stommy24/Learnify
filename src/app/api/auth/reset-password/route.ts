import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { hash } from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify token and get user
    const { data: resetRequest, error: tokenError } = await supabase
      .from('password_resets')
      .select('*')
      .eq('token', token)
      .single();

    if (tokenError || !resetRequest) {
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      );
    }

    if (new Date(resetRequest.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10);

    // Update user's password
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', resetRequest.user_id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }

    // Delete the reset token
    await supabase
      .from('password_resets')
      .delete()
      .eq('token', token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
} 