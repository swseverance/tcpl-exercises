import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse
} from '@angular/ssr/node';
import cookieParser from 'cookie-parser';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { join } from 'node:path';
import {
  createSessionHandler,
  deleteSessionHandler,
  verifySessionCookieHandler
} from './server/middleware/auth/auth';
import { privateRouter } from './server/routers/private.router';
import { publicRouter } from './server/routers/public.router';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(
  createProxyMiddleware({
    target: `https://${process.env['FIREBASE_PROJECT_ID']}.firebaseapp.com`,
    changeOrigin: true,
    pathFilter: '/__/auth/**'
  })
);

/**
 * Serve static files from /browser. Matched requests are handled here and
 * never reach the cookie parsing/verification below, so static assets skip
 * that work entirely.
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false
  })
);

app.use(cookieParser());
app.use(verifySessionCookieHandler);

app.use('/api', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
app.use('/api', express.json({ limit: '64kb' }));

app.post('/api/session', createSessionHandler);
app.delete('/api/session', deleteSessionHandler);

app.use('/api/public', publicRouter);
app.use('/api/private', privateRouter);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
