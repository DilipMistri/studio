'use client';

import { useFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const { favorites } = useFavorites();

  return (
    <div className="container max-w-4xl py-8 md:py-12">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl lg:text-5xl">
            Welcome to Fridge2Food
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your personal assistant for turning fridge leftovers into delicious meals.
          </p>
        </div>

        <div className="p-8 text-center bg-card border rounded-lg">
            <h2 className="text-2xl font-bold font-headline tracking-tight">
                Get Started
            </h2>
            <p className="mt-2 text-muted-foreground">
                View your saved recipes or start fresh.
            </p>
            <div className="mt-6">
                <Button asChild size="lg">
                    <Link href="/favorites">View Your Favorite Recipes ({favorites.length})</Link>
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
