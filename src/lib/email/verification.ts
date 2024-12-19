import { transporter, emailFrom } from './config';
import { render } from '@react-email/render';
import { VerificationEmail } from '@/components/emails/VerificationEmail';

export async function sendVerificationEmail(
  email: string,
  verificationToken: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${verificationToken}`;
  
  const emailHtml = render(
    VerificationEmail({
      verificationUrl,
      userEmail: email,
    })
  );

  await transporter.sendMail({
    from: emailFrom,
    to: email,
    subject: 'Verify your email address',
    html: emailHtml.toString(),
  });
} 