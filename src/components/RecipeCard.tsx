import { Star } from 'lucide-react';
import type { Recipe } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, isFavorite, onToggleFavorite }: RecipeCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
                <CardTitle className="text-2xl font-headline">{recipe.title}</CardTitle>
                <CardDescription className="mt-1">A delicious recipe based on your ingredients.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(recipe)} aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                <Star className={cn('h-6 w-6 transition-all', isFavorite ? 'text-yellow-500 fill-yellow-400' : 'text-muted-foreground')} />
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <div>
          <h3 className="mb-2 font-headline text-lg font-semibold">Ingredients</h3>
          <ul className="list-inside list-disc space-y-1 text-card-foreground/80">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient.name} ({ingredient.quantity}) - <span className="font-semibold">{ingredient.price}</span></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-headline text-lg font-semibold">Steps</h3>
          <ol className="list-inside list-decimal space-y-2">
            {recipe.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
