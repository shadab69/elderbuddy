// ==========================================================================
// APP CONTROLLER: Router, State Management, and DOM Interactions
// ==========================================================================

// Global state
let APP_STATE = {
    cart: [],
    products: [],
    categories: []
};

// Fetch initial data from server API
async function fetchInitialData() {
    try {
        const [prods, cats, units, banners, orders, leads, guides] = await Promise.all([
            axios.get('/api/products').then(res => res.data),
            axios.get('/api/categories').then(res => res.data),
            axios.get('/api/units').then(res => res.data),
            axios.get('/api/banners').then(res => res.data),
            axios.get('/api/orders').then(res => res.data),
            axios.get('/api/leads').then(res => res.data),
            axios.get('/api/guides').then(res => res.data)
        ]);

        window.SERVER_PRODUCTS = prods;
        window.SERVER_CATEGORIES = cats;
        window.SERVER_UNITS = units;
        window.SERVER_BANNERS = banners;
        window.SERVER_ORDERS = orders;
        window.SERVER_INQUIRIES = leads;
        window.SERVER_GUIDES = guides;

        APP_STATE.products = prods;
        APP_STATE.categories = cats;
    } catch (e) {
        console.warn('[Backend] Failed to fetch data from API, using local storage fallback.', e);
        window.SERVER_PRODUCTS = null;
        window.SERVER_CATEGORIES = null;
        window.SERVER_UNITS = null;
        window.SERVER_BANNERS = null;
        window.SERVER_ORDERS = null;
        window.SERVER_INQUIRIES = null;
        window.SERVER_GUIDES = null;

        APP_STATE.products = getProducts();
        APP_STATE.categories = getCategories();
    }
}
window.fetchInitialData = fetchInitialData;

// Initialize Cart and state
function initAppState() {
    // Falls back to localStorage if SERVER variables are null
    APP_STATE.products = getProducts();
    APP_STATE.categories = getCategories();
    APP_STATE.cart = JSON.parse(localStorage.getItem('builderpro_cart') || '[]');
}

// Save Cart to Local Storage
function saveCartToStorage() {
    localStorage.setItem('builderpro_cart', JSON.stringify(APP_STATE.cart));
    // Trigger global UI update
    updateCartDOMState(APP_STATE.cart, APP_STATE.products);
    renderCartItems(APP_STATE.cart, APP_STATE.products);
}

// Add Item to Cart
function addToCart(productId, qty = 1) {
    const existing = APP_STATE.cart.find(item => item.productId === productId);
    if (existing) {
        existing.quantity += qty;
    } else {
        APP_STATE.cart.push({ productId, quantity: qty });
    }
    saveCartToStorage();
    
    // Open cart drawer to show action
    openCartDrawer();
}

// Update item quantity
function updateCartQty(productId, delta) {
    const item = APP_STATE.cart.find(item => item.productId === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            APP_STATE.cart = APP_STATE.cart.filter(i => i.productId !== productId);
        }
        saveCartToStorage();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    APP_STATE.cart = APP_STATE.cart.filter(item => item.productId !== productId);
    saveCartToStorage();
}

// Clear whole cart
function clearCart() {
    APP_STATE.cart = [];
    saveCartToStorage();
}

// Cart Drawer visibility toggles
function openCartDrawer() {
    document.getElementById('cart-drawer').classList.add('active');
    document.getElementById('cart-overlay').classList.add('active');
}

function closeCartDrawer() {
    document.getElementById('cart-drawer').classList.remove('active');
    document.getElementById('cart-overlay').classList.remove('active');
}

// --------------------------------------------------------------------------
// SPA ROUTER
// --------------------------------------------------------------------------
function router() {
    const hash = location.hash || '#/';
    const root = document.getElementById('app-root');
    if (!root) return;

    // Refresh products and categories in case admin modified them
    APP_STATE.products = getProducts();
    APP_STATE.categories = getCategories();
    renderCategoryDropdown(); // Keep header category dropdown in sync

    // Close any overlays on route change
    closeCartDrawer();
    document.getElementById('category-menu').classList.remove('show');
    document.getElementById('btn-category-toggle').classList.remove('active');

    // Route: #/product/:id
    if (hash.startsWith('#/product/')) {
        const productId = hash.substring(10);
        renderProductDetailView(root, productId);
        window.scrollTo(0, 0);
        return;
    }

    // Route: #/products (Listing with categories or search keyword)
    if (hash.startsWith('#/products')) {
        const queryParams = {};
        
        // Parse simple URL parameters
        if (hash.includes('?')) {
            const paramString = hash.split('?')[1];
            const pairs = paramString.split('&');
            pairs.forEach(pair => {
                const [k, v] = pair.split('=');
                queryParams[decodeURIComponent(k)] = decodeURIComponent(v);
            });
        }
        renderProductListView(root, queryParams);
        window.scrollTo(0, 0);
        return;
    }

    // Route: #/checkout
    if (hash === '#/checkout') {
        renderCheckoutView(root);
        window.scrollTo(0, 0);
        return;
    }

    // Route: #/admin
    if (hash.startsWith('#/admin')) {
        renderAdminView(root, 'products');
        window.scrollTo(0, 0);
        return;
    }

    // Default Route: #/ (Home)
    renderHomeView(root);
    window.scrollTo(0, 0);
}

