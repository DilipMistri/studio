'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeneratedRecipe } from '@/lib/types';

export async function generateRecipe(
  ingredients: string
): Promise<GeneratedRecipe | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing Gemini API key');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
  });

  const prompt = `You are a recipe generating expert. Given a list of ingredients, create a recipe including the title, ingredients list, and preparation steps.
Ingredients: ${ingredients}
Return the response as a JSON object with the following structure: { "title": "...", "ingredients": ["...", "..."], "steps": ["...", "..."] }`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the text to ensure it's valid JSON
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const recipe: GeneratedRecipe = JSON.parse(jsonString);
    return recipe;
  } catch (error) {
    console.error('Error generating recipe:', error);
    return null;
  }
}
