import React, { useState, useContext } from 'react';
import { AppContext } from '../App.jsx';
import { X, Calculator } from 'lucide-react';

export default function MaterialEstimatorModal() {
  const { products, addToCart } = useContext(AppContext);
  const [length, setLength] = useState(10);
  const [height, setHeight] = useState(10);
  const [thickness, setThickness] = useState(9);
  const [calculated, setCalculated] = useState(false);
  const [results, setResults] = useState({ bricks: 0, cement: 0, sand: 0 });

  const closeModal = () => {
    const modal = document.getElementById('calc-modal-overlay');
    if (modal) modal.classList.remove('active');
  };

  const calculateRequirements = () => {
    const l = parseFloat(length);
    const h = parseFloat(height);
    const t = parseFloat(thickness);

    if (l <= 0 || h <= 0) return;

    // 1. Calculate wall volume in cubic feet (CFT)
    const thickFeet = t / 12;
    const volumeCFT = l * h * thickFeet;

    // 2. Bricks required (wastage factor 5%)
    const bricksNeeded = Math.ceil(volumeCFT * 13.5 * 1.05);

    // 3. Dry mortar volume (wet mortar = 30%, dry volume * 1.33 = 0.399 CFT)
    const dryMortarCFT = volumeCFT * 0.399;

    // 4. Mix ratio: 4.5" uses 1:4 (5 parts), 9" uses 1:6 (7 parts)
    let cementVolumeCFT, sandVolumeCFT;
    if (t <= 4.5) {
      cementVolumeCFT = dryMortarCFT * (1 / 5);
      sandVolumeCFT = dryMortarCFT * (4 / 5);
    } else {
      cementVolumeCFT = dryMortarCFT * (1 / 7);
      sandVolumeCFT = dryMortarCFT * (6 / 7);
    }

    // 5. Cement bags (1 bag = 1.25 CFT)
    const cementBagsNeeded = Math.ceil(cementVolumeCFT / 1.25);

    // 6. Sand CFT
    const sandCFTNeeded = parseFloat(sandVolumeCFT.toFixed(1));

    setResults({
      bricks: bricksNeeded,
      cement: cementBagsNeeded,
      sand: sandCFTNeeded
    });
    setCalculated(true);
  };

  const addEstimatedToCart = () => {
    // Find matching products in db for Bricks, Cement, Sand
    const cementProduct = products.find(p => p.category === 'cement') || products[0];
    const brickProduct = products.find(p => p.category === 'bricks') || products.find(p => p.name.toLowerCase().includes('brick')) || products[0];
    const sandProduct = products.find(p => p.category === 'sand') || products.find(p => p.name.toLowerCase().includes('sand')) || products[0];

    if (results.cement > 0 && cementProduct) addToCart(cementProduct, results.cement);
    if (results.bricks > 0 && brickProduct) addToCart(brickProduct, results.bricks);
    if (results.sand > 0 && sandProduct) addToCart(sandProduct, Math.ceil(results.sand));

    closeModal();
    // Open cart drawer to show items
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
    }
  };

  return (
    <div className="modal-overlay" id="calc-modal-overlay">
      <div className="modal-card calc-modal">
        <div className="modal-header">
          <h3><Calculator style={{ width: '18px', height: '18px', marginRight: '8px' }} /> Construction Material Estimator</h3>
          <button 
            type="button"
            className="btn-close-modal" 
            onClick={closeModal}
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
        <div className="modal-body">
          <p className="modal-intro">Estimate the required cement, sand, and bricks for your construction wall. You can directly add these materials to your cart after calculation.</p>
          <div className="calc-grid">
            <div className="calc-inputs">
              <div className="input-group">
                <label>Wall Length (Feet)</label>
                <input 
                  type="number" 
                  value={length} 
                  onChange={(e) => setLength(e.target.value)}
                  min="1"
                />
              </div>
              <div className="input-group">
                <label>Wall Height (Feet)</label>
                <input 
                  type="number" 
                  value={height} 
                  onChange={(e) => setHeight(e.target.value)}
                  min="1"
                />
              </div>
              <div className="input-group">
                <label>Wall Thickness (Inches)</label>
                <select 
                  value={thickness} 
                  onChange={(e) => setThickness(parseFloat(e.target.value))}
                >
                  <option value="4.5">4.5 Inches (Single Brick)</option>
                  <option value="9">9 Inches (Double Brick)</option>
                </select>
              </div>
              <button 
                type="button"
                className="btn-primary w-full" 
                onClick={calculateRequirements}
              >
                Calculate Requirements
              </button>
            </div>
            <div className="calc-results" id="calc-results-pane">
              <h4>Estimated Materials</h4>
              <div className="results-list">
                <div className="result-item">
                  <div className="item-label">
                    <span>🧱 Bricks Needed</span>
                  </div>
                  <span className="result-val">{results.bricks} pcs</span>
                </div>
                <div className="result-item">
                  <div className="item-label">
                    <span>📦 Cement Bags (50kg)</span>
                  </div>
                  <span className="result-val">{results.cement} bags</span>
                </div>
                <div className="result-item">
                  <div className="item-label">
                    <span>🌊 Sand Required</span>
                  </div>
                  <span className="result-val">{results.sand} cft</span>
                </div>
              </div>
              <button 
                type="button"
                className={`btn-secondary w-full ${!calculated ? 'disabled' : ''}`}
                onClick={addEstimatedToCart}
                disabled={!calculated}
              >
                Add Estimated Items to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
