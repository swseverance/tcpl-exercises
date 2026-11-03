import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse
} from '@angular/ssr/node';
import express from 'express';
import { initializeApp } from 'firebase-admin/app';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { join } from 'node:path';
import { environment } from './environments/environment';
import {
  getExerciseDraftHandler,
  saveExerciseDraftHandler
} from './server/api/exercise-draft.handler';
import {
  getExerciseTestResultsHandler,
  listExerciseSubmissionsHandler,
  submitExerciseHandler
} from './server/api/exercise-submissions.handler';
import { getExerciseHandler } from './server/api/exercise.handler';
import { appCheckMiddleware } from './server/middleware/appcheck';
import { authMiddleware } from './server/middleware/auth';

const browserDistFolder = join(import.meta.dirname, '../browser');

if (environment.name === 'local') {
  process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';
}

initializeApp({ projectId: environment.firebaseConfig.projectId });

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(
  createProxyMiddleware({
    target: `https://${environment.firebaseConfig.projectId}.firebaseapp.com`,
    changeOrigin: true,
    pathFilter: '/__/auth/**'
  })
);

app.use('/api/private', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
app.use('/api/private', express.json({ limit: '64kb' }));

// Public API
app.get('/api/public/exercises/:id', getExerciseHandler);

// Requires authentication
app.use('/api/private', appCheckMiddleware);
app.use('/api/private', authMiddleware);
app.get('/api/private/exercises/:id/draft', getExerciseDraftHandler);
app.put('/api/private/exercises/:id/draft', saveExerciseDraftHandler);
app.post('/api/private/exercises/:id/submit', submitExerciseHandler);
app.get('/api/private/exercises/:id/submissions', listExerciseSubmissionsHandler);
app.get('/api/private/exercises/:id/test-results', getExerciseTestResultsHandler);

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false
  })
);

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
