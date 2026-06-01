// ==========================================================================
// COMPONENT LIBRARY: Shared Templates & Calculation Calculators
// ==========================================================================

// Renders the header dropdown category menu list
function renderCategoryDropdown() {
    const categories = getCategories();
    const dropdown = document.getElementById('category-menu');
    if (!dropdown) return;

    dropdown.innerHTML = categories.map(cat => `
        <a href="#/products?category=${cat.id}" class="category-drop-item" data-category-id="${cat.id}">
            <div class="category-icon-wrapper">
                <i data-lucide="${cat.icon}"></i>
            </div>
            <div class="category-content">
                <span class="category-name">${cat.name}</span>
                <span class="category-desc">${cat.desc || ''}</span>
            </div>
        </a>
    `).join('');

    // Re-trigger Lucide icon parsing for new markup
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Renders a single product card HTML
function renderProductCard(product) {
    // Generate star ratings
    const fullStars = Math.floor(product.rating);
    const halfStar = product.rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    let starsHtml = '';
    for (let i = 0; i < fullStars; i++) starsHtml += '<i data-lucide="star" style="fill: var(--secondary); stroke: none;"></i>';
    if (halfStar) starsHtml += '<i data-lucide="star-half" style="fill: var(--secondary); stroke: none;"></i>';
    for (let i = 0; i < emptyStars; i++) starsHtml += '<i data-lucide="star" style="fill: none; stroke: var(--slate-300);"></i>';

    // Badge logic
    let badgeHtml = '';
    if (product.price < 50) {
        badgeHtml = `<span class="badge badge-success product-card-badge">Best Price</span>`;
    } else if (product.rating >= 4.8) {
        badgeHtml = `<span class="badge badge-primary product-card-badge">Top Rated</span>`;
    }

    return `
        <article class="product-card" data-product-id="${product.id}">
            ${badgeHtml}
            <a href="#/product/${product.id}" class="product-card-img-wrapper">
                ${product.imageSrc}
            </a>
            <div class="product-card-brand">${product.brand}</div>
            <a href="#/product/${product.id}">
                <h3 class="product-card-title">${product.name}</h3>
            </a>
            <div class="product-card-rating">
                <span class="rating-stars">${starsHtml}</span>
                <span class="rating-count">(${product.ratingCount})</span>
            </div>
            <div class="product-card-bottom">
                <div class="product-card-price">
                    <span class="price-val">₹${product.price.toLocaleString('en-IN')}</span>
                    <span class="price-unit">per ${product.unit}</span>
                </div>
                <button class="btn-card-add" data-add-cart-id="${product.id}" title="Add to Cart">
                    <i data-lucide="shopping-cart"></i>
                </button>
            </div>
        </article>
    `;
}

// Renders the cart drawer list of products
function renderCartItems(cart, products) {
    const drawerContainer = document.getElementById('cart-drawer-items');
    if (!drawerContainer) return;

    if (cart.length === 0) {
        drawerContainer.innerHTML = `
            <div class="empty-cart-msg">
                <i data-lucide="shopping-basket"></i>
                <p>Your shopping cart is empty.</p>
                <a href="#/products" class="btn-primary" id="btn-cart-shop-now">Shop Materials</a>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
    }

    drawerContainer.innerHTML = cart.map(item => {
        const prod = products.find(p => p.id === item.productId);
        if (!prod) return '';
        
        const itemSubtotal = prod.price * item.quantity;
        return `
            <div class="cart-item" data-cart-item-id="${item.productId}">
                <div class="cart-item-img">
                    ${prod.imageSrc}
                </div>
                <div class="cart-item-details">
                    <div>
                        <h4 class="cart-item-name">${prod.name}</h4>
                        <span class="cart-item-price-unit">₹${prod.price} / ${prod.unit}</span>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-qty-ctrl">
                            <button class="btn-qty-dec" data-qty-dec-id="${item.productId}">-</button>
                            <span class="qty-val">${item.quantity}</span>
                            <button class="btn-qty-inc" data-qty-inc-id="${item.productId}">+</button>
                        </div>
                        <span class="cart-item-subtotal">₹${itemSubtotal.toLocaleString('en-IN')}</span>
                        <button class="btn-remove-item" data-remove-id="${item.productId}">Remove</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Updates Navbar counts, badges and Cart totals
function updateCartDOMState(cart, products) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update header badges
    const badgeCount = document.getElementById('cart-badge-count');
    if (badgeCount) badgeCount.textContent = totalItems;
    const headerCount = document.getElementById('cart-header-count');
    if (headerCount) headerCount.textContent = totalItems;

    // Calculate money summary
    let subtotal = 0;
    cart.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) subtotal += prod.price * item.quantity;
    });

    const gst = subtotal * 0.18; // 18% GST standard on building supplies
    const total = subtotal + gst;

    // Update Drawer text values
    const subtotalEl = document.getElementById('cart-subtotal');
    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    
    const gstEl = document.getElementById('cart-gst');
    if (gstEl) gstEl.textContent = `₹${gst.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.textContent = `₹${total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    // Disable checkout button if cart is empty
    const btnCheckout = document.getElementById('btn-to-checkout');
    if (btnCheckout) {
        if (cart.length === 0) {
            btnCheckout.disabled = true;
            btnCheckout.classList.add('disabled');
        } else {
            btnCheckout.disabled = false;
            btnCheckout.classList.remove('disabled');
        }
    }
}

