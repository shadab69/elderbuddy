// ==========================================================================
// VIEWS MODULE: Rendering Engines for the SPA Routes
// ==========================================================================

// Helper: Compress and read image file to lightweight Base64 string
function compressAndReadFile(file, maxWidth, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            let width = img.width;
            let height = img.height;
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
            callback(dataUrl);
        };
        img.onerror = function() {
            alert('Error loading image. Please try another file.');
        };
        img.src = e.target.result;
    };
    reader.onerror = function() {
        alert('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
}

// --------------------------------------------------------------------------
// 1. HOME VIEW
// --------------------------------------------------------------------------
function renderHomeView(root) {
    const categories = getCategories();
    const allProducts = getProducts();
    const featuredProducts = allProducts.filter(p => p.id.startsWith('p')); // Display catalog products as featured
    const banners = getBanners();

    const slidesHtml = banners.map((b, index) => {
        const isActive = index === 0 ? 'active' : '';
        const link = b.link || '#/products';
        const bgColor = b.bgColor ? `background-color: ${b.bgColor};` : '';
        const bgPos = b.position ? `background-position: center ${b.position};` : 'background-position: center;';

        if (b.styleType === 'dual') {
            return `
                <div class="carousel-slide ${isActive}" onclick="location.hash='${link}'" style="cursor: pointer; ${bgColor}">
                    <div class="slide-blur-bg" style="background-image: url('${b.imageSrc}');"></div>
                    <div class="slide-main-img" style="background-image: url('${b.imageSrc}'); ${bgPos}"></div>
                </div>
            `;
        } else if (b.styleType === 'contain') {
            return `
                <div class="carousel-slide ${isActive}" onclick="location.hash='${link}'" style="cursor: pointer; background-image: url('${b.imageSrc}'); background-size: contain; ${bgPos} background-repeat: no-repeat; ${bgColor}">
                </div>
            `;
        } else if (b.styleType === 'stretch') {
            return `
                <div class="carousel-slide ${isActive}" onclick="location.hash='${link}'" style="cursor: pointer; background-image: url('${b.imageSrc}'); background-size: 100% 100%; ${bgColor}">
                </div>
            `;
        } else { // 'cover'
            return `
                <div class="carousel-slide ${isActive}" onclick="location.hash='${link}'" style="cursor: pointer; background-image: url('${b.imageSrc}'); background-size: cover; ${bgPos} background-repeat: no-repeat; ${bgColor}">
                </div>
            `;
        }
    }).join('');

    const indicatorsHtml = banners.map((b, index) => {
        const isActive = index === 0 ? 'active' : '';
        return `<span class="indicator ${isActive}" data-slide="${index}"></span>`;
    }).join('');

    root.innerHTML = `
        <div class="container animate-fade-in">
            <!-- Hero Carousel -->
            <section class="hero-carousel-container">
                <div class="carousel-track" id="hero-carousel-track">
                    ${slidesHtml}
                </div>
                <!-- Carousel Controls -->
                <button class="carousel-arrow prev" id="btn-carousel-prev"><i data-lucide="chevron-left"></i></button>
                <button class="carousel-arrow next" id="btn-carousel-next"><i data-lucide="chevron-right"></i></button>
                <!-- Carousel Indicators -->
                <div class="carousel-indicators">
                    ${indicatorsHtml}
                </div>
            </section>

            <!-- Brands Slider Section (ElderOBuddy style) -->
            <section class="home-section">
                <div class="section-header">
                    <h2>Brands</h2>
                    <a href="#/products" class="btn-view-all">View All</a>
                </div>
                <div class="brands-carousel-wrapper">
                    <button class="brands-arrow prev" id="btn-brands-prev"><i data-lucide="chevron-left"></i></button>
                    <div class="brands-track" id="brands-track">
                        <div class="brand-item-card"><div class="brand-logo-mock ambuja">Ambuja<span>Cement</span></div></div>
                        <div class="brand-item-card"><div class="brand-logo-mock asianpaints">asian<span>paints</span></div></div>
                        <div class="brand-item-card"><div class="brand-logo-mock birla">Birla-A1<span>StrongCrete</span></div></div>
                        <div class="brand-item-card"><div class="brand-logo-mock bondit">BONDIT<span>Const. Chemicals</span></div></div>
                        <div class="brand-item-card"><div class="brand-logo-mock centuryply">CENTURY<span>PLY</span></div></div>
                        <div class="brand-item-card"><div class="brand-logo-mock grasim">G<span>GRASIM</span></div></div>
                        <div class="brand-item-card"><div class="brand-logo-mock godrej">godrej</div></div>
                        <div class="brand-item-card"><div class="brand-logo-mock greenpanel">green<span>panel</span></div></div>
                    </div>
                    <button class="brands-arrow next" id="btn-brands-next"><i data-lucide="chevron-right"></i></button>
                </div>
            </section>

            <!-- Hot Deals Slider Section (ElderOBuddy style) -->
            <section class="home-section">
                <div class="section-header">
                    <h2>Hot Deals</h2>
                </div>
                <div class="hot-deals-carousel-wrapper">
                    <button class="brands-arrow prev" id="btn-deals-prev"><i data-lucide="chevron-left"></i></button>
                    <div class="hot-deals-track" id="hot-deals-track">
                        <!-- Loaded dynamically inside renderHomeView script -->
                    </div>
                    <button class="brands-arrow next" id="btn-deals-next"><i data-lucide="chevron-right"></i></button>
                </div>
            </section>



            <!-- Offers For You Slider Section (ElderOBuddy style) -->
            <section class="home-section">
                <div class="section-header">
                    <h2>Offers For You</h2>
                </div>
                <div class="hot-deals-carousel-wrapper">
                    <button class="brands-arrow prev" id="btn-offers-prev"><i data-lucide="chevron-left"></i></button>
                    <div class="hot-deals-track" id="offers-track">
                        <!-- Loaded dynamically inside renderHomeView script -->
                    </div>
                    <button class="brands-arrow next" id="btn-offers-next"><i data-lucide="chevron-right"></i></button>
                </div>
            </section>

            <!-- Trending Offers Slider Section (ElderOBuddy style) -->
            <section class="home-section">
                <div class="section-header">
                    <h2>Trending Offers</h2>
                </div>
                <div class="hot-deals-carousel-wrapper">
                    <button class="brands-arrow prev" id="btn-trending-prev"><i data-lucide="chevron-left"></i></button>
                    <div class="hot-deals-track" id="trending-track">
                        <!-- Loaded dynamically inside renderHomeView script -->
                    </div>
                    <button class="brands-arrow next" id="btn-trending-next"><i data-lucide="chevron-right"></i></button>
                </div>
            </section>

            <!-- Buying Guide Slider Section (ElderOBuddy style) -->
            <section class="home-section">
                <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <h2>Buying Guide</h2>
                    <a href="#/products" class="btn-view-all" style="background-color: #2196f3; color: white; border-radius: 4px; padding: 6px 16px; font-weight: 500; font-size: 0.85rem; border: none; text-decoration: none;">View All</a>
                </div>
                <div class="hot-deals-carousel-wrapper">
                    <button class="brands-arrow prev" id="btn-guide-prev"><i data-lucide="chevron-left"></i></button>
                    <div class="buying-guide-track" id="buying-guide-track">
                        <!-- Loaded dynamically inside renderHomeView script -->
                    </div>
                    <button class="brands-arrow next" id="btn-guide-next"><i data-lucide="chevron-right"></i></button>
                </div>
            </section>

            <!-- Featured Materials Slider Section -->
            <section class="home-section">
                <div class="section-header">
                    <h2>Featured Materials</h2>
                    <a href="#/products" class="btn-view-all">View All</a>
                </div>
                <div class="hot-deals-carousel-wrapper">
                    <button class="brands-arrow prev" id="btn-featured-prev"><i data-lucide="chevron-left"></i></button>
                    <div class="hot-deals-track" id="featured-track">
                        ${featuredProducts.map(prod => renderProductCard(prod)).join('')}
                    </div>
                    <button class="brands-arrow next" id="btn-featured-next"><i data-lucide="chevron-right"></i></button>
                </div>
            </section>

            <!-- What Client Say Testimonial Section (ElderOBuddy style) -->
            <section class="home-section text-center">
                <div class="section-header" style="justify-content: center; border-bottom: none; margin-bottom: 20px;">
                    <h2 style="text-align: center; width: 100%;">What Client Say</h2>
                </div>
                <div class="hot-deals-carousel-wrapper">
                    <button class="brands-arrow prev" id="btn-client-prev"><i data-lucide="chevron-left"></i></button>
                    <div class="client-testimonials-track" id="client-testimonials-track">
                        <div class="testimonial-card-bm">
                            <span class="testimonial-quote-bm">”</span>
                            <p class="testimonial-text-bm">"ElderOBuddy is an EXCELLENT platform for all types of Building Material and Construction products like Cement ,TMT,Electricals, Plumbing etc., It helps us to procure building materials during construction period at best price."</p>
                            <div class="testimonial-divider-bm"></div>
                        </div>
                        <div class="testimonial-card-bm">
                            <span class="testimonial-quote-bm">”</span>
                            <p class="testimonial-text-bm">Portals like ElderOBuddy which I am using are being used by many more people like me. This has helped us to get all construction needs under one roof.</p>
                            <div class="testimonial-divider-bm"></div>
                        </div>
                        <div class="testimonial-card-bm">
                            <span class="testimonial-quote-bm">”</span>
                            <p class="testimonial-text-bm">ElderOBuddy.in has shown the path to the future of buying construction materials. Although it is a new concept, it will go a long way in the years to come, easy to purchase for everyone. They provide support throughout, from getting the best quotes to material delivery at the sites.</p>
                            <div class="testimonial-divider-bm"></div>
                        </div>
                    </div>
                    <button class="brands-arrow next" id="btn-client-next"><i data-lucide="chevron-right"></i></button>
                </div>
            </section>

            <!-- Trust Badges Section -->
            <section class="trust-bar-section">
                <div class="container trust-bar-grid">
                    <div class="trust-badge-item">
                        <div class="trust-icon-wrapper">
                            <i data-lucide="credit-card"></i>
                        </div>
                        <div class="trust-content-bm">
                            <h4>100% SECURE PAYMENTS</h4>
                            <p>Moving your card details to a much more</p>
                        </div>
                    </div>
                    <div class="trust-badge-item">
                        <div class="trust-icon-wrapper">
                            <i data-lucide="shield-check"></i>
                        </div>
                        <div class="trust-content-bm">
                            <h4>TRUST PAY</h4>
                            <p>100% Payment Protection.</p>
                        </div>
                    </div>
                    <div class="trust-badge-item">
                        <div class="trust-icon-wrapper">
                            <i data-lucide="truck"></i>
                        </div>
                        <div class="trust-content-bm">
                            <h4>SHIPPING</h4>
                            <p>Free shipping on all orders (Subject to order value)</p>
                        </div>
                    </div>
                    <div class="trust-badge-item">
                        <div class="trust-icon-wrapper">
                            <i data-lucide="messages-square"></i>
                        </div>
                        <div class="trust-content-bm">
                            <h4>SUPPORT 24/7</h4>
                            <p>We support online/offline 24 hours</p>
                        </div>
                    </div>
                </div>
            </section>





            <!-- Sourcing Services banner -->
            <section class="home-section">
                <div class="section-header">
                    <h2>Construction Services & Sourcing</h2>
                </div>
                <div class="services-grid-bm">
                    <div class="category-card" style="align-items: flex-start; text-align: left; padding: 30px;">
                        <div class="category-card-icon"><i data-lucide="truck"></i></div>
                        <h3 style="margin-bottom:10px;">Bulk Site Sourcing</h3>
                        <p style="font-size:0.85rem; margin-bottom:15px;">Order truckloads of steel, cement, or aggregates directly from mills. We negotiate pricing and manage site transport logistics.</p>
                        <button class="btn-view-all service-inq-trigger" data-service="sourcing">Request Sourcing <i data-lucide="chevron-right"></i></button>
                    </div>
                    
                    <div class="category-card" style="align-items: flex-start; text-align: left; padding: 30px;">
                        <div class="category-card-icon"><i data-lucide="pencil-ruler"></i></div>
                        <h3 style="margin-bottom:10px;">Architectural Planning</h3>
                        <p style="font-size:0.85rem; margin-bottom:15px;">Get customized 2D layout drafting, structural planning, and material quantity take-off estimations from our engineers.</p>
                        <button class="btn-view-all service-inq-trigger" data-service="estimation">Request Design <i data-lucide="chevron-right"></i></button>
                    </div>

                    <div class="category-card" style="align-items: flex-start; text-align: left; padding: 30px;">
                        <div class="category-card-icon"><i data-lucide="activity"></i></div>
                        <h3 style="margin-bottom:10px;">Execution Supervision</h3>
                        <p style="font-size:0.85rem; margin-bottom:15px;">Hire project managers to supervise excavation, reinforcing layups, foundation pours, and quality masonry on site.</p>
                        <button class="btn-view-all service-inq-trigger" data-service="execution">Request Execution <i data-lucide="chevron-right"></i></button>
                    </div>
                </div>
            </section>
        </div>
    `;

    // Hook up local buttons
    const homeEstimatorBtn = document.getElementById('btn-home-estimator');
    if (homeEstimatorBtn) {
        homeEstimatorBtn.addEventListener('click', () => {
            document.getElementById('calc-modal-overlay').classList.add('active');
        });
    }

    // Carousel script logic
    const slides = root.querySelectorAll('.carousel-slide');
    const indicators = root.querySelectorAll('.carousel-indicators .indicator');
    const prevBtn = root.querySelector('#btn-carousel-prev');
    const nextBtn = root.querySelector('#btn-carousel-next');
    let currentSlide = 0;
    let carouselInterval = null;

    function goToSlide(n) {
        if (slides.length === 0) return;
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    function startAutoSlide() {
        stopAutoSlide();
        carouselInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 6000); // Rotate every 6 seconds
    }

    function stopAutoSlide() {
        if (carouselInterval) clearInterval(carouselInterval);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
            startAutoSlide(); // Reset timer
        });
        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
            startAutoSlide(); // Reset timer
        });
    }

    indicators.forEach((ind, index) => {
        ind.addEventListener('click', () => {
            goToSlide(index);
            startAutoSlide();
        });
    });

    // Start auto slide
    startAutoSlide();

    // Render Hot Deals cards dynamically
    const hotDealsIds = ['hd1', 'hd2', 'hd3', 'hd4', 'hd5', 'hd6'];
    const hotDeals = allProducts.filter(p => hotDealsIds.includes(p.id));
    const dealsTrack = root.querySelector('#hot-deals-track');
    if (dealsTrack) {
        dealsTrack.innerHTML = hotDeals.map(p => {
            const originalPriceHtml = p.originalPrice ? `<div class="orig-price-crossed">M.R.P.: <del>Rs.${p.originalPrice.toLocaleString('en-IN')}</del></div>` : '';
            const discountBadgeHtml = p.discountLabel ? `<div class="discount-badge-bm">${p.discountLabel}</div>` : '';
            
            let priceInfo = '';
            if (p.originalPrice) {
                priceInfo = `
                    <div class="deal-price-row">
                        ${originalPriceHtml}
                        <div class="sale-price-row">
                            <span class="sale-label">Sale Price:</span>
                            <span class="sale-val">Rs.${p.price.toLocaleString('en-IN')}</span>
                            <span class="price-unit">per ${p.unit}</span>
                        </div>
                        ${discountBadgeHtml}
                    </div>
                `;
            } else {
                priceInfo = `
                    <div class="deal-price-row">
                        <div class="mrp-row">
                            <span class="mrp-label">M.R.P.:</span>
                            <span class="mrp-val">Rs.${p.price.toLocaleString('en-IN')}</span>
                            <span class="price-unit">per ${p.unit}</span>
                        </div>
                    </div>
                `;
            }

            return `
                <div class="deal-card-bm" data-deal-id="${p.id}">
                    <a href="#/product/${p.id}" class="deal-card-img-wrapper">
                        ${p.imageSrc}
                    </a>
                    <div class="deal-card-body">
                        <a href="#/product/${p.id}">
                            <h4 class="deal-card-title">${p.name}</h4>
                        </a>
                        ${priceInfo}
                        <div class="deal-card-vendor">by ${p.brand}</div>
                    </div>
                    <div class="deal-card-footer">
                        <label class="compare-checkbox-label">
                            <input type="checkbox" class="compare-check" data-compare-id="${p.id}">
                            <span>Add To Compare</span>
                        </label>
                        <button class="btn-card-add" data-add-cart-id="${p.id}" title="Add to Cart" style="width:28px; height:28px; border-radius:4px; padding:0; display:flex; align-items:center; justify-content:center; border:1px solid var(--border-color);">
                            <i data-lucide="shopping-cart" style="width:14px; height:14px;"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Render Offers For You cards dynamically
    const offersIds = ['hd7', 'hd8', 'hd9', 'hd10', 'hd11', 'hd12'];
    const offersForYou = allProducts.filter(p => offersIds.includes(p.id));
    const offersTrack = root.querySelector('#offers-track');
    if (offersTrack) {
        offersTrack.innerHTML = offersForYou.map(p => {
            const originalPriceHtml = p.originalPrice ? `<div class="orig-price-crossed">M.R.P.: <del>Rs.${p.originalPrice.toLocaleString('en-IN')}</del></div>` : '';
            const discountBadgeHtml = p.discountLabel ? `<div class="discount-badge-bm">${p.discountLabel}</div>` : '';
            
            let priceInfo = '';
            if (p.originalPrice) {
                priceInfo = `
                    <div class="deal-price-row">
                        ${originalPriceHtml}
                        <div class="sale-price-row">
                            <span class="sale-label">Sale Price:</span>
                            <span class="sale-val">Rs.${p.price.toLocaleString('en-IN')}</span>
                            <span class="price-unit">per ${p.unit}</span>
                        </div>
                        ${discountBadgeHtml}
                    </div>
                `;
            } else {
                priceInfo = `
                    <div class="deal-price-row">
                        <div class="mrp-row">
                            <span class="mrp-label">M.R.P.:</span>
                            <span class="mrp-val">Rs.${p.price.toLocaleString('en-IN')}</span>
                            <span class="price-unit">per ${p.unit}</span>
                        </div>
                    </div>
                `;
            }

            return `
                <div class="deal-card-bm" data-deal-id="${p.id}">
                    <a href="#/product/${p.id}" class="deal-card-img-wrapper">
                        ${p.imageSrc}
                    </a>
                    <div class="deal-card-body">
                        <a href="#/product/${p.id}">
                            <h4 class="deal-card-title">${p.name}</h4>
                        </a>
                        ${priceInfo}
                        <div class="deal-card-vendor">by ${p.brand}</div>
                    </div>
                    <div class="deal-card-footer">
                        <label class="compare-checkbox-label">
                            <input type="checkbox" class="compare-check" data-compare-id="${p.id}">
                            <span>Add To Compare</span>
                        </label>
                        <button class="btn-card-add" data-add-cart-id="${p.id}" title="Add to Cart" style="width:28px; height:28px; border-radius:4px; padding:0; display:flex; align-items:center; justify-content:center; border:1px solid var(--border-color);">
                            <i data-lucide="shopping-cart" style="width:14px; height:14px;"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Render Trending Offers cards dynamically
    const trendingProducts = allProducts.filter(p => p.id.startsWith('tr'));
    const trendingTrack = root.querySelector('#trending-track');
    if (trendingTrack) {
        trendingTrack.innerHTML = trendingProducts.map(p => {
            const originalPriceHtml = p.originalPrice ? `<div class="orig-price-crossed">M.R.P.: <del>Rs.${p.originalPrice.toLocaleString('en-IN')}</del></div>` : '';
            const discountBadgeHtml = p.discountLabel ? `<div class="discount-badge-bm">${p.discountLabel}</div>` : '';
            
            let priceInfo = '';
            if (p.originalPrice) {
                priceInfo = `
                    <div class="deal-price-row">
                        ${originalPriceHtml}
                        <div class="sale-price-row">
                            <span class="sale-label">Sale Price:</span>
                            <span class="sale-val">Rs.${p.price.toLocaleString('en-IN')}</span>
                            <span class="price-unit">per ${p.unit}</span>
                        </div>
                        ${discountBadgeHtml}
                    </div>
                `;
            } else {
                priceInfo = `
                    <div class="deal-price-row">
                        <div class="mrp-row">
                            <span class="mrp-label">M.R.P.:</span>
                            <span class="mrp-val">Rs.${p.price.toLocaleString('en-IN')}</span>
                            <span class="price-unit">per ${p.unit}</span>
                        </div>
                    </div>
                `;
            }

            return `
                <div class="deal-card-bm" data-deal-id="${p.id}">
                    <a href="#/product/${p.id}" class="deal-card-img-wrapper">
                        ${p.imageSrc}
                    </a>
                    <div class="deal-card-body">
                        <a href="#/product/${p.id}">
                            <h4 class="deal-card-title">${p.name}</h4>
                        </a>
                        ${priceInfo}
                        <div class="deal-card-vendor">by ${p.brand}</div>
                    </div>
                    <div class="deal-card-footer">
                        <label class="compare-checkbox-label">
                            <input type="checkbox" class="compare-check" data-compare-id="${p.id}">
                            <span>Add To Compare</span>
                        </label>
                        <button class="btn-card-add" data-add-cart-id="${p.id}" title="Add to Cart" style="width:28px; height:28px; border-radius:4px; padding:0; display:flex; align-items:center; justify-content:center; border:1px solid var(--border-color);">
                            <i data-lucide="shopping-cart" style="width:14px; height:14px;"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Render Buying Guide cards dynamically
    const guidePosts = getGuidePosts ? getGuidePosts() : [];
    const guideTrack = root.querySelector('#buying-guide-track');
    if (guideTrack && guidePosts.length > 0) {
        guideTrack.innerHTML = guidePosts.map(p => {
            let mediaHtml = '';
            if (p.imageSrc.startsWith('<svg') || p.imageSrc.startsWith('<img')) {
                mediaHtml = p.imageSrc;
            } else {
                mediaHtml = `<img src="${p.imageSrc}" alt="${p.title}" class="guide-card-img">`;
            }
            return `
                <div class="guide-card">
                    <div class="guide-card-media">
                        ${mediaHtml}
                    </div>
                    <div class="guide-card-body">
                        <div class="guide-card-date">${p.date}</div>
                        <h4 class="guide-card-title">${p.title}</h4>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Brands track horizontal scrolling logic
    const brandsTrack = root.querySelector('#brands-track');
    const brandsPrev = root.querySelector('#btn-brands-prev');
    const brandsNext = root.querySelector('#btn-brands-next');
    if (brandsTrack && brandsPrev && brandsNext) {
        brandsPrev.addEventListener('click', () => {
            brandsTrack.scrollBy({ left: -200, behavior: 'smooth' });
        });
        brandsNext.addEventListener('click', () => {
            brandsTrack.scrollBy({ left: 200, behavior: 'smooth' });
        });
    }

    // Hot Deals track horizontal scrolling logic
    const dealsTrackScroll = root.querySelector('#hot-deals-track');
    const dealsPrev = root.querySelector('#btn-deals-prev');
    const dealsNext = root.querySelector('#btn-deals-next');
    if (dealsTrackScroll && dealsPrev && dealsNext) {
        dealsPrev.addEventListener('click', () => {
            dealsTrackScroll.scrollBy({ left: -240, behavior: 'smooth' });
        });
        dealsNext.addEventListener('click', () => {
            dealsTrackScroll.scrollBy({ left: 240, behavior: 'smooth' });
        });
    }

    // Offers For You track horizontal scrolling logic
    const offersTrackScroll = root.querySelector('#offers-track');
    const offersPrev = root.querySelector('#btn-offers-prev');
    const offersNext = root.querySelector('#btn-offers-next');
    if (offersTrackScroll && offersPrev && offersNext) {
        offersPrev.addEventListener('click', () => {
            offersTrackScroll.scrollBy({ left: -240, behavior: 'smooth' });
        });
        offersNext.addEventListener('click', () => {
            offersTrackScroll.scrollBy({ left: 240, behavior: 'smooth' });
        });
    }

    // Trending Offers scroll logic
    const trendingTrackScroll = root.querySelector('#trending-track');
    const trendingPrev = root.querySelector('#btn-trending-prev');
    const trendingNext = root.querySelector('#btn-trending-next');
    if (trendingTrackScroll && trendingPrev && trendingNext) {
        trendingPrev.addEventListener('click', () => {
            trendingTrackScroll.scrollBy({ left: -240, behavior: 'smooth' });
        });
        trendingNext.addEventListener('click', () => {
            trendingTrackScroll.scrollBy({ left: 240, behavior: 'smooth' });
        });
    }

    // Buying Guide scroll logic
    const guideTrackScroll = root.querySelector('#buying-guide-track');
    const guidePrev = root.querySelector('#btn-guide-prev');
    const guideNext = root.querySelector('#btn-guide-next');
    if (guideTrackScroll && guidePrev && guideNext) {
        guidePrev.addEventListener('click', () => {
            guideTrackScroll.scrollBy({ left: -280, behavior: 'smooth' });
        });
        guideNext.addEventListener('click', () => {
            guideTrackScroll.scrollBy({ left: 280, behavior: 'smooth' });
        });
    }

    // Featured Materials scroll logic
    const featuredTrackScroll = root.querySelector('#featured-track');
    const featuredPrev = root.querySelector('#btn-featured-prev');
    const featuredNext = root.querySelector('#btn-featured-next');
    if (featuredTrackScroll && featuredPrev && featuredNext) {
        featuredPrev.addEventListener('click', () => {
            featuredTrackScroll.scrollBy({ left: -280, behavior: 'smooth' });
        });
        featuredNext.addEventListener('click', () => {
            featuredTrackScroll.scrollBy({ left: 280, behavior: 'smooth' });
        });
    }

    // Client testimonials scroll logic
    const clientTrackScroll = root.querySelector('#client-testimonials-track');
    const clientPrev = root.querySelector('#btn-client-prev');
    const clientNext = root.querySelector('#btn-client-next');
    if (clientTrackScroll && clientPrev && clientNext) {
        clientPrev.addEventListener('click', () => {
            clientTrackScroll.scrollBy({ left: -320, behavior: 'smooth' });
        });
        clientNext.addEventListener('click', () => {
            clientTrackScroll.scrollBy({ left: 320, behavior: 'smooth' });
        });
    }

    // Clean up interval when window hash changes (handled by router, but good safety)
    const cleanup = () => {
        stopAutoSlide();
        window.removeEventListener('hashchange', cleanup);
    };
    window.addEventListener('hashchange', cleanup);

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// --------------------------------------------------------------------------
// 2. PRODUCT LISTING VIEW (WITH FILTER SIDEBAR)
// --------------------------------------------------------------------------
function renderProductListView(root, activeFilters = {}) {
    const categories = getCategories();
    const allProducts = getProducts();

    // Parse active filters
    const filterCat = activeFilters.category || '';
    const filterSearch = activeFilters.search || '';

    // Extrapolate all unique brands in database
    const brands = [...new Set(allProducts.map(p => p.brand))];

    root.innerHTML = `
        <div class="container animate-fade-in">
            <div class="listing-layout">
                <!-- Filters Sidebar -->
                <aside class="filters-sidebar">
                    <div class="filter-section">
                        <h4>Categories</h4>
                        <div class="checkbox-group" id="filter-categories-list">
                            <label class="checkbox-label">
                                <input type="radio" name="filter-cat" value="" ${filterCat === '' ? 'checked' : ''}>
                                <span>All Categories</span>
                            </label>
                            ${categories.map(cat => `
                                <label class="checkbox-label">
                                    <input type="radio" name="filter-cat" value="${cat.id}" ${filterCat === cat.id ? 'checked' : ''}>
                                    <span>${cat.name}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <div class="filter-section">
                        <h4>Filter by Brand</h4>
                        <div class="checkbox-group" id="filter-brands-list">
                            ${brands.map(brand => `
                                <label class="checkbox-label">
                                    <input type="checkbox" class="brand-filter-check" value="${brand}">
                                    <span>${brand}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <div class="filter-section">
                        <h4>Price Range</h4>
                        <div style="display: flex; gap: 10px; margin-top: 10px;">
                            <input type="number" id="price-min" placeholder="Min" class="w-full" style="padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; font-size:0.8rem;">
                            <input type="number" id="price-max" placeholder="Max" class="w-full" style="padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; font-size:0.8rem;">
                        </div>
                    </div>

                    <button class="btn-primary w-full" id="btn-apply-filters" style="margin-top: 15px; padding: 10px; font-size: 0.85rem;">
                        Apply Filters
                    </button>
                </aside>

                <!-- Listing Grid Area -->
                <div class="listing-content">
                    <div class="listing-header">
                        <div>
                            <p><span id="listing-matched-count">0</span> products found</p>
                            ${filterSearch ? `<p style="font-size:0.8rem; margin-top:2px;">Showing search results for "<strong>${filterSearch}</strong>"</p>` : ''}
                        </div>
                        <div class="listing-sort-select">
                            <select id="listing-sort">
                                <option value="featured">Sort by: Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Popularity / Stars</option>
                            </select>
                        </div>
                    </div>

                    <div class="products-grid" id="listing-products-container">
                        <!-- Loaded dynamically via filterProducts() -->
                    </div>
                    
                    <div class="no-results w-full" id="listing-no-results" style="display:none;">
                        <i data-lucide="search-code"></i>
                        <h3>No materials matched your filters.</h3>
                        <p style="margin-top:8px;">Try clearing search keywords or selecting different brands.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Filter Logic runner
    function filterProducts() {
        let filtered = [...allProducts];

        // 1. Category Filter
        const selectedCatEl = document.querySelector('input[name="filter-cat"]:checked');
        const selectedCat = selectedCatEl ? selectedCatEl.value : '';
        if (selectedCat) {
            filtered = filtered.filter(p => p.category === selectedCat);
        }

        // 2. Search Keyword Filter
        if (filterSearch) {
            const query = filterSearch.toLowerCase().trim();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.brand.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        // 3. Brands Checked Filter
        const brandChecks = document.querySelectorAll('.brand-filter-check:checked');
        if (brandChecks.length > 0) {
            const selectedBrands = Array.from(brandChecks).map(c => c.value);
            filtered = filtered.filter(p => selectedBrands.includes(p.brand));
        }

        // 4. Price Limits Filter
        const minVal = parseFloat(document.getElementById('price-min').value);
        const maxVal = parseFloat(document.getElementById('price-max').value);
        if (!isNaN(minVal)) {
            filtered = filtered.filter(p => p.price >= minVal);
        }
        if (!isNaN(maxVal)) {
            filtered = filtered.filter(p => p.price <= maxVal);
        }

        // 5. Sorting Options
        const sortType = document.getElementById('listing-sort').value;
        if (sortType === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortType === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortType === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        // Render matched products
        const grid = document.getElementById('listing-products-container');
        const noResults = document.getElementById('listing-no-results');
        const matchCount = document.getElementById('listing-matched-count');

        matchCount.textContent = filtered.length;

        if (filtered.length === 0) {
            grid.innerHTML = '';
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
            grid.innerHTML = filtered.map(prod => renderProductCard(prod)).join('');
        }

        if (window.lucide) window.lucide.createIcons();
    }

    // Set up listeners
    document.getElementById('btn-apply-filters').addEventListener('click', filterProducts);
    document.getElementById('listing-sort').addEventListener('change', filterProducts);
    
    // Check brand boxes if they match any active filters
    // Render initial list
    filterProducts();
}

// --------------------------------------------------------------------------
// 3. PRODUCT DETAIL VIEW
// --------------------------------------------------------------------------
function renderProductDetailView(root, productId) {
    const prod = getProductById(productId);
    if (!prod) {
        root.innerHTML = `
            <div class="container text-center" style="padding: 100px 0;">
                <h2>Material Not Found</h2>
                <p>The product code you requested does not exist or has been removed.</p>
                <a href="#/products" class="btn-primary" style="margin-top:20px; display:inline-block;">Go Back to Materials</a>
            </div>
        `;
        return;
    }

    // Stars rendering
    const fullStars = Math.floor(prod.rating);
    const halfStar = prod.rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    let starsHtml = '';
    for (let i = 0; i < fullStars; i++) starsHtml += '<i data-lucide="star" style="fill: var(--secondary); stroke: none;"></i>';
    if (halfStar) starsHtml += '<i data-lucide="star-half" style="fill: var(--secondary); stroke: none;"></i>';
    for (let i = 0; i < emptyStars; i++) starsHtml += '<i data-lucide="star" style="fill: none; stroke: var(--slate-300);"></i>';

    // Fetch related items (same category, excluding self)
    const related = getProducts()
        .filter(p => p.category === prod.category && p.id !== prod.id)
        .slice(0, 3);

    root.innerHTML = `
        <div class="container animate-fade-in">
            <!-- Breadcrumbs -->
            <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom: 20px;">
                <a href="#/">Home</a> &gt; 
                <a href="#/products?category=${prod.category}">${prod.category.toUpperCase()}</a> &gt; 
                <span>${prod.name}</span>
            </div>

            <!-- Detail Grid Layout -->
            <div class="product-detail-layout">
                <div class="product-detail-gallery">
                    ${prod.imageSrc}
                </div>
                
                <div class="product-detail-info">
                    <span class="detail-brand-badge">${prod.brand}</span>
                    <h2 class="detail-title">${prod.name}</h2>
                    
                    <div class="detail-meta-row">
                        <div style="display:flex; align-items:center; gap:5px;">
                            <span class="rating-stars" style="display:flex; color:var(--secondary);">${starsHtml}</span>
                            <span><strong>${prod.rating}</strong> (${prod.ratingCount} reviews)</span>
                        </div>
                        <span>|</span>
                        <span>Product ID: <strong>${prod.id}</strong></span>
                        <span>|</span>
                        <span class="badge badge-success">In Stock</span>
                    </div>

                    <div class="detail-price-box">
                        <span class="detail-price-main">₹${prod.price.toLocaleString('en-IN')}</span>
                        <span class="detail-price-unit">per ${prod.unit}</span>
                    </div>

                    <p class="detail-desc">${prod.description}</p>

                    <!-- Add to Cart Widget -->
                    <div class="detail-buying-actions">
                        <div class="detail-qty-picker">
                            <button id="btn-detail-dec">-</button>
                            <input type="number" id="detail-qty-input" value="1" min="1" readonly>
                            <button id="btn-detail-inc">+</button>
                        </div>
                        
                        <button class="btn-primary" id="btn-detail-add" style="flex:1; height:48px; display:flex; align-items:center; justify-content:center; gap:8px;">
                            <i data-lucide="shopping-cart" style="width:20px; height:20px;"></i>
                            <span>Add to Shopping Cart</span>
                        </button>
                    </div>

                    <!-- Tech Specs Table -->
                    <div class="product-specs-section">
                        <h4>Material Specifications</h4>
                        <table class="specs-table">
                            <tbody>
                                ${Object.entries(prod.specs).map(([lbl, val]) => `
                                    <tr>
                                        <td class="specs-label">${lbl}</td>
                                        <td class="specs-val">${val}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Related Products Section -->
            ${related.length > 0 ? `
                <section class="home-section" style="margin-top:50px;">
                    <div class="section-header">
                        <h2>Related Materials</h2>
                    </div>
                    <div class="products-grid">
                        ${related.map(p => renderProductCard(p)).join('')}
                    </div>
                </section>
            ` : ''}
        </div>
    `;

    // Hook listeners
    const qtyInput = document.getElementById('detail-qty-input');
    document.getElementById('btn-detail-dec').addEventListener('click', () => {
        let val = parseInt(qtyInput.value);
        if (val > 1) qtyInput.value = val - 1;
    });
    document.getElementById('btn-detail-inc').addEventListener('click', () => {
        let val = parseInt(qtyInput.value);
        qtyInput.value = val + 1;
    });

    document.getElementById('btn-detail-add').addEventListener('click', () => {
        const qty = parseInt(qtyInput.value);
        window.dispatchEvent(new CustomEvent('addToCart', { 
            detail: { productId: prod.id, quantity: qty } 
        }));
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// --------------------------------------------------------------------------
// 4. CHECKOUT VIEW
// --------------------------------------------------------------------------
function renderCheckoutView(root) {
    const products = getProducts();
    const cart = JSON.parse(localStorage.getItem('builderpro_cart') || '[]');

    if (cart.length === 0) {
        root.innerHTML = `
            <div class="container text-center" style="padding: 80px 0;">
                <i data-lucide="shopping-basket" style="width:64px; height:64px; color:var(--slate-300); margin-bottom:15px;"></i>
                <h2>Your Cart is Empty</h2>
                <p>Cannot checkout. Please add items to your cart first.</p>
                <a href="#/products" class="btn-primary" style="margin-top:20px; display:inline-block;">Browse Materials</a>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
    }

    // Totals calculations
    let subtotal = 0;
    cart.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) subtotal += prod.price * item.quantity;
    });
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    root.innerHTML = `
        <div class="container animate-fade-in">
            <h2>Secure Site Checkout</h2>
            <p style="color:var(--text-muted); margin-bottom:30px;">Complete your material delivery order. Sourcing and transport logistics are handled on site.</p>
            
            <div class="checkout-layout">
                <!-- Delivery Info Form -->
                <form id="checkout-form" class="checkout-card">
                    <h3>1. Site Delivery Details</h3>
                    <div class="form-row">
                        <div class="input-group">
                            <label for="bill-name">Recipient Name</label>
                            <input type="text" id="bill-name" placeholder="Full Name" required>
                        </div>
                        <div class="input-group">
                            <label for="bill-phone">Mobile Number</label>
                            <input type="tel" id="bill-phone" placeholder="10-digit number" required>
                        </div>
                    </div>
                    <div class="input-group">
                        <label for="bill-email">Email Address</label>
                        <input type="email" id="bill-email" placeholder="email@example.com" required>
                    </div>
                    <div class="input-group">
                        <label for="bill-address">Detailed Site Address</label>
                        <textarea id="bill-address" rows="3" placeholder="Plot No, Phase, Construction Site Land Mark..." required></textarea>
                    </div>
                    <div class="form-row">
                        <div class="input-group">
                            <label for="bill-city">City / Area</label>
                            <input type="text" id="bill-city" placeholder="e.g. Hyderabad" required>
                        </div>
                        <div class="input-group">
                            <label for="bill-pincode">Pincode</label>
                            <input type="text" id="bill-pincode" placeholder="6-digit PIN" required>
                        </div>
                    </div>

                    <h3 style="margin-top:30px;">2. Payment Method</h3>
                    <div class="checkbox-group" style="margin-bottom: 20px;">
                        <label class="checkbox-label" style="background:var(--bg-surface-alt); padding:12px; border-radius:6px; border:1px solid var(--border-color);">
                            <input type="radio" name="payment-method" value="cod" checked>
                            <strong>Cash on Site Delivery (COD) / Bank Transfer</strong>
                        </label>
                        <label class="checkbox-label" style="background:var(--bg-surface-alt); padding:12px; border-radius:6px; border:1px solid var(--border-color); opacity: 0.7;">
                            <input type="radio" name="payment-method" value="upi" disabled>
                            <span>Online UPI / QR Payment (Currently Disabled for Maintenance)</span>
                        </label>
                    </div>

                    <button type="submit" class="btn-primary w-full" style="height:52px; font-size:1.1rem; margin-top:20px;">
                        Place Material Order (₹${total.toLocaleString('en-IN', {maximumFractionDigits: 0})})
                    </button>
                </form>

                <!-- Order summary pane -->
                <div class="checkout-summary-box">
                    <h3>Order Summary</h3>
                    <div style="max-height: 250px; overflow-y:auto; margin-bottom:15px; border-bottom:1px solid var(--border-color); padding-bottom:15px;">
                        ${cart.map(item => {
                            const prod = products.find(p => p.id === item.productId);
                            if (!prod) return '';
                            return `
                                <div class="checkout-item-mini">
                                    <span class="name">${prod.name} (x${item.quantity})</span>
                                    <span>₹${(prod.price * item.quantity).toLocaleString('en-IN')}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    
                    <div class="cart-summary-row">
                        <span>Items Subtotal</span>
                        <span>₹${subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="cart-summary-row gst-row">
                        <span>GST (18%)</span>
                        <span>₹${gst.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="cart-summary-row total-row" style="margin-bottom:0;">
                        <span>Total Payable</span>
                        <span style="color:var(--primary);">₹${total.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Form submission listener
    document.getElementById('checkout-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Build order object
        const orderData = {
            customer: {
                name: document.getElementById('bill-name').value,
                phone: document.getElementById('bill-phone').value,
                email: document.getElementById('bill-email').value,
                address: document.getElementById('bill-address').value,
                city: document.getElementById('bill-city').value,
                pincode: document.getElementById('bill-pincode').value
            },
            items: cart.map(item => {
                const prod = products.find(p => p.id === item.productId);
                return {
                    productId: item.productId,
                    name: prod ? prod.name : 'Unknown Material',
                    quantity: item.quantity,
                    price: prod ? prod.price : 0
                };
            }),
            subtotal,
            gst,
            total,
            paymentMethod: 'Cash on Site Delivery'
        };

        // Save order via data layer
        const savedOrder = await saveOrder(orderData);

        // Fetch refreshed server data in memory
        if (window.fetchInitialData) await window.fetchInitialData();

        // Clear cart
        localStorage.setItem('builderpro_cart', JSON.stringify([]));
        window.dispatchEvent(new CustomEvent('cartUpdated'));

        // Render Success View
        root.innerHTML = `
            <div class="container animate-fade-in">
                <div class="checkout-success-view">
                    <div class="success-icon-wrapper">
                        <i data-lucide="check"></i>
                    </div>
                    <h2>Order Placed Successfully!</h2>
                    <p>Thank you, <strong>${savedOrder.customer.name}</strong>. Your order <strong>#${savedOrder.id}</strong> has been received. Our sales engineer will call you on <strong>${savedOrder.customer.phone}</strong> within 30 minutes to confirm the site location and delivery dispatch time.</p>
                    
                    <div style="background:var(--bg-surface-alt); padding:15px; border-radius:8px; border:1px solid var(--border-color); text-align:left; font-size:0.85rem; margin-bottom:25px;">
                        <strong>Site Delivery Location:</strong><br>
                        ${savedOrder.customer.address}, ${savedOrder.customer.city} - ${savedOrder.customer.pincode}
                    </div>

                    <a href="#/" class="btn-primary w-full" style="display:block;">Return to Homepage</a>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// --------------------------------------------------------------------------
// 5. ADMIN/VENDOR PANELS (WITH FULL CRUD CONTROLS)
// --------------------------------------------------------------------------
function renderAdminView(root, activeTab = 'products') {
    const products = getProducts();
    const orders = getOrders();
    const inquiries = getInquiries();
    const categories = getCategories();

    root.innerHTML = `
        <div class="container animate-fade-in">
            <h2>Vendor & Admin Console</h2>
            <p style="color:var(--text-muted); margin-bottom:30px;">Manage material listings, add or delete products, and view received customer orders & service leads.</p>
            
            <div class="admin-layout">
                <!-- Admin Sidebar Navigation -->
                <aside class="admin-sidebar">
                    <button class="admin-nav-item ${activeTab === 'products' ? 'active' : ''}" id="adm-nav-products">
                        <i data-lucide="boxes"></i>
                        <span>Manage Products</span>
                    </button>
                    <button class="admin-nav-item ${activeTab === 'categories' ? 'active' : ''}" id="adm-nav-categories">
                        <i data-lucide="folder-open"></i>
                        <span>Manage Categories</span>
                    </button>
                    <button class="admin-nav-item ${activeTab === 'units' ? 'active' : ''}" id="adm-nav-units">
                        <i data-lucide="hash"></i>
                        <span>Manage Units</span>
                    </button>
                    <button class="admin-nav-item ${activeTab === 'banners' ? 'active' : ''}" id="adm-nav-banners">
                        <i data-lucide="image"></i>
                        <span>Manage Banners</span>
                    </button>
                    <button class="admin-nav-item ${activeTab === 'orders' ? 'active' : ''}" id="adm-nav-orders">
                        <i data-lucide="shopping-bag"></i>
                        <span>Customer Orders</span>
                    </button>
                    <button class="admin-nav-item ${activeTab === 'leads' ? 'active' : ''}" id="adm-nav-leads">
                        <i data-lucide="file-text"></i>
                        <span>Service Leads</span>
                    </button>
                </aside>

                <!-- Admin Dynamic Sub-pane Container -->
                <div class="admin-content" id="admin-sub-pane">
                    <!-- Loaded dynamically below based on activeTab -->
                </div>
            </div>
        </div>

        <!-- Add/Edit Product Modal Form -->
        <div class="modal-overlay" id="admin-product-modal">
            <div class="modal-card" style="max-width:550px;">
                <div class="modal-header">
                    <h3 id="prod-modal-title">Add New Construction Material</h3>
                    <button class="btn-close-modal" id="btn-close-prod-modal">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <form id="prod-form">
                    <input type="hidden" id="prod-edit-id">
                    <div class="modal-body">
                        <div class="input-group">
                            <label for="prod-name">Product / Material Name</label>
                            <input type="text" id="prod-name" placeholder="e.g. UltraTech PPC Super Cement" required>
                        </div>
                        <div class="form-row">
                            <div class="input-group">
                                <label for="prod-brand">Brand Name</label>
                                <input type="text" id="prod-brand" placeholder="e.g. UltraTech" required>
                            </div>
                            <div class="input-group">
                                <label for="prod-category">Category</label>
                                <select id="prod-category" required>
                                    ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="input-group">
                                <label for="prod-price">Price (INR)</label>
                                <input type="number" id="prod-price" placeholder="420" min="1" required>
                            </div>
                            <div class="input-group">
                                <label for="prod-unit">Unit of Measure</label>
                                <select id="prod-unit">
                                    ${getUnits().map(u => `<option value="${u.id}">${u.name}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="input-group">
                            <label for="prod-desc">Detailed Description</label>
                            <textarea id="prod-desc" rows="3" placeholder="Explain technical benefits, standard ratings, cement grade, compression test results..." required></textarea>
                        </div>
                        <div class="input-group" style="margin-top:12px;">
                            <label>Product Image</label>
                            <div style="display:flex; gap:12px; align-items:center; margin-bottom:8px;">
                                <div id="prod-img-preview-box" style="width:64px; height:64px; border:1px dashed var(--border-color); border-radius:6px; display:flex; align-items:center; justify-content:center; background:var(--bg-surface-alt); overflow:hidden; flex-shrink:0;">
                                    <span style="font-size:0.65rem; color:var(--text-muted);">No Image</span>
                                </div>
                                <div style="flex:1;">
                                    <input type="file" id="prod-image-file" accept="image/*" style="display:none;">
                                    <button type="button" class="btn-secondary" id="btn-upload-prod-img" style="padding: 8px 14px; font-size: 0.8rem; display: inline-flex; align-items:center; gap:6px; cursor:pointer; border:none; height:auto; line-height:1;">
                                        <i data-lucide="upload" style="width:14px; height:14px;"></i> Upload Image
                                    </button>
                                    <span id="prod-image-filename" style="font-size:0.7rem; color:var(--text-muted); display:block; margin-top:4px; max-width:200px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">No file selected</span>
                                </div>
                            </div>
                            <label for="prod-image-url" style="font-size:0.75rem; margin-top:4px; display:block;">Or enter Image URL / Local Path manually</label>
                            <input type="text" id="prod-image-url" placeholder="e.g. assets/my_product.png or https://example.com/image.jpg">
                            <span style="font-size:0.7rem; color:var(--text-muted); display:block; margin-top:2px;">Leave empty to use the default category icon.</span>
                        </div>
                        
                        <!-- Mini dynamic specs layout -->
                        <div style="border:1px solid var(--border-color); padding:10px; border-radius:6px; background:var(--bg-surface-alt); margin-top:15px;">
                            <strong style="font-size:0.8rem; display:block; margin-bottom:8px;">Specifications (Specs Table)</strong>
                            <div class="form-row">
                                <div class="input-group" style="margin-bottom:8px;">
                                    <label style="font-size:0.75rem;">Spec 1: Grade/Class</label>
                                    <input type="text" id="prod-spec-grade" value="Grade A">
                                </div>
                                <div class="input-group" style="margin-bottom:8px;">
                                    <label style="font-size:0.75rem;">Spec 2: Standard/Size</label>
                                    <input type="text" id="prod-spec-size" value="IS Certified">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-cancel" id="btn-cancel-prod-modal">Cancel</button>
                        <button type="submit" class="btn-primary" id="btn-submit-prod">Save Product</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Add/Edit Banner Modal Form -->
        <div class="modal-overlay" id="admin-banner-modal">
            <div class="modal-card" style="max-width:500px;">
                <div class="modal-header">
                    <h3 id="banner-modal-title">Add Carousel Banner</h3>
                    <button class="btn-close-modal" id="btn-close-banner-modal">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <form id="banner-form">
                    <input type="hidden" id="banner-edit-id">
                    <div class="modal-body">
                        <div class="input-group">
                            <label>Banner Image</label>
                            <div style="display:flex; gap:12px; align-items:center; margin-bottom:8px;">
                                <div id="banner-img-preview-box" style="width:120px; height:50px; border:1px dashed var(--border-color); border-radius:6px; display:flex; align-items:center; justify-content:center; background:var(--bg-surface-alt); overflow:hidden; flex-shrink:0;">
                                    <span style="font-size:0.65rem; color:var(--text-muted);">No Preview</span>
                                </div>
                                <div style="flex:1;">
                                    <input type="file" id="banner-image-file" accept="image/*" style="display:none;">
                                    <button type="button" class="btn-secondary" id="btn-upload-banner-img" style="padding: 8px 14px; font-size: 0.8rem; display: inline-flex; align-items:center; gap:6px; cursor:pointer; border:none; height:auto; line-height:1;">
                                        <i data-lucide="upload" style="width:14px; height:14px;"></i> Upload Image
                                    </button>
                                    <span id="banner-image-filename" style="font-size:0.7rem; color:var(--text-muted); display:block; margin-top:4px; max-width:200px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">No file selected</span>
                                </div>
                            </div>
                            <label for="banner-img-path" style="font-size:0.75rem; margin-top:4px; display:block;">Or enter Banner Image URL / Local Path manually</label>
                            <input type="text" id="banner-img-path" placeholder="e.g. assets/banner1.png or https://site.com/image.jpg" required>
                        </div>
                        <div class="input-group">
                            <label for="banner-redirect-link">Click Redirect Link / Hash</label>
                            <input type="text" id="banner-redirect-link" placeholder="e.g. #/products or #/products?category=cement" value="#/products">
                        </div>
                        <div class="form-row">
                            <div class="input-group">
                                <label for="banner-fit-style">Fitting Style</label>
                                <select id="banner-fit-style">
                                    <option value="cover">Full Cover (Scale & Crop)</option>
                                    <option value="dual">Dual-Layer Blur Backdrop</option>
                                    <option value="contain">Fit Inside (Letterbox)</option>
                                    <option value="stretch">Stretch to Fill (100% Width & Height)</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <label for="banner-position">Vertical Position</label>
                                <select id="banner-position">
                                    <option value="center">Center</option>
                                    <option value="top">Top</option>
                                    <option value="bottom">Bottom</option>
                                </select>
                            </div>
                        </div>
                        <div class="input-group">
                            <label for="banner-bg-color">Slide Background Color (Optional)</label>
                            <div style="display:flex; gap:10px; align-items:center;">
                                <input type="color" id="banner-bg-color" value="#ffffff" style="width:40px; height:36px; padding:0; border-radius:4px; border:1px solid var(--border-color); cursor:pointer;">
                                <input type="text" id="banner-bg-color-txt" placeholder="e.g. #ffffff" value="#ffffff" style="flex:1;">
                            </div>
                            <span style="font-size:0.7rem; color:var(--text-muted); display:block; margin-top:2px;">Helpful when using 'Fit Inside' for transparent/centered logos.</span>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-cancel" id="btn-cancel-banner-modal">Cancel</button>
                        <button type="submit" class="btn-primary" id="btn-submit-banner">Save Banner</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const subPane = document.getElementById('admin-sub-pane');

    // ----------------------------------------------------
    // Sub-pane 1: Manage Products Tab (With Edit/Delete)
    // ----------------------------------------------------
    function renderProductsTab() {
        subPane.innerHTML = `
            <div class="admin-pane-header">
                <h3>Product Inventory Management</h3>
                <button class="btn-primary" id="btn-admin-add-prod" style="font-size:0.8rem; padding:8px 16px; display:flex; align-items:center; gap:6px;">
                    <i data-lucide="plus-circle" style="width:16px; height:16px;"></i>
                    Add Product
                </button>
            </div>
            
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Material Name</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(p => `
                            <tr>
                                <td>
                                    <div class="admin-prod-cell">
                                        <div class="admin-prod-img">${p.imageSrc}</div>
                                        <div>
                                            <strong>${p.name}</strong>
                                            <div style="font-size:0.7rem; color:var(--text-muted);">ID: ${p.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style="text-transform: capitalize;">${p.category}</td>
                                <td>${p.brand}</td>
                                <td><strong>₹${p.price}</strong> / ${p.unit}</td>
                                <td>
                                    <div class="admin-actions-cell">
                                        <button class="btn-icon-action edit" data-edit-prod-id="${p.id}" title="Edit Product">
                                            <i data-lucide="edit-3"></i>
                                        </button>
                                        <button class="btn-icon-action delete" data-delete-prod-id="${p.id}" title="Delete Product">
                                            <i data-lucide="trash-2"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Wire product edit/delete hooks
        document.getElementById('btn-admin-add-prod').addEventListener('click', () => {
            showProductModal();
        });

        document.querySelectorAll('[data-edit-prod-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-edit-prod-id');
                showProductModal(id);
            });
        });

        document.querySelectorAll('[data-delete-prod-id]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = btn.getAttribute('data-delete-prod-id');
                if (confirm('Are you sure you want to delete this product listing from the e-commerce store?')) {
                    await deleteProduct(id);
                    if (window.fetchInitialData) await window.fetchInitialData();
                    renderAdminView(root, 'products'); // Refresh View
                }
            });
        });

        if (window.lucide) window.lucide.createIcons();
    }

    // ----------------------------------------------------
    // Sub-pane 2: Customer Orders Tab
    // ----------------------------------------------------
    function renderOrdersTab() {
        if (orders.length === 0) {
            subPane.innerHTML = `
                <div class="admin-pane-header">
                    <h3>Placed Orders</h3>
                </div>
                <div class="no-results">
                    <i data-lucide="shopping-bag" style="width:48px; height:48px;"></i>
                    <h4>No customer orders received yet.</h4>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        subPane.innerHTML = `
            <div class="admin-pane-header">
                <h3>Customer Orders</h3>
            </div>
            
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer & Location</th>
                            <th>Materials Ordered</th>
                            <th>Total Price</th>
                            <th>Date Placed</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.map(o => `
                            <tr>
                                <td><strong>#${o.id}</strong></td>
                                <td>
                                    <div><strong>${o.customer.name}</strong></div>
                                    <div style="font-size:0.75rem; color:var(--text-muted);">${o.customer.phone}</div>
                                    <div style="font-size:0.7rem; color:var(--text-muted); text-overflow:ellipsis; overflow:hidden; max-width:200px; white-space:nowrap;">
                                        ${o.customer.address}, ${o.customer.city}
                                    </div>
                                </td>
                                <td>
                                    <div style="font-size:0.75rem;">
                                        ${o.items.map(item => `<div>• ${item.name} <strong>(x${item.quantity})</strong></div>`).join('')}
                                    </div>
                                </td>
                                <td><strong>₹${o.total.toLocaleString('en-IN', {maximumFractionDigits:0})}</strong></td>
                                <td style="font-size:0.75rem; color:var(--text-muted);">${new Date(o.date).toLocaleDateString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    }

    // ----------------------------------------------------
    // Sub-pane 3: Service Leads Tab
    // ----------------------------------------------------
    function renderLeadsTab() {
        if (inquiries.length === 0) {
            subPane.innerHTML = `
                <div class="admin-pane-header">
                    <h3>Service Leads & Enquiries</h3>
                </div>
                <div class="no-results">
                    <i data-lucide="file-text" style="width:48px; height:48px;"></i>
                    <h4>No custom service quote inquiries received.</h4>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        subPane.innerHTML = `
            <div class="admin-pane-header">
                <h3>Construction Service Inquiries</h3>
            </div>
            
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Inquiry ID</th>
                            <th>Service Requested</th>
                            <th>Contact Info</th>
                            <th>Project details</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${inquiries.map(i => `
                            <tr>
                                <td><strong>#${i.id}</strong></td>
                                <td style="text-transform: capitalize;">
                                    <span class="badge badge-primary">${i.service}</span>
                                </td>
                                <td>
                                    <strong>${i.name}</strong><br>
                                    <span style="font-size:0.75rem; color:var(--text-muted);">${i.phone}</span><br>
                                    <span style="font-size:0.7rem; color:var(--text-muted);">${i.email}</span>
                                </td>
                                <td>
                                    <div style="font-size:0.75rem; max-width:250px;">
                                        <strong>Location:</strong> ${i.location}<br>
                                        <strong>Details:</strong> ${i.details}
                                    </div>
                                </td>
                                <td style="font-size:0.75rem; color:var(--text-muted);">${new Date(i.date).toLocaleDateString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    }

    // ----------------------------------------------------
    // Sub-pane 4: Manage Categories Tab
    // ----------------------------------------------------
    function renderCategoriesTab() {
        const currentCats = getCategories();
        subPane.innerHTML = `
            <div class="admin-pane-header">
                <h3>Manage Product Categories</h3>
                <button class="btn-primary" id="btn-admin-add-cat" style="font-size:0.8rem; padding:8px 16px; display:flex; align-items:center; gap:6px;">
                    <i data-lucide="plus-circle" style="width:16px; height:16px;"></i>
                    Add Category
                </button>
            </div>
            
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Category ID</th>
                            <th>Category Name</th>
                            <th>Icon</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${currentCats.map(c => `
                            <tr>
                                <td><code>${c.id}</code></td>
                                <td><strong>${c.name}</strong></td>
                                <td><i data-lucide="${c.icon || 'boxes'}" style="width:18px; height:18px;"></i> (<code>${c.icon || 'boxes'}</code>)</td>
                                <td>${c.desc || '-'}</td>
                                <td>
                                    <button class="btn-icon-action delete" data-delete-cat-id="${c.id}" title="Delete Category">
                                        <i data-lucide="trash-2"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('btn-admin-add-cat').addEventListener('click', async () => {
            const name = prompt('Enter Category Name (e.g. Sanitaryware):');
            if (name && name.trim() !== '') {
                const desc = prompt('Enter Category Description (optional):');
                const icon = prompt('Enter Lucide Icon name (optional, e.g. bath, wrench, boxes):') || 'boxes';
                const added = await addCategory({ name: name.trim(), desc: desc ? desc.trim() : '', icon: icon.trim() });
                if (added) {
                    if (window.fetchInitialData) await window.fetchInitialData();
                    renderAdminView(root, 'categories');
                } else {
                    alert('Category already exists or name is invalid!');
                }
            }
        });

        document.querySelectorAll('[data-delete-cat-id]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-delete-cat-id');
                if (confirm(`Are you sure you want to delete category "${id}"? Products in this category will remain but the category filter will be removed.`)) {
                    await deleteCategory(id);
                    if (window.fetchInitialData) await window.fetchInitialData();
                    renderAdminView(root, 'categories');
                }
            });
        });

        if (window.lucide) window.lucide.createIcons();
    }

    // ----------------------------------------------------
    // Sub-pane 5: Manage Units Tab
    // ----------------------------------------------------
    function renderUnitsTab() {
        const currentUnits = getUnits();
        subPane.innerHTML = `
            <div class="admin-pane-header">
                <h3>Manage Measurement Units</h3>
                <button class="btn-primary" id="btn-admin-add-unit" style="font-size:0.8rem; padding:8px 16px; display:flex; align-items:center; gap:6px;">
                    <i data-lucide="plus-circle" style="width:16px; height:16px;"></i>
                    Add Unit
                </button>
            </div>
            
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Unit ID</th>
                            <th>Unit Name / Label</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${currentUnits.map(u => `
                            <tr>
                                <td><code>${u.id}</code></td>
                                <td><strong>${u.name}</strong></td>
                                <td>
                                    <button class="btn-icon-action delete" data-delete-unit-id="${u.id}" title="Delete Unit">
                                        <i data-lucide="trash-2"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('btn-admin-add-unit').addEventListener('click', async () => {
            const name = prompt('Enter Unit Name (e.g. Litre (Liquids) or Kg (Hardware)):');
            if (name && name.trim() !== '') {
                const added = await addUnit({ name: name.trim() });
                if (added) {
                    if (window.fetchInitialData) await window.fetchInitialData();
                    renderAdminView(root, 'units');
                } else {
                    alert('Unit already exists or name is invalid!');
                }
            }
        });

        document.querySelectorAll('[data-delete-unit-id]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-delete-unit-id');
                if (confirm(`Are you sure you want to delete unit "${id}"?`)) {
                    await deleteUnit(id);
                    if (window.fetchInitialData) await window.fetchInitialData();
                    renderAdminView(root, 'units');
                }
            });
        });

        if (window.lucide) window.lucide.createIcons();
    }

    // ----------------------------------------------------
    // Sub-pane 6: Manage Banners Tab
    // ----------------------------------------------------
    function renderBannersTab() {
        const currentBanners = getBanners();
        subPane.innerHTML = `
            <div class="admin-pane-header">
                <h3>Manage Carousel Banners</h3>
                <button class="btn-primary" id="btn-admin-add-banner" style="font-size:0.8rem; padding:8px 16px; display:flex; align-items:center; gap:6px;">
                    <i data-lucide="plus-circle" style="width:16px; height:16px;"></i>
                    Add Banner
                </button>
            </div>
            
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Preview</th>
                            <th>Banner Image URL/Path</th>
                            <th>Link (URL/Hash)</th>
                            <th>Fitting Style</th>
                            <th>Bg Color</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${currentBanners.map(b => `
                            <tr>
                                <td>
                                    <div style="width:120px; height:42px; border-radius:4px; overflow:hidden; border:1px solid var(--border-color); position:relative; background:${b.bgColor || 'var(--bg-surface-alt)'};">
                                        ${b.styleType === 'dual' ? `
                                            <div style="background-image: url('${b.imageSrc}'); top:-10%; left:-10%; width:120%; height:120%; filter:blur(4px); opacity:0.45; position:absolute; background-size:cover; background-position:center;"></div>
                                            <div style="background-image: url('${b.imageSrc}'); background-size:contain; background-position:center ${b.position || 'center'}; background-repeat:no-repeat; width:100%; height:100%; position:absolute; z-index:2;"></div>
                                        ` : b.styleType === 'contain' ? `
                                            <div style="background-image: url('${b.imageSrc}'); background-size:contain; background-position:center ${b.position || 'center'}; background-repeat:no-repeat; width:100%; height:100%;"></div>
                                        ` : b.styleType === 'stretch' ? `
                                            <div style="background-image: url('${b.imageSrc}'); background-size:100% 100%; width:100%; height:100%;"></div>
                                        ` : `
                                            <div style="background-image: url('${b.imageSrc}'); background-size:cover; background-position:center ${b.position || 'center'}; width:100%; height:100%;"></div>
                                        `}
                                    </div>
                                </td>
                                <td style="font-size:0.8rem;"><code>${b.imageSrc}</code></td>
                                <td style="font-size:0.8rem;"><code>${b.link}</code></td>
                                <td>
                                    <span class="badge ${
                                        b.styleType === 'dual' ? 'badge-primary' : 
                                        b.styleType === 'contain' ? 'badge-info' : 
                                        b.styleType === 'stretch' ? 'badge-warning' : 'badge-success'
                                    }">
                                        ${
                                            b.styleType === 'dual' ? 'Dual-Layer' : 
                                            b.styleType === 'contain' ? 'Fit Inside' : 
                                            b.styleType === 'stretch' ? 'Stretch' : 'Full Cover'
                                        }
                                    </span>
                                </td>
                                <td><code style="font-size:0.75rem;">${b.bgColor || '#ffffff'}</code></td>
                                <td>
                                    <div class="admin-actions-cell">
                                        <button class="btn-icon-action edit" data-edit-banner-id="${b.id}" title="Edit Banner">
                                            <i data-lucide="edit-3"></i>
                                        </button>
                                        <button class="btn-icon-action delete" data-delete-banner-id="${b.id}" title="Delete Banner">
                                            <i data-lucide="trash-2"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('btn-admin-add-banner').addEventListener('click', () => {
            showBannerModal();
        });

        document.querySelectorAll('[data-edit-banner-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-edit-banner-id');
                showBannerModal(id);
            });
        });

        document.querySelectorAll('[data-delete-banner-id]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-delete-banner-id');
                if (confirm('Are you sure you want to delete this banner?')) {
                    await deleteBanner(id);
                    if (window.fetchInitialData) await window.fetchInitialData();
                    renderAdminView(root, 'banners');
                }
            });
        });

        if (window.lucide) window.lucide.createIcons();
    }

    // Helper: Show Product modal form for create or update
    const modal = document.getElementById('admin-product-modal');
    const form = document.getElementById('prod-form');
    const prodPreviewBox = document.getElementById('prod-img-preview-box');

    function updateProdPreview(src) {
        if (src && src.trim() !== '') {
            prodPreviewBox.innerHTML = `<img src="${src}" style="width:100%; height:100%; object-fit:contain;">`;
        } else {
            prodPreviewBox.innerHTML = `<span style="font-size:0.65rem; color:var(--text-muted);">No Image</span>`;
        }
    }
    
    function showProductModal(editId = null) {
        modal.classList.add('active');
        form.reset();

        document.getElementById('prod-image-file').value = '';
        document.getElementById('prod-image-filename').textContent = 'No file selected';

        const title = document.getElementById('prod-modal-title');
        const editIdEl = document.getElementById('prod-edit-id');

        if (editId) {
            title.textContent = 'Edit Material Details';
            editIdEl.value = editId;

            // Load original product details
            const orig = products.find(p => p.id === editId);
            if (orig) {
                document.getElementById('prod-name').value = orig.name;
                document.getElementById('prod-brand').value = orig.brand;
                document.getElementById('prod-category').value = orig.category;
                document.getElementById('prod-price').value = orig.price;
                document.getElementById('prod-unit').value = orig.unit;
                document.getElementById('prod-desc').value = orig.description;
                document.getElementById('prod-spec-grade').value = orig.specs.Grade || orig.specs.Material || 'Grade A';
                document.getElementById('prod-spec-size').value = orig.specs.Weight || orig.specs.Size || 'Standard';
                
                // Extract src from <img src="..."> if custom, otherwise leave blank
                let imgSrcVal = '';
                if (orig.imageSrc && orig.imageSrc.startsWith('<img')) {
                    const match = orig.imageSrc.match(/src="([^"]+)"/);
                    imgSrcVal = match ? match[1] : orig.imageSrc;
                } else if (orig.imageSrc && !orig.imageSrc.startsWith('<svg')) {
                    imgSrcVal = orig.imageSrc;
                }
                document.getElementById('prod-image-url').value = imgSrcVal;
                updateProdPreview(imgSrcVal);
            }
        } else {
            title.textContent = 'Add New Construction Material';
            editIdEl.value = '';
            document.getElementById('prod-image-url').value = '';
            updateProdPreview('');
        }
    }

    function hideProductModal() {
        modal.classList.remove('active');
    }

    // Modal control listeners
    document.getElementById('btn-close-prod-modal').addEventListener('click', hideProductModal);
    document.getElementById('btn-cancel-prod-modal').addEventListener('click', hideProductModal);

    // Product Image Upload & Preview bindings
    document.getElementById('btn-upload-prod-img').addEventListener('click', () => {
        document.getElementById('prod-image-file').click();
    });

    document.getElementById('prod-image-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            document.getElementById('prod-image-filename').textContent = file.name;
            compressAndReadFile(file, 400, async (dataUrl) => {
                try {
                    const blob = await fetch(dataUrl).then(res => res.blob());
                    const formData = new FormData();
                    formData.append('image', blob, file.name);
                    
                    const res = await axios.post('/api/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    
                    const serverUrl = res.data.url;
                    document.getElementById('prod-image-url').value = serverUrl;
                    updateProdPreview(serverUrl);
                } catch (err) {
                    console.error('Image upload failed', err);
                    // Fallback to Base64 in case server upload fails
                    document.getElementById('prod-image-url').value = dataUrl;
                    updateProdPreview(dataUrl);
                }
            });
        }
    });

    document.getElementById('prod-image-url').addEventListener('input', (e) => {
        updateProdPreview(e.target.value);
    });

    // Save/Update Form submit handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const editId = document.getElementById('prod-edit-id').value;
        const prodData = {
            name: document.getElementById('prod-name').value,
            brand: document.getElementById('prod-brand').value,
            category: document.getElementById('prod-category').value,
            price: parseFloat(document.getElementById('prod-price').value),
            unit: document.getElementById('prod-unit').value,
            description: document.getElementById('prod-desc').value,
            imageSrc: document.getElementById('prod-image-url').value,
            specs: {
                'Grade/Class': document.getElementById('prod-spec-grade').value,
                'Specification': document.getElementById('prod-spec-size').value
            }
        };

        if (editId) {
            await updateProduct(editId, prodData);
        } else {
            await addProduct(prodData);
        }

        if (window.fetchInitialData) await window.fetchInitialData();
        hideProductModal();
        renderAdminView(root, 'products'); // Reload view
    });

    // Helper: Show/Hide Banner modal form for create or update
    const bannerModal = document.getElementById('admin-banner-modal');
    const bannerForm = document.getElementById('banner-form');
    const bannerPreviewBox = document.getElementById('banner-img-preview-box');

    function updateBannerPreview(src) {
        if (src && src.trim() !== '') {
            bannerPreviewBox.innerHTML = `<img src="${src}" style="width:100%; height:100%; object-fit:contain;">`;
        } else {
            bannerPreviewBox.innerHTML = `<span style="font-size:0.65rem; color:var(--text-muted);">No Preview</span>`;
        }
    }
    
    function showBannerModal(editId = null) {
        bannerModal.classList.add('active');
        bannerForm.reset();

        document.getElementById('banner-image-file').value = '';
        document.getElementById('banner-image-filename').textContent = 'No file selected';

        const title = document.getElementById('banner-modal-title');
        const editIdEl = document.getElementById('banner-edit-id');
        const colorInput = document.getElementById('banner-bg-color');
        const colorTxt = document.getElementById('banner-bg-color-txt');

        // Link color input and text input together
        colorInput.oninput = () => { colorTxt.value = colorInput.value; };
        colorTxt.oninput = () => { colorInput.value = colorTxt.value; };

        if (editId) {
            title.textContent = 'Edit Carousel Banner';
            editIdEl.value = editId;

            // Load original banner details
            const orig = getBanners().find(b => b.id === editId);
            if (orig) {
                document.getElementById('banner-img-path').value = orig.imageSrc;
                document.getElementById('banner-redirect-link').value = orig.link || '#/products';
                document.getElementById('banner-fit-style').value = orig.styleType || 'cover';
                document.getElementById('banner-position').value = orig.position || 'center';
                const col = orig.bgColor || '#ffffff';
                colorInput.value = col;
                colorTxt.value = col;
                updateBannerPreview(orig.imageSrc);
            }
        } else {
            title.textContent = 'Add Carousel Banner';
            editIdEl.value = '';
            colorInput.value = '#ffffff';
            colorTxt.value = '#ffffff';
            updateBannerPreview('');
        }
    }

    function hideBannerModal() {
        bannerModal.classList.remove('active');
    }

    // Banner Modal listeners
    document.getElementById('btn-close-banner-modal').addEventListener('click', hideBannerModal);
    document.getElementById('btn-cancel-banner-modal').addEventListener('click', hideBannerModal);

    // Banner Image Upload & Preview bindings
    document.getElementById('btn-upload-banner-img').addEventListener('click', () => {
        document.getElementById('banner-image-file').click();
    });

    document.getElementById('banner-image-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            document.getElementById('banner-image-filename').textContent = file.name;
            compressAndReadFile(file, 1000, async (dataUrl) => {
                try {
                    const blob = await fetch(dataUrl).then(res => res.blob());
                    const formData = new FormData();
                    formData.append('image', blob, file.name);
                    
                    const res = await axios.post('/api/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    
                    const serverUrl = res.data.url;
                    document.getElementById('banner-img-path').value = serverUrl;
                    updateBannerPreview(serverUrl);
                } catch (err) {
                    console.error('Image upload failed', err);
                    // Fallback to Base64 in case server upload fails
                    document.getElementById('banner-img-path').value = dataUrl;
                    updateBannerPreview(dataUrl);
                }
            });
        }
    });

    document.getElementById('banner-img-path').addEventListener('input', (e) => {
        updateBannerPreview(e.target.value);
    });

    bannerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const editId = document.getElementById('banner-edit-id').value;
        const bannerData = {
            imageSrc: document.getElementById('banner-img-path').value.trim(),
            link: document.getElementById('banner-redirect-link').value.trim(),
            styleType: document.getElementById('banner-fit-style').value,
            position: document.getElementById('banner-position').value,
            bgColor: document.getElementById('banner-bg-color-txt').value.trim()
        };

        if (editId) {
            await updateBanner(editId, bannerData);
        } else {
            await addBanner(bannerData);
        }

        if (window.fetchInitialData) await window.fetchInitialData();
        hideBannerModal();
        renderAdminView(root, 'banners'); // Reload view
    });

    // Render initial active tab contents
    if (activeTab === 'products') renderProductsTab();
    else if (activeTab === 'orders') renderOrdersTab();
    else if (activeTab === 'leads') renderLeadsTab();
    else if (activeTab === 'categories') renderCategoriesTab();
    else if (activeTab === 'units') renderUnitsTab();
    else if (activeTab === 'banners') renderBannersTab();

    // Hook tab buttons
    document.getElementById('adm-nav-products').addEventListener('click', () => {
        renderAdminView(root, 'products');
    });
    document.getElementById('adm-nav-categories').addEventListener('click', () => {
        renderAdminView(root, 'categories');
    });
    document.getElementById('adm-nav-units').addEventListener('click', () => {
        renderAdminView(root, 'units');
    });
    document.getElementById('adm-nav-banners').addEventListener('click', () => {
        renderAdminView(root, 'banners');
    });
    document.getElementById('adm-nav-orders').addEventListener('click', () => {
        renderAdminView(root, 'orders');
    });
    document.getElementById('adm-nav-leads').addEventListener('click', () => {
        renderAdminView(root, 'leads');
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}
