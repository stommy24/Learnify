import fs from 'fs';
import https from 'https';
import { Express } from 'express';

export const configureSSL = (app: Express) => {
  if (process.env.NODE_ENV === 'production') {
    const privateKey = fs.readFileSync('/etc/ssl/private/private.key', 'utf8');
    const certificate = fs.readFileSync('/etc/ssl/certs/certificate.crt', 'utf8');
    const ca = fs.readFileSync('/etc/ssl/certs/ca_bundle.crt', 'utf8');

    const credentials = {
      key: privateKey,
      cert: certificate,
      ca: ca
    };

    const httpsServer = https.createServer(credentials, app);
    return httpsServer;
  }
  return app;
}; 