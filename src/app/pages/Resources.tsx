import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { FileText, Video, BookOpen, Download, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { useSEO } from '@/app/hooks/useSEO';

// TODO: Replace these with your actual Email.js credentials
// Sign up at https://www.emailjs.com/ to get these values
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_NEWSLETTER_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

interface NewsletterFormData {
  email: string;
}

export function Resources() {
  useSEO({
    title: 'Resources',
    description: 'Guides, tools, and case studies to help churches make informed property development decisions.'
  });

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<NewsletterFormData>();

  const onSubscribe = async (data: NewsletterFormData) => {
    setSubmitStatus('loading');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          subscriber_email: data.email,
          subscription_type: 'Newsletter',
        },
        EMAILJS_PUBLIC_KEY
      );

      setSubmitStatus('success');
      reset();
    } catch (error) {
      setSubmitStatus('error');
      console.error('Email.js error:', error);
    }
  };

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

          {submitStatus === 'success' ? (
            <p className="text-green-700 font-medium">
              Thank you for subscribing! We'll be in touch soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit(onSubscribe)} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Your email address"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email'
                    }
                  })}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1 text-left">{errors.email.message}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={submitStatus === 'loading'}
                className="bg-primary hover:bg-primary/90"
              >
                {submitStatus === 'loading' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : submitStatus === 'error' ? (
                  'Try Again'
                ) : (
                  'Subscribe'
                )}
              </Button>
            </form>
          )}

          {submitStatus === 'error' && (
            <p className="text-red-600 text-sm mt-2">
              Failed to subscribe. Please try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
