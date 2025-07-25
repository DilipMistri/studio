'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getRecipe } from './actions';
import { RecipeCard } from '@/components/RecipeCard';
import type { GeneratedRecipe, Recipe } from '@/lib/types';
import {
  GenerateRecipeInput,
  GenerateRecipeInputSchema,
} from '@/ai/flows/recipe-flow';

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const { toast } = useToast();
  const { toggleFavorite, isFavorite } = useFavorites();

  const form = useForm<GenerateRecipeInput>({
    resolver: zodResolver(GenerateRecipeInputSchema),
    defaultValues: {
      ingredients: '',
      language: 'English',
    },
  });

  const onSubmit = (values: GenerateRecipeInput) => {
    setRecipe(null);
    startTransition(async () => {
      const { recipe: newRecipe, error } = await getRecipe(values);
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error generating recipe',
          description: error,
        });
      } else if (newRecipe) {
        setRecipe({ ...newRecipe, id: crypto.randomUUID() });
      }
    });
  };

  return (
    <div className="container max-w-4xl py-8 md:py-12">
      <div className="mx-auto flex w-full max-w-2xl flex-col space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl lg:text-5xl">
            Welcome to Fridge2Food
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Tell us what's in your fridge, and we'll whip up a recipe for you!
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold font-headline">
                      Ingredients
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., chicken breast, broccoli, soy sauce, rice"
                        className="min-h-[100px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the ingredients you have, separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold font-headline">
                      Language
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Gujarati">Gujarati</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the language for your recipe.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Recipe...
                  </>
                ) : (
                  'Generate Recipe'
                )}
              </Button>
            </form>
          </Form>
        </div>

        {isPending && (
          <div className="flex items-center justify-center pt-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        {recipe && (
          <div className="pt-8">
            <h2 className="mb-6 text-center text-3xl font-bold font-headline">
              Your Recipe
            </h2>
            <RecipeCard
              recipe={recipe}
              isFavorite={isFavorite(recipe.id)}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        )}
      </div>
    </div>
  );
}
