import React, { createContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Import fallback mock data
import { 
  INITIAL_CATEGORIES, 
  INITIAL_BANNERS, 
  INITIAL_PRODUCTS, 
  INITIAL_UNITS, 
  INITIAL_DESIGNERS, 
  INITIAL_BUILDERS, 
  INITIAL_GUIDE_POSTS 
} from '../backend/data/data.js';

// Import Components & Pages
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import MaterialEstimatorModal from './components/MaterialEstimatorModal.jsx';
import InquiryModal from './components/InquiryModal.jsx';
import AgenticAssistant from './components/AgenticAssistant.jsx';
import MobileBottomNav from './components/MobileBottomNav.jsx';
import Home from './pages/Home.jsx';
import ProductList from './pages/ProductList.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Checkout from './pages/Checkout.jsx';
import Designers from './pages/Designers.jsx';
import DesignerDetail from './pages/DesignerDetail.jsx';
import Builders from './pages/Builders.jsx';
import BuilderDetail from './pages/BuilderDetail.jsx';
import Guides from './pages/Guides.jsx';
import GuideDetail from './pages/GuideDetail.jsx';
import BuildYourHome from './pages/BuildYourHome.jsx';
import AdminConsole from './pages/AdminConsole.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

// Create Global Context
export const AppContext = createContext();

const DATA_SCHEMA_VERSION = 'v2.4';

export default function App() {
  // Sync schema cache version
  useEffect(() => {
    try {
      const storedVersion = localStorage.getItem('elderobuddy_schema_version');
      if (storedVersion !== DATA_SCHEMA_VERSION) {
        localStorage.setItem('elderobuddy_products', JSON.stringify(INITIAL_PRODUCTS));
        localStorage.setItem('elderobuddy_categories', JSON.stringify(INITIAL_CATEGORIES));
        localStorage.setItem('elderobuddy_schema_version', DATA_SCHEMA_VERSION);
        setProducts(INITIAL_PRODUCTS);
        setCategories(INITIAL_CATEGORIES);
      }
    } catch (e) {}
  }, []);

  // Instant 0ms Initial State from Cache or Pre-bundled Defaults (Zero blank/half-loaded delay)
  const [products, setProducts] = useState(() => {
    try {
      const storedVersion = localStorage.getItem('elderobuddy_schema_version');
      if (storedVersion === DATA_SCHEMA_VERSION) {
        const cached = JSON.parse(localStorage.getItem('elderobuddy_products'));
        if (Array.isArray(cached) && cached.length > 0) return cached;
      }
    } catch (e) {}
    return INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState(() => {
    try {
      const storedVersion = localStorage.getItem('elderobuddy_schema_version');
      if (storedVersion === DATA_SCHEMA_VERSION) {
        const cached = JSON.parse(localStorage.getItem('elderobuddy_categories'));
        if (Array.isArray(cached) && cached.length > 0) return cached;
      }
    } catch (e) {}
    return INITIAL_CATEGORIES;
  });

  const [units, setUnits] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem('elderobuddy_units') || localStorage.getItem('builderpro_units'));
      if (Array.isArray(cached) && cached.length > 0) return cached;
    } catch (e) {}
    return INITIAL_UNITS;
  });

  const [banners, setBanners] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem('elderobuddy_banners') || localStorage.getItem('builderpro_banners'));
      if (Array.isArray(cached) && cached.length > 0) return cached;
    } catch (e) {}
    return INITIAL_BANNERS;
  });

  const [designers, setDesigners] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem('elderobuddy_designers') || localStorage.getItem('builderpro_designers'));
      if (Array.isArray(cached) && cached.length > 0) return cached;
    } catch (e) {}
    return INITIAL_DESIGNERS;
  });

  const [builders, setBuilders] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem('elderobuddy_builders') || localStorage.getItem('builderpro_builders'));
      if (Array.isArray(cached) && cached.length > 0) return cached;
    } catch (e) {}
    return INITIAL_BUILDERS;
  });

  const [guides, setGuides] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem('elderobuddy_guides') || localStorage.getItem('builderpro_guides'));
      if (Array.isArray(cached) && cached.length > 0) return cached;
    } catch (e) {}
    return INITIAL_GUIDE_POSTS;
  });

  const [orders, setOrders] = useState([]);
  const [leads, setLeads] = useState([]);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem('elderobuddy_cart') || localStorage.getItem('builderpro_cart')) || [];
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('elderobuddy_theme') || localStorage.getItem('builderpro_theme') || 'light';
  });
  const [loading, setLoading] = useState(false);

  // Sync Theme with DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('elderobuddy_theme', theme);
  }, [theme]);

  // Sync Cart with LocalStorage
  useEffect(() => {
    localStorage.setItem('elderobuddy_cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch live server updates in background without UI blocking
  const fetchData = async () => {
    try {
      const apiReq = (url) => axios.get(url, { timeout: 3500 }).catch(() => ({ data: [] }));

      const [
        prodsRes, catsRes, unitsRes, bannersRes, 
        designersRes, buildersRes, guidesRes, ordersRes, leadsRes
      ] = await Promise.all([
        apiReq('/api/products'),
        apiReq('/api/categories'),
        apiReq('/api/units'),
        apiReq('/api/banners'),
        apiReq('/api/designers'),
        apiReq('/api/builders'),
        apiReq('/api/guides'),
        apiReq('/api/orders'),
        apiReq('/api/leads')
      ]);

      if (prodsRes.data && prodsRes.data.length > 0) {
        setProducts(prodsRes.data);
        localStorage.setItem('elderobuddy_products', JSON.stringify(prodsRes.data));
      }
      if (catsRes.data && catsRes.data.length > 0) {
        setCategories(catsRes.data);
        localStorage.setItem('elderobuddy_categories', JSON.stringify(catsRes.data));
      }
      if (unitsRes.data && unitsRes.data.length > 0) {
        setUnits(unitsRes.data);
        localStorage.setItem('elderobuddy_units', JSON.stringify(unitsRes.data));
      }
      if (bannersRes.data && bannersRes.data.length > 0) {
        setBanners(bannersRes.data);
        localStorage.setItem('elderobuddy_banners', JSON.stringify(bannersRes.data));
      }
      if (designersRes.data && designersRes.data.length > 0) {
        setDesigners(designersRes.data);
        localStorage.setItem('elderobuddy_designers', JSON.stringify(designersRes.data));
      }
      if (buildersRes.data && buildersRes.data.length > 0) {
        setBuilders(buildersRes.data);
        localStorage.setItem('elderobuddy_builders', JSON.stringify(buildersRes.data));
      }
      if (guidesRes.data && guidesRes.data.length > 0) {
        setGuides(guidesRes.data);
        localStorage.setItem('elderobuddy_guides', JSON.stringify(guidesRes.data));
      }
      if (ordersRes.data) setOrders(ordersRes.data);
      if (leadsRes.data) setLeads(leadsRes.data);
    } catch (error) {
      console.warn('Background sync using local defaults');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const contextValue = {
    products, setProducts,
    categories, setCategories,
    units, setUnits,
    banners, setBanners,
    designers, setDesigners,
    builders, setBuilders,
    guides, setGuides,
    orders, setOrders,
    leads, setLeads,
    cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
    theme, setTheme,
    fetchData,
    loading
  };

  return (
    <AppContext.Provider value={contextValue}>
      <HashRouter>
        <ScrollToTop />
        <div className="app-container">
          <Navbar 
            mobileDrawerOpen={mobileDrawerOpen} 
            setMobileDrawerOpen={setMobileDrawerOpen} 
          />
          <main id="app">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/interior-designers" element={<Designers />} />
              <Route path="/interior-designer/:id" element={<DesignerDetail />} />
              <Route path="/builders" element={<Builders />} />
              <Route path="/builder/:id" element={<BuilderDetail />} />
              <Route path="/build-your-home" element={<BuildYourHome />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/guide/:id" element={<GuideDetail />} />
              <Route path="/admin" element={<AdminConsole />} />
            </Routes>
          </main>
          <Footer />
          <CartDrawer />
          <MaterialEstimatorModal />
          <InquiryModal />
          <AgenticAssistant />
          <MobileBottomNav onOpenCategories={() => setMobileDrawerOpen(true)} />
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
}
