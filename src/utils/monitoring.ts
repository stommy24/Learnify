import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";
import { Integrations } from "@sentry/tracing";

export const initializeMonitoring = () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new ProfilingIntegration(),
      new Integrations.BrowserTracing({
        tracingOrigins: ["localhost", process.env.DOMAIN],
      }),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });
}; 