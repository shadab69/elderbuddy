import React, { useContext, useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AppContext } from '../App.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function ProductList() {
  const { products, categories, addToCart } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();

  // URL parameters
  const catParam = searchParams.get('category') || '';
  const subcatParam = searchParams.get('subcat') || searchParams.get('subcategory') || '';
  const searchParam = searchParams.get('search') || '';

  // Local filter states
  const [selectedCat, setSelectedCat] = useState(catParam);
  const [selectedSubcat, setSelectedSubcat] = useState(subcatParam);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Sync URL params to local state
  useEffect(() => {
    setSelectedCat(catParam);
    setSelectedSubcat(subcatParam);
  }, [catParam, subcatParam]);

  // Find active category object
  const activeCategoryObj = categories.find((c) => c.id === selectedCat);
  const currentSubcategories = activeCategoryObj?.subcategories || [];
  const activeSubcatObj = currentSubcategories.find((s) => s.id === selectedSubcat);

  // Unique brands in DB
  const uniqueBrands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

  // Handle brand checkbox toggling
  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Filter and sort products
  let filtered = [...products];

  // 1. Category Filter
  if (selectedCat) {
    filtered = filtered.filter((p) => p.category === selectedCat);
  }

  // 2. Subcategory Filter
  if (selectedSubcat) {
    filtered = filtered.filter((p) => {
      if (p.subcategory === selectedSubcat) return true;
      if (p.subcategory && p.subcategory.toLowerCase() === selectedSubcat.toLowerCase()) return true;
      // Partial match on subcategory ID or name
      const cleanSub = selectedSubcat.replace(/-/g, ' ').toLowerCase();
      if (p.name && p.name.toLowerCase().includes(cleanSub)) return true;
      if (p.description && p.description.toLowerCase().includes(cleanSub)) return true;
      return false;
    });
  }

  // 3. Search Keyword Filter
  if (searchParam) {
    const query = searchParam.toLowerCase().trim();
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(query))
    );
  }

  // 4. Brand Filter
  if (selectedBrands.length > 0) {
    filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
  }

  // 5. Price range filter
  const min = parseFloat(priceMin);
  const max = parseFloat(priceMax);
  if (!isNaN(min)) {
    filtered = filtered.filter((p) => p.price >= min);
  }
  if (!isNaN(max)) {
    filtered = filtered.filter((p) => p.price <= max);
  }

  // 6. Sorting
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => (b.rating || 5) - (a.rating || 5));
  }

  // Handle category change
  const handleCategorySelect = (catId) => {
    setSelectedCat(catId);
    setSelectedSubcat('');
    const newParams = {};
    if (catId) newParams.category = catId;
    if (searchParam) newParams.search = searchParam;
    setSearchParams(newParams);
  };

  // Handle subcategory change
  const handleSubcategorySelect = (subcatId) => {
    setSelectedSubcat(subcatId);
    const newParams = {};
    if (selectedCat) newParams.category = selectedCat;
    if (subcatId) newParams.subcat = subcatId;
    if (searchParam) newParams.search = searchParam;
    setSearchParams(newParams);
  };

  // Handle clean reset
  const handleClearFilters = () => {
    setSelectedCat('');
    setSelectedSubcat('');
    setSelectedBrands([]);
    setPriceMin('');
    setPriceMax('');
    setSortBy('featured');
    setSearchParams({});
  };

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '40px', paddingTop: '15px' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted, #64748b)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link 
          to="/products" 
          onClick={handleClearFilters}
          style={{ color: !selectedCat ? 'var(--primary-color, #f97316)' : 'inherit', textDecoration: 'none', fontWeight: !selectedCat ? '600' : 'normal' }}
        >
          All Products
        </Link>
        {activeCategoryObj && (
          <>
            <span>/</span>
            <span 
              onClick={() => handleCategorySelect(activeCategoryObj.id)}
              style={{ color: !selectedSubcat ? 'var(--primary-color, #f97316)' : 'inherit', cursor: 'pointer', fontWeight: !selectedSubcat ? '600' : 'normal' }}
            >
              {activeCategoryObj.name}
            </span>
          </>
        )}
        {activeSubcatObj && (
          <>
            <span>/</span>
            <span style={{ color: 'var(--primary-color, #f97316)', fontWeight: '600' }}>
              {activeSubcatObj.name}
            </span>
          </>
        )}
      </div>

      {/* Mobile Filter Trigger Bar (Visible only on mobile) */}
      <div className="mobile-filter-trigger-bar">
        <button 
          type="button" 
          className="btn-mobile-filter-toggle"
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
        >
          <span>⚡ Filter Materials</span>
          {(selectedCat || selectedSubcat || selectedBrands.length > 0 || priceMin || priceMax) && (
            <span className="mobile-active-filter-dot">●</span>
          )}
        </button>

        <div className="mobile-quick-sort">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="mobile-sort-select"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="listing-layout">
        {/* Filters Sidebar (Desktop Sidebar / Mobile Drawer Sheet) */}
        <aside className={`filters-sidebar ${mobileFilterOpen ? 'mobile-drawer-active' : ''}`}>
          <div className="mobile-filter-drawer-header">
            <h3>Filter & Refine</h3>
            <button 
              type="button" 
              className="btn-close-filter-drawer"
              onClick={() => setMobileFilterOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Categories Filter */}
          <div className="filter-section">
            <h4>Categories</h4>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="radio" 
                  name="cat" 
                  value="" 
                  checked={selectedCat === ''}
                  onChange={() => {
                    handleCategorySelect('');
                    setMobileFilterOpen(false);
                  }}
                />
                <span>All Categories</span>
              </label>
              {categories.map((cat) => (
                <label key={cat.id} className="checkbox-label">
                  <input 
                    type="radio" 
                    name="cat" 
                    value={cat.id}
                    checked={selectedCat === cat.id}
                    onChange={() => {
                      handleCategorySelect(cat.id);
                      setMobileFilterOpen(false);
                    }}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Subcategories Filter (Shown when category is selected) */}
          {currentSubcategories.length > 0 && (
            <div className="filter-section" style={{ background: 'rgba(249, 115, 22, 0.04)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(249, 115, 22, 0.15)' }}>
              <h4 style={{ color: 'var(--primary-color, #f97316)', marginBottom: '8px' }}>Subcategories</h4>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="radio" 
                    name="subcat" 
                    value="" 
                    checked={selectedSubcat === ''}
                    onChange={() => {
                      handleSubcategorySelect('');
                      setMobileFilterOpen(false);
                    }}
                  />
                  <span style={{ fontWeight: selectedSubcat === '' ? '700' : 'normal' }}>All Subcategories</span>
                </label>
                {currentSubcategories.map((subcat) => (
                  <label key={subcat.id} className="checkbox-label">
                    <input 
                      type="radio" 
                      name="subcat" 
                      value={subcat.id}
                      checked={selectedSubcat === subcat.id}
                      onChange={() => {
                        handleSubcategorySelect(subcat.id);
                        setMobileFilterOpen(false);
                      }}
                    />
                    <span style={{ fontWeight: selectedSubcat === subcat.id ? '700' : 'normal', color: selectedSubcat === subcat.id ? 'var(--primary-color, #f97316)' : 'inherit' }}>
                      {subcat.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Brand Filter */}
          <div className="filter-section">
            <h4>Filter by Brand</h4>
            <div className="checkbox-group" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {uniqueBrands.map((brand) => (
                <label key={brand} className="checkbox-label">
                  <input 
                    type="checkbox" 
                    value={brand}
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="filter-section">
            <h4>Price Range</h4>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <input 
                type="number" 
                placeholder="Min ₹" 
                className="w-full" 
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                style={{ padding: '6px', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.8rem' }}
              />
              <input 
                type="number" 
                placeholder="Max ₹" 
                className="w-full" 
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                style={{ padding: '6px', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.8rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button 
              type="button"
              className="btn-primary w-full"
              onClick={() => {
                handleClearFilters();
                setMobileFilterOpen(false);
              }}
              style={{ padding: '10px', fontSize: '0.85rem' }}
            >
              Clear All
            </button>
            <button 
              type="button"
              className="btn-primary w-full desktop-only"
              onClick={() => setMobileFilterOpen(false)}
              style={{ padding: '10px', fontSize: '0.85rem', background: '#0f172a' }}
            >
              Apply
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile filter drawer */}
        {mobileFilterOpen && (
          <div 
            className="mobile-filter-backdrop"
            onClick={() => setMobileFilterOpen(false)}
          ></div>
        )}

        {/* Product Listing Area */}
        <div className="listing-content">
          {/* Quick Subcategory Pills at top of page if Category selected */}
          {currentSubcategories.length > 0 && (
            <div className="subcategory-pills-track">
              <button
                type="button"
                className={`subcat-pill-btn ${selectedSubcat === '' ? 'active' : ''}`}
                onClick={() => handleSubcategorySelect('')}
              >
                All {activeCategoryObj.name}
              </button>
              {currentSubcategories.map((subcat) => {
                const isSelected = selectedSubcat === subcat.id;
                return (
                  <button
                    key={subcat.id}
                    type="button"
                    className={`subcat-pill-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSubcategorySelect(subcat.id)}
                  >
                    {subcat.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Listing Top Header */}
          <div className="listing-header">
            <div>
              <p style={{ margin: 0 }}>
                <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-main)' }}>{filtered.length}</span> materials found
              </p>
              {activeSubcatObj && (
                <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.78rem', background: 'rgba(249, 115, 22, 0.1)', color: 'var(--primary-color, #f97316)', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>
                    Subcategory: {activeSubcatObj.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSubcategorySelect('')}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem' }}
                    title="Clear subcategory filter"
                  >
                    ✕
                  </button>
                </div>
              )}
              {searchParam && (
                <p style={{ fontSize: '0.8rem', marginTop: '4px', color: 'var(--text-muted)' }}>
                  Showing results for "<strong>{searchParam}</strong>"
                </p>
              )}
            </div>
            <div className="listing-sort-select">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.85rem', background: 'var(--bg-surface)' }}
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Popularity / Stars</option>
              </select>
            </div>
          </div>

          {/* Product Grid / Empty State */}
          {filtered.length === 0 ? (
            <div className="no-results w-full" style={{ display: 'block', textAlign: 'center', padding: '60px 20px', background: 'var(--bg-surface-alt)', borderRadius: '6px', border: '1px dashed var(--border-color)' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>🔍</span>
              <h3>No materials found for this filter.</h3>
              <p style={{ marginTop: '8px', color: 'var(--text-muted)' }}>Try selecting a different subcategory or clearing filters.</p>
              <button 
                type="button"
                className="btn-primary" 
                onClick={handleClearFilters}
                style={{ marginTop: '20px', display: 'inline-block' }}
              >
                Show All Store Materials
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} addToCart={addToCart} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
