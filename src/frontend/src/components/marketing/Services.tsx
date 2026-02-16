import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function Services() {
  const services = [
    {
      title: 'Expert Guidance',
      description: 'Our knowledgeable staff helps you choose the right tools and equipment for your specific needs.',
    },
    {
      title: 'Spare Parts Sourcing',
      description: 'Hard-to-find parts? We source genuine spare parts for agricultural machinery and industrial equipment.',
    },
    {
      title: 'Equipment Servicing Coordination',
      description: 'We connect you with trusted service providers for repairs and maintenance of your machinery.',
    },
    {
      title: 'Bulk Orders',
      description: 'Special pricing and dedicated support for contractors, farmers, and industrial buyers.',
    },
    {
      title: 'Quality Assurance',
      description: 'Every product we sell meets strict quality standards. We stand behind what we sell.',
    },
    {
      title: 'Local Support',
      description: 'Community-focused service with personalized attention and after-sales support.',
    },
  ];

  return (
    <section id="services" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            More than just a shop – we're your partners in success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <CardTitle className="text-lg mb-2">{service.title}</CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