// Construction Material Calculator logic
// Length (ft), Height (ft), Thickness (inches: 4.5 or 9)
function calculateWallMaterials(length, height, thickness) {
    if (length <= 0 || height <= 0) {
        return { bricks: 0, cement: 0, sand: 0 };
    }

    // 1. Calculate wall volume in cubic feet (CFT)
    const thickFeet = thickness / 12;
    const volumeCFT = length * height * thickFeet;

    // 2. Bricks required:
    // Traditional country bricks in India (approx. 9" x 4" x 3" or 9" x 4.5" x 3") average 13.5 bricks per CFT of masonry.
    // We add a standard 5% wastage factor.
    const bricksNeeded = Math.ceil(volumeCFT * 13.5 * 1.05);

    // 3. Dry mortar volume (CFT):
    // Wet mortar volume is approx 30% of total masonry volume for country bricks.
    // Dry mortar volume including shrinkage/wastage is wet volume * 1.33.
    // This gives a dry mortar factor of 0.30 * 1.33 = 0.399 CFT per CFT of brickwork.
    const dryMortarCFT = volumeCFT * 0.399;

    // 4. Mortar mix ratio parts:
    // Thinner 4.5" partitions use a richer mix of 1:4 (1 cement : 4 sand) for stability
    // Standard 9" load-bearing walls use a mix of 1:6 (1 cement : 6 sand)
    let cementVolumeCFT, sandVolumeCFT;
    if (thickness <= 4.5) {
        // 1:4 Ratio -> Total parts = 5
        cementVolumeCFT = dryMortarCFT * (1 / 5);
        sandVolumeCFT = dryMortarCFT * (4 / 5);
    } else {
        // 1:6 Ratio -> Total parts = 7
        cementVolumeCFT = dryMortarCFT * (1 / 7);
        sandVolumeCFT = dryMortarCFT * (6 / 7);
    }

    // 5. Cement bags needed:
    // 1 Bag of Cement (50kg) is exactly 1.25 cubic feet (CFT).
    const cementBagsNeeded = Math.ceil(cementVolumeCFT / 1.25);

    // 6. Sand needed in cubic feet (CFT):
    const sandCFTNeeded = parseFloat(sandVolumeCFT.toFixed(1));

    return {
        bricks: bricksNeeded,
        cement: cementBagsNeeded,
        sand: sandCFTNeeded
    };
}
