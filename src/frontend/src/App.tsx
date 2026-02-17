import { useState } from 'react';
import Header from './components/marketing/Header';
import Hero from './components/marketing/Hero';
import Categories from './components/marketing/Categories';
import Services from './components/marketing/Services';
import About from './components/marketing/About';
import Contact from './components/marketing/Contact';
import Footer from './components/marketing/Footer';
import ProductManagement from './pages/ProductManagement';
import Shop from './pages/Shop';
import BuyProduct from './pages/BuyProduct';
import Gallery from './pages/Gallery';
import AppErrorBoundary from './components/errors/AppErrorBoundary';
import InvalidStateFallback from './components/navigation/InvalidStateFallback';

type View = 'marketing' | 'products' | 'shop' | 'buy' | 'gallery';

function App() {
  const [view, setView] = useState<View>('shop');
  const [selectedProductId, setSelectedProductId] = useState<bigint | null>(null);

  const handleBuyProduct = (productId: bigint) => {
    setSelectedProductId(productId);
    setView('buy');
  };

  const handleBackToShop = () => {
    setSelectedProductId(null);
    setView('shop');
  };

  const handleErrorReset = () => {
    setSelectedProductId(null);
    setView('shop');
  };

  return (
    <AppErrorBoundary onReset={handleErrorReset}>
      <div className="min-h-screen">
        <Header currentView={view} onViewChange={setView} />
        {view === 'marketing' ? (
          <>
            <main>
              <Hero />
              <Categories />
              <Services />
              <About />
              <Contact />
            </main>
            <Footer />
          </>
        ) : view === 'products' ? (
          <ProductManagement />
        ) : view === 'shop' ? (
          <Shop onBuyProduct={handleBuyProduct} />
        ) : view === 'gallery' ? (
          <Gallery onViewProduct={handleBuyProduct} />
        ) : view === 'buy' && selectedProductId !== null ? (
          <BuyProduct productId={selectedProductId} onBack={handleBackToShop} />
        ) : (
          <InvalidStateFallback onReturnToShop={handleBackToShop} />
        )}
      </div>
    </AppErrorBoundary>
  );
}

export default App;
