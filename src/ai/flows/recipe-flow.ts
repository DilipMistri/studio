'use server';

/**
 * @fileOverview A recipe generation AI flow.
 *
 * - generateRecipe - A function that handles the recipe generation process.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GeneratedRecipe - The return type for the generateRecipe function, which is also used application-wide.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GeneratedRecipe } from '@/lib/types';

export const GenerateRecipeInputSchema = z.object({
  ingredients: z.string().describe('A comma-separated list of ingredients.'),
  language: z.string().optional().describe('The language for the generated recipe (e.g., "English", "Gujarati"). Defaults to English.'),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const RecipeSchema = z.object({
  title: z.string().describe('The title of the recipe.'),
  ingredients: z.array(z.object({
    name: z.string().describe("The name of the ingredient."),
    quantity: z.string().describe("The quantity of the ingredient."),
  })).describe('The list of ingredients for the recipe.'),
  steps: z.array(z.string()).describe('The steps to prepare the recipe.'),
});

const generateRecipePrompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: { schema: GenerateRecipeInputSchema },
  output: { schema: RecipeSchema },
  prompt: `You are an expert chef. Create a recipe using the following ingredients: {{{ingredients}}}.
The recipe should be in {{{language}}}.`,
});

const recipeFlow = ai.defineFlow(
  {
    name: 'recipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: RecipeSchema,
  },
  async (input) => {
    const { output } = await generateRecipePrompt(input);
    return output!;
  }
);

export async function generateRecipe(input: GenerateRecipeInput): Promise<GeneratedRecipe> {
  return await recipeFlow(input);
}
