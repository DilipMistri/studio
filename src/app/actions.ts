'use server';

import { generateRecipeFlow, GenerateRecipeFlowInput, validateIngredientsFlow } from '@/ai/flows/recipe-flow';
import { GeneratedRecipe } from '@/lib/types';


export async function generateRecipe(
  input: GenerateRecipeFlowInput
): Promise<GeneratedRecipe | null> {
  try {
    const validationResult = await validateIngredientsFlow({ ingredients: input.ingredients });
    if (!validationResult.isValid) {
        throw new Error("Invalid ingredients list provided.");
    }

    const result = await generateRecipeFlow(input);
    return result;
  } catch (error) {
    console.error('Error generating recipe:', error);
    return null;
  }
}