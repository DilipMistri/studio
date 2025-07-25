import Link from 'next/link';
import { ChefHat } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link href="/" className="flex items-center space-x-2">
          <ChefHat className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold font-headline tracking-tight text-foreground">
            Fridge2Food
          </span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/favorites"
            className="text-foreground/80 transition-colors hover:text-foreground"
          >
            Favorites
          </Link>
        </nav>
      </div>
    </header>
  );
}
