'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { generateRecipe } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RecipeCard } from '@/components/RecipeCard';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '@/hooks/useFavorites';
import type { Recipe } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

const FormSchema = z.object({
  ingredients: z.string().min(10, {
    message: 'Please list at least a few ingredients (minimum 10 characters).',
  }),
  servings: z.coerce.number().min(1, { message: 'Please enter at least 1 serving.' }).default(2),
});

// A simple random ID generator that is more widely supported.
function randomId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const { toast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ingredients: '',
      servings: 2,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setGeneratedRecipe(null);
    startTransition(async () => {
      try {
        const result = await generateRecipe(data.ingredients, data.servings);
        if (!result) {
            throw new Error("No recipe was generated.");
        }
        const recipeWithId: Recipe = { ...result, id: randomId() };
        setGeneratedRecipe(recipeWithId);
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem generating your recipe. Please try again.',
        });
      }
    });
  }

  return (
    <div className="container max-w-4xl py-8 md:py-12">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl lg:text-5xl">
            What's in your fridge?
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Enter the ingredients you have, and we'll whip up a recipe for you!
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Your Ingredients</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., chicken breast, broccoli, garlic, olive oil, rice"
                      className="min-h-[100px] resize-none text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Separate your ingredients with commas for the best results.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="servings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servings</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full text-lg py-6">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Recipe'
              )}
            </Button>
          </form>
        </Form>

        {isPending && (
          <div className="space-y-4 pt-8">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        )}

        {generatedRecipe && (
          <div className="pt-8">
             <RecipeCard
                recipe={generatedRecipe}
                isFavorite={isFavorite(generatedRecipe.id)}
                onToggleFavorite={toggleFavorite}
              />
          </div>
        )}
      </div>
    </div>
  );
}
