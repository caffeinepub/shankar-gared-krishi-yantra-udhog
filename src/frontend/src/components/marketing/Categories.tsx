import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wrench, Zap, Droplets, Bolt, Settings, Tractor } from 'lucide-react';

export default function Categories() {
  const categories = [
    {
      icon: Wrench,
      title: 'Hand Tools',
      description: 'Hammers, screwdrivers, pliers, wrenches, and precision tools for every task.',
    },
    {
      icon: Zap,
      title: 'Power Tools',
      description: 'Drills, grinders, saws, and electric equipment from trusted brands.',
    },
    {
      icon: Droplets,
      title: 'Pumps & Irrigation',
      description: 'Water pumps, sprinklers, pipes, and complete irrigation solutions.',
    },
    {
      icon: Bolt,
      title: 'Fasteners',
      description: 'Nuts, bolts, screws, anchors, and all types of fastening hardware.',
    },
    {
      icon: Settings,
      title: 'Bearings & Belts',
      description: 'Industrial bearings, V-belts, chains, and transmission components.',
    },
    {
      icon: Tractor,
      title: 'Agricultural Implements',
      description: 'Tractor parts, ploughs, cultivators, and farming equipment accessories.',
    },
  ];

  return (
    <section id="categories" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Product Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our comprehensive range of hardware and agricultural equipment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/50"
              >
                <CardHeader>
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2">{category.title}</CardTitle>
                  <CardDescription className="text-base">
                    {category.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
