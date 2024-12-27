import React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface VerificationEmailProps {
  verificationUrl: string;
  userEmail: string;
}

export function VerificationEmail({
  verificationUrl,
  userEmail,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address for Learnify</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Text style={text}>Hi {userEmail},</Text>
            <Text style={text}>
              Welcome to Learnify! Please verify your email address by clicking the
              button below:
            </Text>
            <Button style={button} href={verificationUrl}>
              Verify Email Address
            </Button>
            <Text style={text}>
              If you didn't create an account on Learnify, you can safely ignore
              this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const section = {
  padding: '24px',
  border: 'solid 1px #dedede',
  borderRadius: '5px',
  textAlign: 'center' as const,
};

const text = {
  margin: '0 0 10px 0',
  color: '#333',
  lineHeight: '24px',
};

const button = {
  backgroundColor: '#007ee6',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
  margin: '20px auto',
}; 
