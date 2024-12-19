import crypto from 'crypto';

export class Encryption {
  private static readonly algorithm = 'aes-256-gcm';
  private static readonly keyLength = 32;
  private static readonly ivLength = 16;
  private static readonly saltLength = 64;
  private static readonly tagLength = 16;

  static async encrypt(text: string, secretKey: string): Promise<string> {
    const iv = crypto.randomBytes(this.ivLength);
    const salt = crypto.randomBytes(this.saltLength);
    const key = crypto.pbkdf2Sync(secretKey, salt, 100000, this.keyLength, 'sha512');
    
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
  }

  static async decrypt(encryptedText: string, secretKey: string): Promise<string> {
    const buffer = Buffer.from(encryptedText, 'base64');
    
    const salt = buffer.subarray(0, this.saltLength);
    const iv = buffer.subarray(this.saltLength, this.saltLength + this.ivLength);
    const tag = buffer.subarray(this.saltLength + this.ivLength, this.saltLength + this.ivLength + this.tagLength);
    const encrypted = buffer.subarray(this.saltLength + this.ivLength + this.tagLength);
    
    const key = crypto.pbkdf2Sync(secretKey, salt, 100000, this.keyLength, 'sha512');
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    decipher.setAuthTag(tag);
    
    return decipher.update(encrypted) + decipher.final('utf8');
  }
} 