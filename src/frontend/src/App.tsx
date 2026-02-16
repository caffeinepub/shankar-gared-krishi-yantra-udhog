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

type View = 'marketing' | 'products' | 'shop' | 'buy';

function App() {
  const [view, setView] = useState<View>('marketing');
  const [selectedProductId, setSelectedProductId] = useState<bigint | null>(null);

  const handleBuyProduct = (productId: bigint) => {
    setSelectedProductId(productId);
    setView('buy');
  };

  const handleBackToShop = () => {
    setSelectedProductId(null);
    setView('shop');
  };

  return (
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
      ) : view === 'buy' && selectedProductId !== null ? (
        <BuyProduct productId={selectedProductId} onBack={handleBackToShop} />
      ) : null}
    </div>
  );
}

export default App;
