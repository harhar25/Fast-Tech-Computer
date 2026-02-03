// Main JavaScript for TechHub Computer Parts Store

// Firebase integration
let firebaseDB, firebaseRef, firebaseGet;

// 🔍 DIAGNOSTIC - Log when main.js loads
console.log('%c🚀 main.js LOADED', 'color: green; font-weight: bold; font-size: 14px;');

// Initialize Firebase for main website
document.addEventListener('DOMContentLoaded', async function() {
    console.log('%c📄 DOMContentLoaded event fired in main.js', 'color: blue; font-weight: bold;');
    
    // Show loading state initially
    showLoadingState();
    
    // Load Firebase SDK
    try {
        console.log('%c🔄 Starting Firebase initialization...', 'color: orange; font-weight: bold;');
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js");
        const { getDatabase, ref, get } = await import("https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js");
        
        // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyDhy1IWM62djijn4vRUNmfYFTA3tGPY5tU",
            authDomain: "fast-tech-computer.firebaseapp.com",
            databaseURL: "https://fast-tech-computer-default-rtdb.firebaseio.com",
            projectId: "fast-tech-computer",
            storageBucket: "fast-tech-computer.firebasestorage.app",
            messagingSenderId: "503689724923",
            appId: "1:503689724923:web:0c6196cdffc88905dc415e"
        };
        
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        firebaseDB = getDatabase(app);
        firebaseRef = ref;
        firebaseGet = get;
        
        console.log('%c✅ Firebase initialized for main website', 'color: green; font-weight: bold;');
        console.log('Firebase DB instance:', firebaseDB);
        
        // Load products from Firebase first, then display
        console.log('%c🔄 Calling loadProductsFromFirebase()...', 'color: blue;');
        await loadProductsFromFirebase();
        
        console.log('%c✅ loadProductsFromFirebase() completed', 'color: green;');
        
        // Now load featured and deal products from Firebase data
        console.log('%c📌 Loading featured products...', 'color: blue;');
        loadFeaturedProducts();
        
        console.log('%c💰 Loading deal products...', 'color: blue;');
        loadDealProducts();
        
    } catch (error) {
        console.error('%c❌ Error initializing Firebase:', 'color: red; font-weight: bold;', error);
        showEmptyState();
    }
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Add scroll animations
    initializeScrollAnimations();
    
    // Make Products nav act as direct link on small screens
    initializeNavBehavior();
});

// Make the Products dropdown behave as a direct link on small screens (mobile)
function initializeNavBehavior() {
    try {
        const productsToggle = document.querySelector('.nav-link.dropdown-toggle');
        if (!productsToggle) return;

        // Use a data-href attribute to point to the products page
        productsToggle.setAttribute('data-href', 'products.html');

        productsToggle.addEventListener('click', function (e) {
            const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

            // If the navbar is collapsed / small screen, navigate instead of toggling
            // Bootstrap's lg breakpoint is 992px; treat anything below as mobile/tablet
            if (viewportWidth < 992) {
                // Prevent Bootstrap dropdown toggle from interfering
                e.preventDefault();
                // Close the navbar collapse if open (improves UX)
                const navbarCollapse = document.getElementById('navbarNav');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
                // Navigate to products page
                const href = productsToggle.getAttribute('data-href') || 'products.html';
                window.location.href = href;
            }
            // On larger screens do nothing special (allow dropdown)
        });
    } catch (err) {
        console.error('Error initializing nav behavior', err);
    }
}

// Show loading state while Firebase loads
function showLoadingState() {
    const featuredContainer = document.getElementById('featuredProducts');
    const dealContainer = document.getElementById('dealProducts');
    
    if (featuredContainer) {
        featuredContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">Loading products from database...</p>
            </div>
        `;
    }
    
    if (dealContainer) {
        dealContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">Loading deals from database...</p>
            </div>
        `;
    }
}

