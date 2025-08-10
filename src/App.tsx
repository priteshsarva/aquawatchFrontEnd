import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import NotFound from './pages/NotFound';
import Home from './pages/Home';
import FaqPage from './pages/FaqPage';
import ProductDetailPage from './pages/ProductDetailPage';

import Navbar from './components/Navbar';
import Footers from './components/Footers'


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
          <Route path="/productpage" element={<ProductDetailPage />} />

          {/* Catch-all route for unmatched URLs */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    <Footers />

    </>
  )
}

export default App
