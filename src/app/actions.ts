'use server';

import type { GeneratedRecipe } from '@/lib/types';
import { generateRecipe, GenerateRecipeInput } from '@/ai/flows/recipe-flow';

export async function getRecipe(
  input: GenerateRecipeInput
): Promise<{ recipe: GeneratedRecipe | null; error?: string }> {
  try {
    const recipe = await generateRecipe(input);
    return { recipe };
  } catch (e: any) {
    console.error(e);
    const error = e.message || 'An unexpected error occurred.';
    return { recipe: null, error };
  }
}