// --------------------------------------------------------------------------
// EVENT LISTENERS & INITS
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initial State Load from API
    await fetchInitialData();
    initAppState();
    
    // 2. Render Shared Components
    renderCategoryDropdown();
    updateCartDOMState(APP_STATE.cart, APP_STATE.products);
    renderCartItems(APP_STATE.cart, APP_STATE.products);

    // 3. Category Toggle Dropdown
    const btnCatToggle = document.getElementById('btn-category-toggle');
    const catMenu = document.getElementById('category-menu');
    
    btnCatToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = catMenu.classList.toggle('show');
        btnCatToggle.classList.toggle('active', isOpen);
    });

    document.addEventListener('click', () => {
        catMenu.classList.remove('show');
        btnCatToggle.classList.remove('active');
    });

    // 4. Cart Drawer Toggles
    document.getElementById('btn-cart-toggle').addEventListener('click', openCartDrawer);
    document.getElementById('btn-close-cart').addEventListener('click', closeCartDrawer);
    document.getElementById('cart-overlay').addEventListener('click', closeCartDrawer);

    // 5. Global Search form submit
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const term = searchInput.value.trim();
        if (term) {
            location.hash = `#/products?search=${encodeURIComponent(term)}`;
            searchInput.value = '';
        } else {
            location.hash = `#/products`;
        }
    });

    // 6. Estimator Modal Toggles
    const calcModal = document.getElementById('calc-modal-overlay');
    const calcTrigger = document.getElementById('menu-link-estimator') || document.getElementById('btn-calculator');
    if (calcTrigger) {
        calcTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            calcModal.classList.add('active');
        });
    }
    
    // Footer calculator shortcut link
    const footCalcTrigger = document.getElementById('foot-link-estimator');
    if (footCalcTrigger) {
        footCalcTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            calcModal.classList.add('active');
        });
    }

    const btnCloseCalc = document.getElementById('btn-close-calc');
    if (btnCloseCalc) {
        btnCloseCalc.addEventListener('click', () => {
            calcModal.classList.remove('active');
        });
    }

    // 7. Estimator Calculation logic
    const calcBtn = document.getElementById('btn-run-calculation');
    const addToCartCalcBtn = document.getElementById('btn-add-calc-to-cart');
    
    let currentCalcResults = null;

    calcBtn.addEventListener('click', () => {
        const length = parseFloat(document.getElementById('calc-length').value) || 0;
        const height = parseFloat(document.getElementById('calc-height').value) || 0;
        const thickness = parseFloat(document.getElementById('calc-thickness').value) || 4.5;

        if (length <= 0 || height <= 0) {
            alert('Please enter valid dimensions for the wall.');
            return;
        }

        const res = calculateWallMaterials(length, height, thickness);
        currentCalcResults = res;

        // Update display text values
        document.getElementById('res-bricks').textContent = `${res.bricks.toLocaleString()} pcs`;
        document.getElementById('res-cement').textContent = `${res.cement} bags`;
        document.getElementById('res-sand').textContent = `${res.sand.toFixed(1)} tons`;

        // Highlight pane and enable Add to Cart button
        document.getElementById('calc-results-pane').style.borderColor = 'var(--primary)';
        addToCartCalcBtn.disabled = false;
        addToCartCalcBtn.classList.remove('disabled');
    });

    // Add estimated items to actual cart
    addToCartCalcBtn.addEventListener('click', () => {
        if (!currentCalcResults) return;

        // Try to match materials with local storage items to add actual database entries
        // p1 -> UltraTech Cement, p6 -> Red Clay Bricks, p5/p4 -> Steel (Or sand - let's add custom cement bag, red brick, sand ton items)
        const productsList = getProducts();
        
        // Find bricks product (category: bricks)
        const brickProduct = productsList.find(p => p.category === 'bricks') || { id: 'p6' };
        // Find cement product (category: cement)
        const cementProduct = productsList.find(p => p.category === 'cement') || { id: 'p1' };
        
        // If sand product is not in database, let's look for sand. Sand category? Red brick, bricks, etc.
        // We have p6 (bricks), p1 (cement). If sand ton product isn't listed, we can list it.
        // Let's add them to cart
        if (currentCalcResults.bricks > 0) {
            addToCart(brickProduct.id, currentCalcResults.bricks);
        }
        if (currentCalcResults.cement > 0) {
            addToCart(cementProduct.id, currentCalcResults.cement);
        }
        
        alert('Estimated materials (Cement Bags & Bricks) successfully added to your Cart!');
        calcModal.classList.remove('active');
        
        // Reset calculator pane
        document.getElementById('calc-length').value = 10;
        document.getElementById('calc-height').value = 10;
        document.getElementById('res-bricks').textContent = '0 pcs';
        document.getElementById('res-cement').textContent = '0 bags';
        document.getElementById('res-sand').textContent = '0.0 tons';
        addToCartCalcBtn.disabled = true;
        addToCartCalcBtn.classList.add('disabled');
    });

    // 8. Sourcing Leads Inquiry Modal Toggles
    const inquiryModal = document.getElementById('inquiry-modal-overlay');
    const inquiryForm = document.getElementById('inquiry-form');

    // Attach listeners on body since triggers can be dynamically loaded
    document.body.addEventListener('click', (e) => {
        const trigger = e.target.closest('.service-inq-trigger');
        if (trigger) {
            e.preventDefault();
            inquiryModal.classList.add('active');
            const svc = trigger.getAttribute('data-service') || '';
            if (svc) {
                document.getElementById('inq-service').value = svc;
            }
        }
    });

    document.getElementById('btn-close-inquiry').addEventListener('click', () => {
        inquiryModal.classList.remove('active');
        inquiryForm.reset();
    });
    
    document.getElementById('btn-cancel-inquiry').addEventListener('click', () => {
        inquiryModal.classList.remove('active');
        inquiryForm.reset();
    });

    inquiryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const inqData = {
            service: document.getElementById('inq-service').value,
            name: document.getElementById('inq-name').value,
            phone: document.getElementById('inq-phone').value,
            email: document.getElementById('inq-email').value,
            location: document.getElementById('inq-location').value,
            details: document.getElementById('inq-details').value
        };

        await saveInquiry(inqData);
        alert(`Quote Inquiry submitted successfully! Our engineering team will call you on ${inqData.phone} shortly.`);
        
        if (window.fetchInitialData) await window.fetchInitialData();
        inquiryModal.classList.remove('active');
        inquiryForm.reset();
    });

    // 9. Admin/Seller Navigation Shortcut
    const btnAdmin = document.getElementById('btn-admin') || document.getElementById('btn-seller-portal');
    if (btnAdmin) {
        btnAdmin.addEventListener('click', () => {
            location.hash = '#/admin';
        });
    }

    // 10. Cart Drawer Action Delegations
    const cartBody = document.getElementById('cart-drawer-items');
    cartBody.addEventListener('click', (e) => {
        const decBtn = e.target.closest('[data-qty-dec-id]');
        const incBtn = e.target.closest('[data-qty-inc-id]');
        const removeBtn = e.target.closest('[data-remove-id]');
        const shopNowBtn = e.target.closest('#btn-cart-shop-now');

        if (decBtn) {
            const id = decBtn.getAttribute('data-qty-dec-id');
            updateCartQty(id, -1);
        } else if (incBtn) {
            const id = incBtn.getAttribute('data-qty-inc-id');
            updateCartQty(id, 1);
        } else if (removeBtn) {
            const id = removeBtn.getAttribute('data-remove-id');
            if (confirm('Remove item from cart?')) {
                removeFromCart(id);
            }
        } else if (shopNowBtn) {
            closeCartDrawer();
        }
    });

    document.getElementById('btn-clear-cart').addEventListener('click', () => {
        if (APP_STATE.cart.length > 0 && confirm('Are you sure you want to clear your shopping cart?')) {
            clearCart();
        }
    });

    document.getElementById('btn-to-checkout').addEventListener('click', () => {
        closeCartDrawer();
        location.hash = '#/checkout';
    });

    // 11. Add to Cart Actions Delegations (for lists and buttons)
    document.body.addEventListener('click', (e) => {
        const addBtn = e.target.closest('[data-add-cart-id]');
        if (addBtn) {
            const id = addBtn.getAttribute('data-add-cart-id');
            addToCart(id, 1);
            
            // Subtle pop animation on the navbar cart icon
            const cartBtn = document.getElementById('btn-cart-toggle');
            cartBtn.style.transform = 'scale(1.15)';
            setTimeout(() => {
                cartBtn.style.transform = 'scale(1)';
            }, 150);
        }
    });

    // Global event listener for Add To Cart triggers (e.g. from detail view)
    window.addEventListener('addToCart', (e) => {
        const { productId, quantity } = e.detail;
        addToCart(productId, quantity);
    });

    // Custom event to sync external state
    window.addEventListener('cartUpdated', () => {
        APP_STATE.cart = JSON.parse(localStorage.getItem('builderpro_cart') || '[]');
        updateCartDOMState(APP_STATE.cart, APP_STATE.products);
        renderCartItems(APP_STATE.cart, APP_STATE.products);
    });

    // 12. Routing Hooks
    window.addEventListener('hashchange', router);
    
    // Initial Routing run
    router();
});
