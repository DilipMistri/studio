import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import {nextJs} from 'genkit/plugins';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export const ai = genkit({
  plugins: [
    googleAI({
        apiVersion: 'v1beta',
    }),
    nextJs(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
