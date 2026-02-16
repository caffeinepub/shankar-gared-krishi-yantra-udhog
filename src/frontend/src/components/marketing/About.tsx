export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
            About Shankar Gared Krishi Yantra Udhog
          </h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              For years, Shankar Gared Krishi Yantra Udhog has been the go-to destination for farmers, 
              contractors, and builders seeking quality hardware and agricultural equipment. We understand 
              the demands of your work because we're part of the same community.
            </p>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Our commitment is simple: provide genuine products, fair prices, and honest advice. Whether 
              you need a single bolt or a complete irrigation system, we treat every customer with the same 
              dedication and respect.
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              We stock products from trusted manufacturers and maintain strong relationships with suppliers 
              to ensure you get what you need, when you need it. Our team's expertise spans traditional hand 
              tools to modern agricultural machinery, making us your one-stop shop for all hardware needs.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Products in Stock</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
