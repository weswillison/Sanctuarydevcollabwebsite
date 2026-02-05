import { Card } from '@/app/components/ui/card';
import { FileText, Video, BookOpen, Download } from 'lucide-react';

export function Resources() {
  const guides = [
    {
      title: 'Property Assessment Checklist',
      description: 'A comprehensive guide to evaluating your church property\'s development potential.',
      type: 'PDF Guide',
      icon: FileText,
    },
    {
      title: 'Understanding Zoning for Churches',
      description: 'Navigate zoning regulations and restrictions that affect church properties.',
      type: 'Article',
      icon: BookOpen,
    },
    {
      title: 'Community Impact Planning',
      description: 'How to ensure your development serves both congregation and community needs.',
      type: 'Webinar',
      icon: Video,
    },
    {
      title: 'Financial Planning for Church Development',
      description: 'Key considerations for budgeting and funding your property project.',
      type: 'PDF Guide',
      icon: Download,
    },
  ];

  const caseStudies = [
    {
      title: 'Urban Church Adaptive Reuse',
      location: 'Portland, OR',
      description: 'How a historic church transformed their underutilized parish hall into a community center and affordable housing.',
    },
    {
      title: 'Suburban Campus Expansion',
      location: 'Austin, TX',
      description: 'Strategic property acquisition and development enabled a growing church to serve their expanding community.',
    },
    {
      title: 'Rural Church Property Partnership',
      location: 'Lancaster, PA',
      description: 'A small rural church partnered with a local nonprofit to develop shared community spaces.',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4">Resources</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Helpful guides, articles, and case studies to inform your church property decisions.
          </p>
        </div>

        {/* Guides Section */}
        <div className="mb-16">
          <h2 className="text-3xl mb-8">Guides & Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <guide.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3>{guide.title}</h3>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded whitespace-nowrap">
                        {guide.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{guide.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Case Studies Section */}
        <div>
          <h2 className="text-3xl mb-8">Case Studies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((study, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="mb-3">
                  <h3 className="mb-1">{study.title}</h3>
                  <p className="text-sm text-accent">{study.location}</p>
                </div>
                <p className="text-sm text-muted-foreground">{study.description}</p>
                <div className="mt-4 text-sm text-primary hover:text-accent transition-colors">
                  Read more →
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 p-8 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg text-center">
          <h2 className="text-2xl mb-3">Stay Informed</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Subscribe to our newsletter for the latest insights, case studies, and resources for church property development.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2 rounded-md border border-border bg-background"
            />
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
