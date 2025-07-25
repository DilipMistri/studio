export interface Ingredient {
    name: string;
    quantity: string;
}

export interface GeneratedRecipe {
    title: string;
    ingredients: Ingredient[];
    steps: string[];
    isValid?: boolean;
}

export type Recipe = GeneratedRecipe & { id: string };
