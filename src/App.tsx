import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';

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
import OriginalProductDetailPageWithprice from './pages/OriginalProductDetailPageWithprice.jsx';

// import AllProducts from './pages/AllProducts.jsx';
import AllProductPage from './pages/AllProductPage.jsx';

// import Navbar from './components/Navbar.jsx';
import NavBarWithSubmenu from './components/NavBarWithSubmenu.jsx';
import Footers from './components/Footers.jsx'
import ScrollToTop from './components/ScrollToTop.jsx';
import {msterCode } from './data/data.jsx'


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
      {/* <Navbar /> */}
      <NavBarWithSubmenu />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolices />} />
        <Route path="/ReturnPolicy" element={<ReturnPolicy />} />
        <Route path="/ShippingPolicy" element={<ShippingPolicy />} />
        <Route path="/TermsOfService" element={<TermsOfService />} />
        <Route path="/productpage/:id" element={<ProductDetailPage />} />
        <Route path={`/productpage/:id/${msterCode}`} element={<OriginalProductDetailPageWithprice />} />

        <Route path="/product" element={<AllProductPage />} />
        <Route path="/product/category/:category" element={<AllProductPage />} />
        <Route path="/product/brand/:brand" element={<AllProductPage />} />
        <Route path="/product/category/:category/brand/:brand" element={<AllProductPage />} />


        {/* Catch-all route for unmatched URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
      <Footers />

    </>
  )
}

export default App
