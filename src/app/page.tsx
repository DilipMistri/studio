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
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

const FormSchema = z.object({
  ingredients: z.string().min(10, {
    message: 'Please list at least a few ingredients (minimum 10 characters).',
  }),
  priceRange: z.tuple([z.number(), z.number()]).default([100, 1000]),
  servings: z.coerce.number().min(1, { message: 'Please enter at least 1 serving.' }).default(2),
});

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const { toast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 1000]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ingredients: '',
      priceRange: [100, 1000],
      servings: 2,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setGeneratedRecipe(null);
    startTransition(async () => {
      try {
        const result = await generateRecipe(data.ingredients, data.priceRange, data.servings);
        if (!result) {
            throw new Error("No recipe was generated.");
        }
        const recipeWithId: Recipe = { ...result, id: crypto.randomUUID() };
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

            <FormField
              control={form.control}
              name="priceRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Range (INR)</FormLabel>
                   <FormControl>
                    <Slider
                      min={0}
                      max={5000}
                      step={50}
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setPriceRange(value as [number, number]);
                      }}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    Generate a recipe with a total cost between ₹{priceRange[0]} and ₹{priceRange[1]}.
                  </FormDescription>
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
