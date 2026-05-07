import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'givebutter-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { id: string };
    }
  }
}
import { useSEO } from '../hooks/useSEO';

export function Give() {
  useSEO({
    title: 'Give | Sanctuary DC',
    description: 'Support our mission by making a donation to Sanctuary DC.',
  });

  return (
    <main className="min-h-screen">
      {/* Hero / Header */}
      <section className="py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Support Our Work</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your generosity helps us serve our community. Every gift makes a difference.
        </p>
      </section>

      {/* Givebutter Embed */}
      <section className="py-8 px-4 max-w-3xl mx-auto">
        <givebutter-widget id="p5M4x8"></givebutter-widget>
      </section>
    </main>
  );
}