// Show empty state when no products exist
function showEmptyState() {
    const featuredContainer = document.getElementById('featuredProducts');
    const dealContainer = document.getElementById('dealProducts');
    
    if (featuredContainer) {
        featuredContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-box display-1 text-muted mb-3"></i>
                <h4>No Products Available</h4>
                <p class="text-muted">Products will appear here once added by the administrator</p>
            </div>
        `;
    }
    
    if (dealContainer) {
        dealContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-tag display-1 text-muted mb-3"></i>
                <h4>No Deals Available</h4>
                <p class="text-muted">Special deals will appear here once added by the administrator</p>
            </div>
        `;
    }
}

// Load products from Firebase
async function loadProductsFromFirebase() {
    try {
        if (!firebaseDB || !firebaseRef || !firebaseGet) {
            console.error('❌ Firebase not initialized');
            console.log('Firebase not available, using empty product list');
            showEmptyState();
            return;
        }
        
        console.log('🔄 Attempting to load products from Firebase...');
        const productsRef = firebaseRef(firebaseDB, 'products');
        const snapshot = await firebaseGet(productsRef);
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log('✅ Firebase snapshot received:', data);
            
            // Update the local products array from Firebase
            updateProductsFromFirebase(data);
            
            const allProducts = getAllProducts();
            console.log('✅ Products loaded from Firebase:', allProducts.length);
            console.log('📋 All products:', allProducts);
            
            if (allProducts.length === 0) {
                console.warn('⚠️ No products in Firebase');
                showEmptyState();
            }
        } else {
            console.log('⚠️ No products found in Firebase (snapshot does not exist)');
            showEmptyState();
        }
    } catch (error) {
        console.error('❌ Error loading products from Firebase:', error);
        showEmptyState();
    }
}

// Load featured products
function loadFeaturedProducts() {
    console.log('=== LOADING FEATURED PRODUCTS ===');
    const container = document.getElementById('featuredProducts');
    if (!container) {
        console.log('❌ featuredProducts container not found');
        return;
    }
    
    console.log('✅ featuredProducts container found:', container);
    
    // Get products from Firebase data
    const allProducts = getAllProducts();
    console.log('📦 All products available:', allProducts.length);
    console.log('📋 All products data:', allProducts);
    
    // If no products, show empty state
    if (allProducts.length === 0) {
        console.log('❌ No products found in Firebase data');
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-box display-1 text-muted mb-3"></i>
                <h4>No Featured Products</h4>
                <p class="text-muted">Featured products will appear here once added by the administrator</p>
            </div>
        `;
        container.style.display = 'block';
        return;
    }
    
    // Filter for featured products (products with badge "new", "hot", or no badge)
    const featuredProducts = allProducts.filter(product => {
        console.log(`🔍 Checking product: ${product.name}, badge: ${product.badge}`);
        return !product.badge || product.badge === 'new' || product.badge === 'hot';
    }).slice(0, 8);
    
    console.log('⭐ Featured products found:', featuredProducts.length);
    console.log('⭐ Featured products data:', featuredProducts);
    
    if (featuredProducts.length === 0) {
        console.log('❌ No featured products, showing empty state');
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-box display-1 text-muted mb-3"></i>
                <h4>No Featured Products</h4>
                <p class="text-muted">Featured products will appear here once added by the administrator</p>
            </div>
        `;
    } else {
        console.log('✅ Creating product cards for featured products');
        container.innerHTML = featuredProducts.map(product => {
            console.log('🎨 Creating card for:', product.name);
            return createProductCard(product);
        }).join('');
        console.log('✅ Featured products displayed');
        
        // Load real reviews for each product card
        loadReviewsForProducts(featuredProducts);
    }
    
    // Ensure container is visible
    container.style.display = 'block';
    container.style.visibility = 'visible';
}

