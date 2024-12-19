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
import React from 'react';

interface VerificationEmailProps {
  verificationUrl: string;
  userEmail: string;
}

const styles = {
  main: {
    backgroundColor: '#ffffff',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  },
  container: {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '560px',
  },
  section: {
    padding: '24px',
    border: 'solid 1px #dedede',
    borderRadius: '5px',
    textAlign: 'center' as const,
  },
  text: {
    margin: '0 0 10px 0',
    color: '#333',
    lineHeight: '24px',
  },
  button: {
    backgroundColor: '#007ee6',
    borderRadius: '3px',
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '12px',
    margin: '20px auto',
  },
};

export function VerificationEmail({
  verificationUrl,
  userEmail,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address for Learnify</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Section style={styles.section}>
            <Text style={styles.text}>Hi {userEmail},</Text>
            <Text style={styles.text}>
              Welcome to Learnify! Please verify your email address by clicking the
              button below:
            </Text>
            <Button style={styles.button} href={verificationUrl}>
              Verify Email Address
            </Button>
            <Text style={styles.text}>
              If you didn't create an account on Learnify, you can safely ignore
              this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}