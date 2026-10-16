import { Link } from 'react-router-dom';
import { ArrowRight, Building2, ChevronDown, Users, LineChart, Shield } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useSEO } from '@/app/hooks/useSEO';
import { AXES, QUADRANTS, type QuadrantId } from '@/app/exercises/fit-and-carry/content';
import heroImage from 'figma:asset/3cfeb853f6614dc6b7474e4b00aeab779337a287.png';

const DIAGNOSTIC = {
  scrollHint: 'See the Fit and Carry diagnostic',
  kicker: 'Free diagnostic',
  title: 'Fit and Carry',
  body: 'Twenty questions to help your leadership team see your building clearly: whether it still serves your mission, and whether you can carry it over the long haul. You will see where your church lands and what is driving that result.',
  button: 'Take the diagnostic',
  meta: 'About 10 minutes. Best done by several leaders, then compared.',
};

const services = [
  {
    icon: Building2,
    title: 'Property Assessment',
    description: 'Comprehensive evaluation of your church property potential and development opportunities.',
  },
  {
    icon: LineChart,
    title: 'Strategic Planning',
    description: 'Long-term real estate strategies aligned with your church mission and community needs.',
  },
  {
    icon: Users,
    title: 'Community Engagement',
    description: 'Guidance on creating spaces that serve both congregation and community effectively.',
  },
  {
    icon: Shield,
    title: 'Risk Management',
    description: 'Expert advice on navigating zoning, regulations, and development challenges.',
  },
];

export function Home() {
  useSEO({
    title: 'Home',
    description: 'Your building should be a support to your ministry, not a barrier. We help you understand and navigate your real estate options.',
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative bg-cover bg-center bg-no-repeat py-24 md:py-28 px-4 min-h-[540px] flex items-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-secondary/70 to-primary/75" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-white leading-tight">
            Transforming Church Properties
            <span className="block text-[#f5f2ed] mt-1">Into Community Assets</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Your building should be a support to your ministry, not a barrier. We help you understand and navigate your real estate options.
          </p>
        </div>

        <a
          href="#fit-and-carry"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('fit-and-carry')?.scrollIntoView({ behavior: 'smooth' });
          }}
          aria-label={DIAGNOSTIC.scrollHint}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 p-3 rounded-full text-white/75 hover:text-white transition-colors"
        >
          <ChevronDown className="size-8 sdc-drift" strokeWidth={1.5} />
        </a>
        <style>{`
          @keyframes sdc-drift { 0%, 100% { transform: translateY(0); opacity: .75; } 50% { transform: translateY(6px); opacity: 1; } }
          @media (prefers-reduced-motion: no-preference) { .sdc-drift { animation: sdc-drift 2.8s ease-in-out infinite; } }
        `}</style>
      </section>

      {/* Fit and Carry feature */}
      <section id="fit-and-carry" className="py-20 md:py-24 px-4 scroll-mt-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-accent-strong mb-3">{DIAGNOSTIC.kicker}</p>
            <h2 className="text-4xl md:text-5xl mb-6">{DIAGNOSTIC.title}</h2>
            <dl className="space-y-4 mb-6">
              {(['fit', 'carry'] as const).map((axis) => (
                <div key={axis} className="border-l-2 border-accent pl-4">
                  <dt className="text-sm text-muted-foreground">{AXES[axis].name}</dt>
                  <dd className="font-serif italic text-xl text-primary">{AXES[axis].question}</dd>
                </div>
              ))}
            </dl>
            <p className="text-lg leading-relaxed text-foreground/85 mb-8">{DIAGNOSTIC.body}</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link to="/fit-and-carry">
                <Button size="lg" className="h-12 px-7 text-base">
                  {DIAGNOSTIC.button} <ArrowRight />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">{DIAGNOSTIC.meta}</p>
            </div>
          </div>

          <QuadrantPreview />
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-24 px-4 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
          <div>
            <h2 className="text-3xl md:text-4xl leading-tight lg:sticky lg:top-28">
              How We Serve Churches, Ministries, and Institutions
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-10">
            {services.map((service, i) => (
              <div key={service.title} className={`py-7 border-t border-border ${i < 2 ? 'sm:border-t-0 sm:pt-0' : ''} ${i === 0 ? 'border-t-0 pt-0' : ''}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="size-10 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                    <service.icon className="size-5 text-accent-strong" />
                  </span>
                  <h3 className="text-xl">{service.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto rounded-2xl bg-primary text-primary-foreground px-8 py-12 md:px-14 md:py-14 grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl mb-3">Ready to Explore Your Options?</h2>
            <p className="text-lg text-primary-foreground/85">
              Schedule a consultation to discuss how we can help your church achieve its real estate goals.
            </p>
          </div>
          <Link to="/contact">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground h-12 px-7 text-base">
              Contact Us Today <ArrowRight />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

// A static picture of the Fit and Carry grid: Fit runs up the side, Carry along the bottom.
// Green deepens toward Steward: light where things are hardest, solid where they are healthiest.
const SHADES: Record<QuadrantId, string> = {
  transform: 'bg-[#f1f5ea]',
  share: 'bg-[#dfe9cf]',
  repurpose: 'bg-[#dfe9cf]',
  steward: 'bg-[#b9d08f]',
};

function QuadrantPreview() {
  const cells: QuadrantId[] = ['share', 'steward', 'transform', 'repurpose'];
  return (
    <div className="relative pl-8 pb-8">
      <div className="grid grid-cols-2 rounded-xl overflow-hidden border border-border bg-border gap-px shadow-sm">
        {cells.map((id) => (
          <Link
            key={id}
            to="/fit-and-carry"
            className={`relative ${SHADES[id]} p-5 md:p-7 aspect-square sm:aspect-[5/4] flex flex-col justify-end hover:brightness-[0.97] transition group`}
          >
            {id === 'steward' && (
              // An example dot, sitting in the empty top of the Steward square
              <span className="absolute left-[38%] top-[28%] size-4 rounded-full bg-primary ring-4 ring-white/60 border-2 border-white" aria-hidden />
            )}
            <span className="font-serif text-2xl md:text-3xl mb-1 group-hover:text-primary">{QUADRANTS[id].name}</span>
            <span className={`font-serif italic text-sm md:text-base leading-snug ${id === 'steward' ? 'text-[#2f3d1f]' : 'text-muted-foreground'}`}>{QUADRANTS[id].question}</span>
          </Link>
        ))}
      </div>
      {/* Axis labels */}
      <span className="absolute left-0 top-0 bottom-8 flex items-center">
        <span className="-rotate-90 whitespace-nowrap text-xs uppercase tracking-widest text-muted-foreground">{AXES.fit.name} →</span>
      </span>
      <span className="absolute left-8 right-0 bottom-0 text-center text-xs uppercase tracking-widest text-muted-foreground">
        {AXES.carry.name} →
      </span>
    </div>
  );
}
