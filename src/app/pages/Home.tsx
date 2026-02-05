import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Users, LineChart, Shield } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { useSEO } from '@/app/hooks/useSEO';
import heroImage from 'figma:asset/3cfeb853f6614dc6b7474e4b00aeab779337a287.png';

export function Home() {
  useSEO({
    title: 'Home',
    description: 'Expert real estate development consulting for churches. We help you maximize your property\'s potential while staying true to your mission.'
  });
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

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section 
        className="relative bg-cover bg-center py-32 px-4 min-h-[600px] flex items-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Color overlay to match theme - brown/green tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-secondary/70 to-primary/75" />
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-white">
            Transforming Church Properties
            <span className="block text-accent-foreground mt-2">Into Community Assets</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Expert real estate development consulting designed specifically for churches. 
            We help you maximize your property's potential while staying true to your mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-accent hover:bg-accent/90">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">How We Serve Churches, Ministries, and Institutions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive consulting services tailored to the unique needs of faith communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl mb-4">Ready to Explore Your Options?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Schedule a consultation to discuss how we can help your church achieve its real estate goals.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-accent hover:bg-accent/90">
              Contact Us Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}