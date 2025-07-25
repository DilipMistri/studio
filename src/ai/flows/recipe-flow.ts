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
  language: z.string().describe('The language for the generated recipe (e.g., English, Gujarati).'),
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
The ingredient quantities should be in grams or kilograms as appropriate for the serving size.
The generated recipe must be in the following language: {{language}}.`,
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

const ValidateIngredientsInputSchema = z.object({
    ingredients: z.string().describe('A comma-separated list of ingredients.'),
});

const ValidateIngredientsOutputSchema = z.object({
    isValid: z.boolean().describe('Whether the input is a valid list of ingredients.'),
    language: z.string().describe('The detected language of the ingredients (e.g., "English", "Gujarati", "Unknown").'),
});

const validationPrompt = ai.definePrompt({
    name: 'validationPrompt',
    input: { schema: ValidateIngredientsInputSchema },
    output: { schema: ValidateIngredientsOutputSchema },
    prompt: `You are an expert at validating user input for a recipe app.
The user has provided the following list of ingredients: {{ingredients}}.
Check if this looks like a valid list of food ingredients. It should not be a random string.
Also, detect if the language is English or Gujarati. If it is neither, mark the language as "Unknown".`,
});

export const validateIngredientsFlow = ai.defineFlow(
    {
        name: 'validateIngredientsFlow',
        inputSchema: ValidateIngredientsInputSchema,
        outputSchema: ValidateIngredientsOutputSchema,
    },
    async (input) => {
        const { output } = await validationPrompt.generate({ input });
        if (!output) {
            throw new Error('Failed to validate ingredients.');
        }
        return output;
    }
);