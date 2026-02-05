import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Building2, Users, TrendingUp, Church, MapPin, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function OurWork() {
  const caseStudies = [
    {
      title: 'Grace Community Church',
      location: 'Portland, OR',
      type: 'Multi-Use Development',
      image: 'church community building',
      challenge: 'Grace Community Church owned a 3-acre property with aging facilities and declining attendance. They needed to reimagine their space to better serve their community while generating sustainable revenue.',
      solution: 'We conducted a comprehensive property assessment and community needs analysis. Our team developed a phased plan that included renovating the worship space, adding a community center with rental spaces, and partnering with a local nonprofit for affordable housing units.',
      results: [
        'Generated $180K in annual rental income',
        'Increased community engagement by 200%',
        'Provided 24 affordable housing units',
        'Maintained worship space and enhanced facilities'
      ],
      icon: Building2,
      color: 'primary'
    },
    {
      title: 'First Baptist Church',
      location: 'Austin, TX',
      type: 'Property Sale & Relocation',
      image: 'modern church building',
      challenge: 'Located on prime downtown real estate, First Baptist faced high maintenance costs and declining membership. The building was too large for their needs, but held significant sentimental value for the congregation.',
      solution: 'We facilitated sensitive conversations with church leadership and members, developed a strategic sale plan, and identified a suitable suburban property. We managed the entire transition including zoning approvals and facility design for their new location.',
      results: [
        'Sold property for $4.2M above market estimate',
        'Purchased and built new facility debt-free',
        'Created $1.5M endowment fund',
        'Strengthened community connections in new location'
      ],
      icon: TrendingUp,
      color: 'accent'
    },
    {
      title: 'St. Mark\'s Episcopal Church',
      location: 'Seattle, WA',
      type: 'Adaptive Reuse Consultation',
      image: 'historic church',
      challenge: 'A historic church building with underutilized space during weekdays. The congregation wanted to increase community impact without compromising their historic sanctuary or mission.',
      solution: 'We identified opportunities for weekday programming partnerships, helped negotiate agreements with a preschool and community music program, and guided renovations that respected the building\'s historic character while meeting modern accessibility standards.',
      results: [
        'Added 3 community partner organizations',
        'Served 150+ children through weekday programs',
        'Preserved historic landmark status',
        'Achieved operational sustainability'
      ],
      icon: Church,
      color: 'secondary'
    }
  ];

  const stats = [
    { number: '100+', label: 'Churches Served' },
    { number: '$50M+', label: 'Property Value Managed' },
    { number: '15+', label: 'Years Experience' },
    { number: '95%', label: 'Client Satisfaction' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl mb-4">Our Work</h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Real stories of transformation, stewardship, and community impact through strategic real estate development.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 px-4 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl mb-2 text-primary">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Case Studies */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-16">
            {caseStudies.map((study, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                  {/* Header */}
                  <div className="lg:col-span-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-12 h-12 rounded-lg bg-${study.color}/10 flex items-center justify-center`}>
                            <study.icon className={`w-6 h-6 text-${study.color}`} />
                          </div>
                          <div>
                            <h2 className="text-2xl">{study.title}</h2>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{study.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {study.type}
                      </div>
                    </div>
                  </div>

                  {/* Challenge */}
                  <div className="lg:col-span-3 md:lg:col-span-1">
                    <h3 className="mb-3">The Challenge</h3>
                    <p className="text-muted-foreground">{study.challenge}</p>
                  </div>

                  {/* Solution */}
                  <div className="lg:col-span-3 md:lg:col-span-1">
                    <h3 className="mb-3">Our Solution</h3>
                    <p className="text-muted-foreground">{study.solution}</p>
                  </div>

                  {/* Results */}
                  <div className="lg:col-span-3 md:lg:col-span-1">
                    <h3 className="mb-3">The Results</h3>
                    <ul className="space-y-2">
                      {study.results.map((result, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl mb-4">Your Story Could Be Next</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Every church has unique opportunities and challenges. Let's explore how we can help your congregation 
            maximize its property potential while staying true to your mission.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-accent hover:bg-accent/90">
              Start the Conversation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}