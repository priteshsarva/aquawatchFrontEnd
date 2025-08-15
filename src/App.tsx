import './App.css'
import { Routes, Route } from 'react-router-dom';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// import NotFound from './pages/NotFound.jsx';
import Home from './pages/Home.jsx';
import FaqPage from './pages/legal/FaqPage.jsx';
import TermsOfService from './pages/legal/TermsOfService.jsx';
import ShippingPolicy from './pages/legal/ShippingPolicy.jsx';
import ReturnPolicy from './pages/legal/ReturnPolicy.jsx';
import PrivacyPolices from './pages/legal/PrivacyPolices.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';

import Navbar from './components/Navbar.jsx';
import Footers from './components/Footers.jsx'


async function loadPreline() {
  return import('preline/dist/index.js');
}

const App = () => {
  const location = useLocation();

    useEffect(() => {
        const initPreline = async () => {
            await loadPreline();

            if (
                window.HSStaticMethods &&
                typeof window.HSStaticMethods.autoInit === 'function'
            ) {
                window.HSStaticMethods.autoInit();
            }
        };

        initPreline();
    }, [location.pathname]);

  return (
    <>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolices />} />
          <Route path="/ReturnPolicy" element={<ReturnPolicy />} />
          <Route path="/ShippingPolicy" element={<ShippingPolicy />} />
          <Route path="/TermsOfService" element={<TermsOfService />} />
          <Route path="/productpage" element={<ProductDetailPage />} />

          {/* Catch-all route for unmatched URLs */}
          <Route path="*" element={<Home />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
    <Footers />

    </>
  )
}

export default App
