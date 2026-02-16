import { useState, useEffect } from 'react';
import { Menu, X, Package, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  currentView: 'marketing' | 'products' | 'shop' | 'buy';
  onViewChange: (view: 'marketing' | 'products' | 'shop' | 'buy') => void;
}

export default function Header({ currentView, onViewChange }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (currentView !== 'marketing') {
      onViewChange('marketing');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'Products', id: 'categories' },
    { label: 'Services', id: 'services' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-md' : 'bg-background'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => {
              onViewChange('marketing');
              setTimeout(() => scrollToSection('hero'), 100);
            }}
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <img
              src="/assets/generated/Gemini_Generated_Image_8fgrd38fgrd38fgr.png"
              alt="Shankar Gared Krishi Yantra Udhog Logo"
              className="h-12 w-auto object-contain"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {currentView === 'marketing' ? (
              <>
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-md hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {link.label}
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewChange('shop')}
                  className="ml-2"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Shop
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewChange('products')}
                  className="ml-1"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Manage Products
                </Button>
              </>
            ) : currentView === 'products' || currentView === 'shop' || currentView === 'buy' ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewChange('marketing')}
                >
                  Home
                </Button>
                {currentView !== 'shop' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewChange('shop')}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Shop
                  </Button>
                )}
                {currentView !== 'products' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewChange('products')}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Manage Products
                  </Button>
                )}
              </>
            ) : null}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-border mt-2 pt-4">
            <div className="flex flex-col gap-2">
              {currentView === 'marketing' ? (
                <>
                  {navLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => scrollToSection(link.id)}
                      className="px-4 py-3 text-left text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {link.label}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      onViewChange('shop');
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-left text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center gap-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Shop
                  </button>
                  <button
                    onClick={() => {
                      onViewChange('products');
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-left text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    Manage Products
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onViewChange('marketing');
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-left text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Home
                  </button>
                  {currentView !== 'shop' && (
                    <button
                      onClick={() => {
                        onViewChange('shop');
                        setIsMobileMenuOpen(false);
                      }}
                      className="px-4 py-3 text-left text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center gap-2"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Shop
                    </button>
                  )}
                  {currentView !== 'products' && (
                    <button
                      onClick={() => {
                        onViewChange('products');
                        setIsMobileMenuOpen(false);
                      }}
                      className="px-4 py-3 text-left text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center gap-2"
                    >
                      <Package className="h-4 w-4" />
                      Manage Products
                    </button>
                  )}
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
