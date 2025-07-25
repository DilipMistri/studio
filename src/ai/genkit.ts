/**
 * @fileoverview This file initializes and configures the Genkit AI instance.
 * It sets up the necessary plugins, such as Google AI, to enable generative
 * AI capabilities throughout the application. The exported `ai` object
 * should be used to define flows, prompts, and other Genkit functionalities.
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Initialize Genkit with the Google AI plugin.
// This makes Google's AI models, like Gemini, available for use in the app.
export const ai = genkit({
  plugins: [googleAI()],
});
