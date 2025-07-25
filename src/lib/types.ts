import type { GenerateRecipeOutput } from '@/ai/flows/generate-recipe';

export type Recipe = GenerateRecipeOutput & { id: string };
