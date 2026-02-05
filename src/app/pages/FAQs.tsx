import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';
import { useSEO } from '@/app/hooks/useSEO';

export function FAQs() {
  useSEO({
    title: 'FAQs',
    description: 'Find answers to common questions about church real estate consulting, property development, zoning, and our services.'
  });
  const faqs = [
    {
      question: 'What types of churches do you work with?',
      answer: 'We work with churches of all sizes and denominations. Whether you\'re a small community church exploring your first property expansion or a large institution managing multiple properties, we tailor our services to meet your specific needs and context.',
    },
    {
      question: 'How much does a consultation cost?',
      answer: 'Our initial consultation is complimentary. During this meeting, we discuss your situation and provide a clear proposal outlining services and costs. Our fee structure is transparent and designed to be accessible for churches of varying budgets.',
    },
    {
      question: 'What is the typical timeline for a project?',
      answer: 'Project timelines vary significantly based on scope and complexity. A simple property assessment might take 2-4 weeks, while a comprehensive development plan could span several months. We provide detailed timelines during our initial consultation.',
    },
    {
      question: 'Do you help with zoning and regulatory issues?',
      answer: 'Yes! Navigating zoning laws, building codes, and local regulations is one of our core services. We have extensive experience working with municipal authorities and can help ensure your project complies with all applicable regulations.',
    },
    {
      question: 'Can you help us determine if development is right for our church?',
      answer: 'Absolutely. Not every church needs to develop their property, and we\'ll give you honest advice about whether development aligns with your mission and resources. Our assessment process helps you make informed decisions.',
    },
    {
      question: 'Do you work with churches considering property sales?',
      answer: 'Yes. We provide consultation for churches considering selling property, including market analysis, timing recommendations, and connecting you with appropriate real estate professionals. We ensure any sale decision aligns with your long-term mission.',
    },
    {
      question: 'What about churches wanting to create affordable housing or community spaces?',
      answer: 'This is one of our areas of expertise. We\'ve helped numerous churches develop mixed-use properties that include affordable housing, community centers, and mission-aligned commercial spaces. We can guide you through this complex but rewarding process.',
    },
    {
      question: 'How do you ensure development aligns with our church\'s mission?',
      answer: 'Mission alignment is at the heart of everything we do. We begin every project by deeply understanding your values, goals, and community context. All recommendations are filtered through this lens to ensure they support rather than compromise your mission.',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about our services and approach.
          </p>
        </div>

        {/* FAQs Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6 bg-card">
              <AccordionTrigger className="hover:no-underline py-4">
                <span className="text-left pr-4">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="mt-12 p-6 bg-accent/5 rounded-lg text-center">
          <h3 className="mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            We're here to help. Reach out for a free consultation.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
