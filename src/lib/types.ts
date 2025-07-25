export interface GeneratedRecipe {
    title: string;
    ingredients: string[];
    steps: string[];
}

export type Recipe = GeneratedRecipe & { id: string };
