import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { STORE_ADDRESS, getGoogleMapsURL } from '@/lib/storeAddress';

export default function Contact() {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      content: STORE_ADDRESS,
      link: getGoogleMapsURL(),
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+91 99282 81833',
      link: 'tel:+919928281833',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'sgkyu@gmail.com',
      link: 'mailto:sgkyu@gmail.com',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Mon - Sat: 9:00 AM - 7:00 PM\nSunday: 10:00 AM - 5:00 PM',
      link: null,
    },
  ];

  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visit us today or reach out for any inquiries. We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 inline-flex p-4 rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg mb-2">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-muted-foreground hover:text-primary transition-colors whitespace-pre-line focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                      target={info.link.startsWith('http') ? '_blank' : undefined}
                      rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-muted-foreground whitespace-pre-line">{info.content}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center bg-primary/5 rounded-lg p-8 md:p-12 border-2 border-primary/20">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Whether you need a single tool or equipment for a major project, we're ready to serve you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base font-semibold" asChild>
              <a href="tel:+919928281833" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Call Now
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-base font-semibold" asChild>
              <a
                href={getGoogleMapsURL()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MapPin className="h-5 w-5" />
                Visit Our Store
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
