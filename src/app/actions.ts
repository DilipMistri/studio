'use server';

import { generateRecipeFlow, GenerateRecipeFlowInput } from '@/ai/flows/recipe-flow';
import { GeneratedRecipe } from '@/lib/types';


export async function generateRecipe(
  input: GenerateRecipeFlowInput
): Promise<GeneratedRecipe | null> {
  try {
    const result = await generateRecipeFlow(input);
    return result;
  } catch (error) {
    console.error('Error generating recipe:', error);
    return null;
  }
}
