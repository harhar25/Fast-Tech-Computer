// Main JavaScript for TechHub Computer Parts Store

// Firebase integration
let firebaseDB, firebaseRef, firebaseGet;

// Initialize Firebase for main website
document.addEventListener('DOMContentLoaded', async function() {
    // Show loading state initially
    showLoadingState();
    
    // Load Firebase SDK
    try {
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
        
        console.log('Firebase initialized for main website');
        
        // Load products from Firebase first, then display
        await loadProductsFromFirebase();
        
        // Now load featured and deal products from Firebase data
        loadFeaturedProducts();
        loadDealProducts();
        
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        showEmptyState();
    }
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Add scroll animations
    initializeScrollAnimations();
});

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
                <p class="text-muted">Add products through the admin panel to see them here</p>
                <a href="admin.html" class="btn btn-primary">
                    <i class="bi bi-plus-circle"></i> Add Products
                </a>
            </div>
        `;
    }
    
    if (dealContainer) {
        dealContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-tag display-1 text-muted mb-3"></i>
                <h4>No Deals Available</h4>
                <p class="text-muted">Add products with sale prices through the admin panel</p>
                <a href="admin.html" class="btn btn-primary">
                    <i class="bi bi-plus-circle"></i> Add Products
                </a>
            </div>
        `;
    }
}

// Load products from Firebase
async function loadProductsFromFirebase() {
    try {
        if (!firebaseDB || !firebaseRef || !firebaseGet) {
            console.log('Firebase not available, using empty product list');
            return;
        }
        
        const productsRef = firebaseRef(firebaseDB, 'products');
        const snapshot = await firebaseGet(productsRef);
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            updateProductsFromFirebase(data);
            console.log('Products loaded from Firebase:', getAllProducts().length);
        } else {
            console.log('No products found in Firebase');
            showEmptyState();
        }
    } catch (error) {
        console.error('Error loading products from Firebase:', error);
    }
}

// Load featured products
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const featuredProducts = getFeaturedProducts(8);
    
    container.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

// Load deal products
function loadDealProducts() {
    const container = document.getElementById('dealProducts');
    if (!container) return;
    
    const dealProducts = getDealProducts(4);
    
    container.innerHTML = dealProducts.map(product => createProductCard(product)).join('');
}

// Create product card HTML
function createProductCard(product) {
    const badgeHtml = product.badge ? 
        `<span class="product-badge badge-${product.badge}">${product.badge.toUpperCase()}</span>` : '';
    
    const originalPriceHtml = product.originalPrice ? 
        `<span class="price-original">${formatPrice(product.originalPrice)}</span>` : '';
    
    const ratingHtml = createRatingStars(product.rating);
    
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${badgeHtml}
                <div class="product-quick-actions">
                    <button class="quick-action-btn" onclick="addToCart('${product.id}')" title="Add to Cart">
                        <i class="bi bi-cart-plus"></i>
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
                <div class="product-rating">
                    ${ratingHtml}
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="price-current">${formatPrice(product.price)}</span>
                    ${originalPriceHtml}
                </div>
                <div class="product-actions">
                    <a href="product.html?id=${product.id}" class="btn-product btn-view">
                        <i class="bi bi-eye"></i> View
                    </a>
                    <button class="btn-product btn-cart add-to-cart-btn" data-product-id="${product.id}">
                        <i class="bi bi-cart-plus"></i> Add
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

// Initialize smooth scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

// Initialize scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
            }
        });
    }, observerOptions);
    
    // Observe product cards and category cards
    document.querySelectorAll('.product-card, .category-card').forEach(card => {
        observer.observe(card);
    });
}

// Newsletter subscription
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('input[type="email"]').parentElement;
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                cart.showNotification('Successfully subscribed to newsletter!', 'success');
                this.querySelector('input[type="email"]').value = '';
            }
        });
    }
});

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
