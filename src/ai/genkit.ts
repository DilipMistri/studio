import { genkit, configureGenkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import {-next-js} from 'genkit/plugins';
import dotenv from 'dotenv';

dotenv.config();

configureGenkit({
  plugins: [
    googleAI({
        apiVersion: 'v1beta',
    }),
    -next-js(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export const ai = genkit;
