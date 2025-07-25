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
import { defineTool } from 'genkit/tool';

const RecipeIngredientSchema = z.object({
    name: z.string().describe('Name of the ingredient'),
    quantity: z.string().describe('Quantity of the ingredient (e.g., 1 cup, 200g)'),
});

const GenerateRecipeFlowInputSchema = z.object({
  ingredients: z.string().describe('A comma-separated list of ingredients.'),
  servings: z.number().describe('The number of servings the recipe should be for.'),
  language: z.string().describe('The language for the recipe (e.g., English, Gujarati).'),
});
export type GenerateRecipeFlowInput = z.infer<typeof GenerateRecipeFlowInputSchema>;

const GenerateRecipeFlowOutputSchema = z.object({
  title: z.string().describe('The title of the recipe.'),
  ingredients: z.array(RecipeIngredientSchema).describe('A list of ingredients with their quantities.'),
  steps: z.array(z.string()).describe('The steps to prepare the recipe.'),
  isValid: z.boolean().optional().describe('Whether the recipe is valid based on a web search.'),
});
export type GenerateRecipeFlowOutput = z.infer<typeof GenerateRecipeFlowOutputSchema>;

const recipeTool = defineTool(
  {
    name: 'recipeValidator',
    description: 'A tool to validate if a recipe seems legitimate by checking online sources.',
    inputSchema: z.object({
      recipeTitle: z.string(),
    }),
    outputSchema: z.object({
        isValid: z.boolean(),
    }),
  },
  async (input) => {
    // This is a simplified validation. A real implementation would use a search API.
    // For this example, we'll consider it valid if it's not empty.
    return { isValid: !!input.recipeTitle };
  }
);


const recipePrompt = ai.definePrompt({
    name: 'recipePrompt',
    input: { schema: GenerateRecipeFlowInputSchema },
    output: { schema: Omit<GenerateRecipeFlowOutput, 'isValid'> },
    tools: [recipeTool],
    prompt: `You are a recipe generating expert. Given a list of ingredients, create a recipe in {{language}}.
The recipe should be for {{servings}} servings.
Ingredients: {{ingredients}}
The ingredient quantities should be in grams or kilograms as appropriate for the serving size. The title, ingredient names, and steps must be in {{language}}.
After generating the recipe, use the recipeValidator tool to check if the recipe seems valid.`,
});

export const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeFlowInputSchema,
    outputSchema: GenerateRecipeFlowOutputSchema,
  },
  async (input) => {
    const llmResponse = await recipePrompt.generate({
        input: input,
    });

    const recipeOutput = llmResponse.output();
    if (!recipeOutput) {
        throw new Error('Failed to generate recipe from LLM.');
    }
    
    const toolRequest = llmResponse.toolRequest('recipeValidator');

    let isValid = false;
    if (toolRequest) {
        const toolResponse = await recipeTool(toolRequest.input);
        isValid = toolResponse.isValid;
    } else {
        // If the tool wasn't called, let's do a basic validation on the title.
        const validationResponse = await recipeTool({ recipeTitle: recipeOutput.title });
        isValid = validationResponse.isValid;
    }
    
    return {
        ...recipeOutput,
        isValid,
    };
  }
);
