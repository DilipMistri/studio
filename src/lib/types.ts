export interface Ingredient {
    name: string;
    quantity: string;
    price: string;
}

export interface GeneratedRecipe {
    title: string;
    ingredients: Ingredient[];
    steps: string[];
}

export type Recipe = GeneratedRecipe & { id: string };
