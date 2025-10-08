import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openapiPath = path.join(__dirname, 'openapi.json');
const openapiDocument = JSON.parse(fs.readFileSync(openapiPath, 'utf-8'));

export const swaggerMiddleware = [
  swaggerUi.serve,
  swaggerUi.setup(openapiDocument, {
    explorer: true,
    customSiteTitle: 'TP Backend API Docs'
  })
];
