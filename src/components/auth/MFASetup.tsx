import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MFASetupProps {
  secretKey: string;
  onVerify: (code: string) => void;
}

export const MFASetup: React.FC<MFASetupProps> = ({ secretKey, onVerify }) => {
  const [verificationCode, setVerificationCode] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(verificationCode);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <QRCodeSVG
          value={`otpauth://totp/YourApp:user@example.com?secret=${secretKey}&issuer=YourApp`}
          size={256}
          level="H"
        />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter verification code"
          pattern="[0-9]*"
          maxLength={6}
          required
        />
        <Button type="submit">Verify</Button>
      </form>
    </div>
  );
}; 