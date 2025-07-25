'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Recipe } from '@/lib/types';
import { useToast } from './use-toast';

const FAVORITES_KEY = 'fridge2food-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(FAVORITES_KEY);
      if (item) {
        setFavorites(JSON.parse(item));
      }
    } catch (error) {
      console.error('Failed to parse favorites from localStorage', error);
      setFavorites([]);
    }
  }, []);

  const saveFavorites = useCallback((newFavorites: Recipe[]) => {
    try {
      setFavorites(newFavorites);
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to save favorites to localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save your favorites.',
      });
    }
  }, [toast]);

  const addFavorite = useCallback((recipe: Recipe) => {
    const newFavorites = [...favorites, recipe];
    saveFavorites(newFavorites);
    toast({
      title: 'Added to Favorites!',
      description: `"${recipe.title}" has been saved.`,
    });
  }, [favorites, saveFavorites, toast]);

  const removeFavorite = useCallback((recipeId: string) => {
    const recipeToRemove = favorites.find(f => f.id === recipeId);
    const newFavorites = favorites.filter((fav) => fav.id !== recipeId);
    saveFavorites(newFavorites);
    if(recipeToRemove) {
        toast({
            title: 'Removed from Favorites',
            description: `"${recipeToRemove.title}" has been removed.`,
        });
    }
  }, [favorites, saveFavorites, toast]);

  const isFavorite = useCallback((recipeId: string) => {
    return favorites.some((fav) => fav.id === recipeId);
  }, [favorites]);

  const toggleFavorite = useCallback((recipe: Recipe) => {
      if (isFavorite(recipe.id)) {
          removeFavorite(recipe.id);
      } else {
          addFavorite(recipe);
      }
  }, [isFavorite, addFavorite, removeFavorite]);

  return { favorites, toggleFavorite, isFavorite };
}
