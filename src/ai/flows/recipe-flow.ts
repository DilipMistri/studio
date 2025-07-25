'use server';
/**
 * @fileOverview A recipe generation AI flow.
 *
 * - generateRecipeFlow - A function that handles the recipe generation process.
 * - GenerateRecipeFlowInput - The input type for the generateRecipeFlow function.
 * - GenerateRecipeFlowOutput - The return type for the generateRecipeFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit/zod';

const RecipeIngredientSchema = z.object({
    name: z.string().describe('Name of the ingredient'),
    quantity: z.string().describe('Quantity of the ingredient (e.g., 1 cup, 200g)'),
});

const GenerateRecipeFlowInputSchema = z.object({
  ingredients: z.string().describe('A comma-separated list of ingredients.'),
  servings: z.number().describe('The number of servings the recipe should be for.'),
});
export type GenerateRecipeFlowInput = z.infer<typeof GenerateRecipeFlowInputSchema>;

const GenerateRecipeFlowOutputSchema = z.object({
  title: z.string().describe('The title of the recipe.'),
  ingredients: z.array(RecipeIngredientSchema).describe('A list of ingredients with their quantities.'),
  steps: z.array(z.string()).describe('The steps to prepare the recipe.'),
});
export type GenerateRecipeFlowOutput = z.infer<typeof GenerateRecipeFlowOutputSchema>;


const recipePrompt = ai.definePrompt({
    name: 'recipePrompt',
    input: { schema: GenerateRecipeFlowInputSchema },
    output: { schema: GenerateRecipeFlowOutputSchema },
    prompt: `You are a recipe generating expert. Given a list of ingredients, create a recipe.
The recipe should be for {{servings}} servings.
Ingredients: {{ingredients}}
The ingredient quantities should be in grams or kilograms as appropriate for the serving size.`,
});

export const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeFlowInputSchema,
    outputSchema: GenerateRecipeFlowOutputSchema,
  },
  async (input) => {
    const { output } = await recipePrompt.generate({
        input: input,
    });

    if (!output) {
        throw new Error('Failed to generate recipe from LLM.');
    }
    
    return output;
  }
);