// Load deal products
function loadDealProducts() {
    console.log('=== LOADING DEAL PRODUCTS ===');
    const container = document.getElementById('dealProducts');
    if (!container) {
        console.log('❌ dealProducts container not found');
        return;
    }
    if (!container) return;
    
    // Get products from Firebase data
    const allProducts = getAllProducts();
    
    // Filter for products with sale badge or original price (indicating discount)
    const dealProducts = allProducts.filter(product => 
        product.badge === 'sale' || product.originalPrice
    ).slice(0, 4);
    
    if (dealProducts.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-tag display-1 text-muted mb-3"></i>
                <h4>No Deals Available</h4>
                <p class="text-muted">Special deals will appear here once added by the administrator</p>
            </div>
        `;
    } else {
        container.innerHTML = dealProducts.map(product => createProductCard(product)).join('');
        
        // Load real reviews for each product card
        loadReviewsForProducts(dealProducts);
    }
}

// Load real reviews from Firebase for all displayed products
async function loadReviewsForProducts(products) {
    for (const product of products) {
        loadProductReviews(product.id);
    }
}

// Load reviews for a single product and update the card
async function loadProductReviews(productId) {
    try {
        if (!firebaseDB || !firebaseRef || !firebaseGet) {
            console.log('Firebase not available for reviews');
            return;
        }
        
        const reviewsRef = firebaseRef(firebaseDB, `reviews/${productId}`);
        const snapshot = await firebaseGet(reviewsRef);
        
        if (snapshot.exists()) {
            const reviewsData = snapshot.val();
            const reviews = Array.isArray(reviewsData) ? reviewsData : Object.values(reviewsData);
            const validReviews = reviews.filter(r => r && typeof r === 'object');
            
            if (validReviews.length > 0) {
                // Calculate average rating
                const averageRating = (validReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / validReviews.length).toFixed(1);
                
                // Update product card with real reviews
                const ratingElement = document.getElementById(`rating-${productId}`);
                const reviewCountElement = document.getElementById(`review-count-${productId}`);
                
                if (ratingElement && reviewCountElement) {
                    ratingElement.innerHTML = createRatingStars(averageRating);
                    reviewCountElement.textContent = `(${validReviews.length})`;
                    
                    console.log(`✅ Updated reviews for product ${productId}: ${averageRating} stars from ${validReviews.length} reviews`);
                }
            }
        }
    } catch (error) {
        console.error(`Error loading reviews for product ${productId}:`, error);
    }
}

// Create product card HTML
function createProductCard(product) {
    const badgeHtml = product.badge ? 
        `<span class="product-badge badge-${product.badge}">${product.badge.toUpperCase()}</span>` : '';
    
    const originalPriceHtml = product.originalPrice ? 
        `<span class="price-original">${formatPrice(product.originalPrice)}</span>` : '';
    
    const ratingHtml = createRatingStars(product.rating);
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <a href="product.html?id=${product.id}" style="text-decoration: none; color: inherit;">
                    <img src="${product.image}" alt="${product.name}" style="cursor: pointer;">
                </a>
                ${badgeHtml}
                <div class="product-quick-actions">
                    <button class="quick-action-btn" onclick="handleOrderClick('${product.name}')" title="Make an Order for this Item">
                        <i class="bi bi-facebook"></i>
                    </button>
                    <button class="quick-action-btn" onclick="window.location.href='product.html?id=${product.id}'" title="View Details">
                        <i class="bi bi-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-body">
                <div class="product-category">${product.category.replace('-', ' ')}</div>
                <h5 class="product-title">${product.name}</h5>
                <p class="product-description">${product.description}</p>
                <div class="product-rating" id="rating-${product.id}">
                    ${ratingHtml}
                    <span class="rating-count" id="review-count-${product.id}">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="price-current">${formatPrice(product.price)}</span>
                    ${originalPriceHtml}
                </div>
                <div class="product-actions">
                    <a href="product.html?id=${product.id}" class="btn-product btn-view">
                        <i class="bi bi-eye"></i> View
                    </a>
                    <button class="btn-product btn-cart" onclick="handleOrderClick('${product.name}')" data-product-id="${product.id}">
                        <i class="bi bi-facebook"></i> Make an Order
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Create rating stars
function createRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="bi bi-star-fill star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="bi bi-star-half star"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="bi bi-star star empty"></i>';
    }
    
    return stars;
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            hideSearchResults();
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
    
    // Hide search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            hideSearchResults();
        }
    });
}

// Perform search
function performSearch(query) {
    const results = searchProducts(query);
    displaySearchResults(results, query);
}

// Display search results
function displaySearchResults(results, query) {
    const searchResults = document.querySelector('.search-results');
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-result-item">
                <p class="text-muted mb-0">No products found for "${query}"</p>
            </div>
        `;
    } else {
        searchResults.innerHTML = results.slice(0, 5).map(product => `
            <div class="search-result-item" onclick="window.location.href='product.html?id=${product.id}'">
                <div class="d-flex align-items-center">
                    <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 1rem;">
                    <div>
                        <h6 class="mb-0">${product.name}</h6>
                        <small class="text-muted">${product.category} - ${formatPrice(product.price)}</small>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    searchResults.style.display = 'block';
}

// Hide search results
function hideSearchResults() {
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Add stagger animation to children
                const staggerElements = entry.target.querySelectorAll('.stagger-animation > *');
                staggerElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('animated');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Observe section headers
    document.querySelectorAll('.section-header').forEach(el => {
        observer.observe(el);
    });

    // Observe category cards
    document.querySelectorAll('.category-card').forEach(el => {
        observer.observe(el);
    });

    // Observe product cards
    document.querySelectorAll('.product-card').forEach(el => {
        observer.observe(el);
    });
}

// Add particle effects to hero section
function createParticleEffect() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (8 + Math.random() * 4) + 's';
        
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
        particle.style.borderRadius = '50%';
        
        heroSection.appendChild(particle);
    }
}

// Enhanced smooth scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add hover effects with animation
function addHoverEffects() {
    // Enhanced button hover effects
    document.querySelectorAll('.btn-hero').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Enhanced card hover effects
    document.querySelectorAll('.category-card, .product-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', function() {
    initializeScrollAnimations();
    initializeSmoothScrolling();
    addHoverEffects();
});

// Newsletter subscription
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    const newsletterEmail = document.getElementById('newsletterEmail');
    
    if (newsletterForm && newsletterEmail) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = newsletterEmail.value.trim();
            
            if (!email) {
                showNotification('Please enter your email address', 'warning');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'warning');
                return;
            }
            
            // Show loading state
            const subscribeBtn = newsletterForm.querySelector('button');
            const originalText = subscribeBtn.innerHTML;
            subscribeBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Subscribing...';
            subscribeBtn.disabled = true;
            
            // Simulate newsletter subscription (in real app, this would call an API)
            setTimeout(() => {
                // Store subscription in localStorage for demo purposes
                const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
                if (!subscriptions.includes(email)) {
                    subscriptions.push(email);
                    localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
                }
                
                // Show success message
                showNotification('Successfully subscribed to our newsletter! Check your email for confirmation.', 'success');
                
                // Reset form
                newsletterEmail.value = '';
                subscribeBtn.innerHTML = originalText;
                subscribeBtn.disabled = false;
                
                console.log('Newsletter subscription:', email);
            }, 1500);
        });
        
        // Also handle button click
        const subscribeBtn = newsletterForm.querySelector('button');
        if (subscribeBtn) {
            subscribeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                newsletterForm.dispatchEvent(new Event('submit'));
            });
        }
    }
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Handle manual close
    notification.querySelector('.btn-close').addEventListener('click', function() {
        notification.remove();
    });
}

// Category card hover effects
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add search results container to search input
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container position-relative';
        searchInput.parentNode.insertBefore(searchContainer, searchInput);
        searchContainer.appendChild(searchInput);
        
        const searchResults = document.createElement('div');
        searchResults.className = 'search-results';
        searchContainer.appendChild(searchResults);
    }
});

// Mobile menu handling
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking on links
        navbarCollapse.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navbarCollapse.classList.remove('show');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
                navbarCollapse.classList.remove('show');
            }
        });
    }
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Performance optimization: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to search
const debouncedSearch = debounce(performSearch, 300);