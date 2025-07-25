'use client';

import { HeartCrack } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { RecipeCard } from '@/components/RecipeCard';

export default function FavoritesPage() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  return (
    <div className="container max-w-7xl py-8 md:py-12">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl lg:text-5xl">
          Your Favorite Recipes
        </h1>
        <p className="text-lg text-muted-foreground">
          All the delicious recipes you've saved. Ready to be cooked!
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={isFavorite(recipe.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
          <HeartCrack className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-semibold">No favorites yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Go generate some recipes and save the ones you love!
          </p>
        </div>
      )}
    </div>
  );
}
