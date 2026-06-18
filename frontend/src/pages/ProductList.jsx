import React, { useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppContext } from '../App.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function ProductList() {
  const { products, categories, addToCart } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();

  // URL parameters
  const catParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  // Local filter states
  const [selectedCat, setSelectedCat] = useState(catParam);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Sync URL params to local state
  useEffect(() => {
    setSelectedCat(catParam);
  }, [catParam]);

  // Unique brands in DB
  const uniqueBrands = [...new Set(products.map((p) => p.brand))];

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

  // 2. Search Keyword Filter
  if (searchParam) {
    const query = searchParam.toLowerCase().trim();
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query))
    );
  }

  // 3. Brand Filter
  if (selectedBrands.length > 0) {
    filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
  }

  // 4. Price range filter
  const min = parseFloat(priceMin);
  const max = parseFloat(priceMax);
  if (!isNaN(min)) {
    filtered = filtered.filter((p) => p.price >= min);
  }
  if (!isNaN(max)) {
    filtered = filtered.filter((p) => p.price <= max);
  }

  // 5. Sorting
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => (b.rating || 5) - (a.rating || 5));
  }

  // Handle clean reset
  const handleClearFilters = () => {
    setSelectedCat('');
    setSelectedBrands([]);
    setPriceMin('');
    setPriceMax('');
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div className="listing-layout">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
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
                    setSelectedCat('');
                    setSearchParams(searchParam ? { search: searchParam } : {});
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
                      setSelectedCat(cat.id);
                      setSearchParams(searchParam ? { category: cat.id, search: searchParam } : { category: cat.id });
                    }}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Filter by Brand</h4>
            <div className="checkbox-group">
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

          <div className="filter-section">
            <h4>Price Range</h4>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <input 
                type="number" 
                placeholder="Min" 
                className="w-full" 
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                style={{ padding: '6px', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.8rem' }}
              />
              <input 
                type="number" 
                placeholder="Max" 
                className="w-full" 
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                style={{ padding: '6px', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.8rem' }}
              />
            </div>
          </div>

          <button 
            type="button"
            className="btn-primary w-full"
            onClick={handleClearFilters}
            style={{ marginTop: '15px', padding: '10px', fontSize: '0.85rem' }}
          >
            Clear Filters
          </button>
        </aside>

        {/* Product Listing Area */}
        <div className="listing-content">
          <div className="listing-header">
            <div>
              <p><span>{filtered.length}</span> products found</p>
              {searchParam && (
                <p style={{ fontSize: '0.8rem', marginTop: '2px', color: 'var(--text-muted)' }}>
                  Showing search results for "<strong>{searchParam}</strong>"
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

          {filtered.length === 0 ? (
            <div className="no-results w-full" style={{ display: 'block', textAlign: 'center', padding: '60px 20px', background: 'var(--bg-surface-alt)', borderRadius: '6px', border: '1px dashed var(--border-color)' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>🔍</span>
              <h3>No materials matched your filters.</h3>
              <p style={{ marginTop: '8px', color: 'var(--text-muted)' }}>Try clearing search keywords or selecting different brands.</p>
              <button 
                type="button"
                className="btn-primary" 
                onClick={handleClearFilters}
                style={{ marginTop: '20px', display: 'inline-block' }}
              >
                Reset Store Catalog
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
