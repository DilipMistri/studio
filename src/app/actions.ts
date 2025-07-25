'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeneratedRecipe } from '@/lib/types';

export async function generateRecipe(
  ingredients: string,
  priceRange: [number, number],
): Promise<GeneratedRecipe | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing Gemini API key');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  const prompt = `You are a recipe generating expert. Given a list of ingredients, create a recipe including the title, ingredients list (with estimated price in INR for each), and preparation steps.
The total cost of the recipe should be between ₹${priceRange[0]} and ₹${priceRange[1]}.
Ingredients: ${ingredients}
Return the response as a JSON object with the following structure: { "title": "...", "ingredients": [{ "name": "...", "price": "₹..." }, { "name": "...", "price": "₹..." }], "steps": ["...", "..."] }`;

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
