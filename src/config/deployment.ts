import { config } from './environment';

export const deploymentConfig = {
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
    cors: {
      origin: config.security.cors.origin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    },
  },
  optimization: {
    compression: true,
    minification: true,
    caching: {
      enabled: true,
      duration: 86400, // 24 hours
    },
    staticAssets: {
      maxAge: 31536000, // 1 year
    },
  },
  scaling: {
    minInstances: 2,
    maxInstances: 10,
    targetCPUUtilization: 70,
  },
  monitoring: {
    enabled: true,
    metrics: ['cpu', 'memory', 'requests', 'errors'],
    alerting: {
      cpu: 80,
      memory: 85,
      errorRate: 5,
    },
  },
  backup: {
    enabled: true,
    frequency: '0 0 * * *', // Daily at midnight
    retention: 30, // days
  },
}; 