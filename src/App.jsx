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
import Home from './pages/Home.jsx';
import ProductList from './pages/ProductList.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Checkout from './pages/Checkout.jsx';
import Designers from './pages/Designers.jsx';
import DesignerDetail from './pages/DesignerDetail.jsx';
import Builders from './pages/Builders.jsx';
import BuilderDetail from './pages/BuilderDetail.jsx';
import GuideDetail from './pages/GuideDetail.jsx';
import AdminConsole from './pages/AdminConsole.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

// Create Global Context
export const AppContext = createContext();

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [banners, setBanners] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [guides, setGuides] = useState([]);
  const [orders, setOrders] = useState([]);
  const [leads, setLeads] = useState([]);
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem('builderpro_cart')) || [];
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('builderpro_theme') || 'light';
  });
  const [loading, setLoading] = useState(true);

  // Sync Theme with DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('builderpro_theme', theme);
  }, [theme]);

  // Sync Cart with LocalStorage
  useEffect(() => {
    localStorage.setItem('builderpro_cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch all initial data
  const fetchData = async () => {
    try {
      const [
        prodsRes, catsRes, unitsRes, bannersRes, 
        designersRes, buildersRes, guidesRes, ordersRes, leadsRes
      ] = await Promise.all([
        axios.get('/api/products').catch(() => ({ data: [] })),
        axios.get('/api/categories').catch(() => ({ data: [] })),
        axios.get('/api/units').catch(() => ({ data: [] })),
        axios.get('/api/banners').catch(() => ({ data: [] })),
        axios.get('/api/designers').catch(() => ({ data: [] })),
        axios.get('/api/builders').catch(() => ({ data: [] })),
        axios.get('/api/guides').catch(() => ({ data: [] })),
        axios.get('/api/orders').catch(() => ({ data: [] })),
        axios.get('/api/leads').catch(() => ({ data: [] }))
      ]);

      const fetchedProducts = prodsRes.data && prodsRes.data.length > 0 ? prodsRes.data : INITIAL_PRODUCTS;
      const fetchedCategories = catsRes.data && catsRes.data.length > 0 ? catsRes.data : INITIAL_CATEGORIES;
      const fetchedUnits = unitsRes.data && unitsRes.data.length > 0 ? unitsRes.data : INITIAL_UNITS;
      const fetchedBanners = bannersRes.data && bannersRes.data.length > 0 ? bannersRes.data : INITIAL_BANNERS;
      const fetchedDesigners = designersRes.data && designersRes.data.length > 0 ? designersRes.data : INITIAL_DESIGNERS;
      const fetchedBuilders = buildersRes.data && buildersRes.data.length > 0 ? buildersRes.data : INITIAL_BUILDERS;
      const fetchedGuides = guidesRes.data && guidesRes.data.length > 0 ? guidesRes.data : INITIAL_GUIDE_POSTS;

      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
      setUnits(fetchedUnits);
      setBanners(fetchedBanners);
      setDesigners(fetchedDesigners);
      setBuilders(fetchedBuilders);
      setGuides(fetchedGuides);
      setOrders(ordersRes.data || []);
      setLeads(leadsRes.data || []);
    } catch (e) {
      console.error('Error fetching initial data', e);
    } finally {
      setLoading(false);
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

  const updateCartQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
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
          <Navbar />
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
              <Route path="/guide/:id" element={<GuideDetail />} />
              <Route path="/admin" element={<AdminConsole />} />
            </Routes>
          </main>
          <Footer />
          <CartDrawer />
          <MaterialEstimatorModal />
          <InquiryModal />
        </div>
      </HashRouter>
    </AppContext.Provider>
  );
}
