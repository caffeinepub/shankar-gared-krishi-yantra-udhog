import { Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getGoogleMapsURL } from '@/lib/storeAddress';

export default function Hero() {
  return (
    <section id="hero" className="relative pt-20 min-h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/generated/Gemini_Generated_Image_i78ybxi78ybxi78y.png"
          alt="Hardware tools and agricultural machinery"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/90 to-background" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Your Trusted Partner for Quality Hardware & Agricultural Equipment
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Serving farmers and builders with premium tools, machinery parts, and expert guidance. 
            From hand tools to irrigation systems, we have everything you need to get the job done right.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="text-base font-semibold"
              asChild
            >
              <a href="tel:+919928281833" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Call Now
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base font-semibold"
              asChild
            >
              <a
                href={getGoogleMapsURL()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MapPin className="h-5 w-5" />
                Get Directions
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
