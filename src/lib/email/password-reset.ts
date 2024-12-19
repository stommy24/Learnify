import { transporter, emailFrom } from './config';
import { render } from '@react-email/render';
import { PasswordResetEmail } from '@/components/emails/PasswordResetEmail';

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
  
  const emailHtml = render(
    PasswordResetEmail({
      resetUrl,
      userEmail: email,
    })
  );

  await transporter.sendMail({
    from: emailFrom,
    to: email,
    subject: 'Reset your password',
    html: emailHtml.toString(),
  });
} 