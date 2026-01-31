// Admin Dashboard JavaScript
let currentProducts = [];
let editModal;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadProducts();
    initializeEventListeners();
    updateDashboardStats();
    editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
});

// Check authentication
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true' || 
                      localStorage.getItem('adminLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Display admin username
    const username = sessionStorage.getItem('adminUsername') || localStorage.getItem('adminUsername') || 'Admin';
    document.getElementById('adminUser').textContent = `Welcome, ${username}`;
}

// Initialize event listeners
function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.sidebar .nav-link[data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            showSection(section);
            
            // Update active state
            document.querySelectorAll('.sidebar .nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Product search
    document.getElementById('productSearch').addEventListener('input', function() {
        filterProducts(this.value);
    });

    // Add product form
    document.getElementById('addProductForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addProduct();
    });

    // Edit product form
    document.getElementById('editProductForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateProduct();
    });
}

// Show section
function showSection(section) {
    document.querySelectorAll('.content-section').forEach(s => {
        s.style.display = 'none';
    });
    
    const sectionMap = {
        'dashboard': 'dashboardSection',
        'products': 'productsSection',
        'add-product': 'addProductSection'
    };
    
    const sectionId = sectionMap[section];
    if (sectionId) {
        document.getElementById(sectionId).style.display = 'block';
    }
}

// Load products from products.js
function loadProducts() {
    currentProducts = getAllProducts();
    displayProducts();
    updateDashboardStats();
}

// Display products in the products section
function displayProducts(products = currentProducts) {
    const container = document.getElementById('productsList');
    
    if (products.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No products found</p>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </div>
                <div class="col-md-6">
                    <h6 class="mb-1">${product.name}</h6>
                    <p class="text-muted mb-1 small">${product.description}</p>
                    <span class="badge bg-secondary badge-category">${product.category}</span>
                    <span class="badge bg-info badge-category">${product.brand}</span>
                    ${product.badge ? `<span class="badge bg-warning badge-category">${product.badge}</span>` : ''}
                </div>
                <div class="col-md-2">
                    <div class="text-end">
                        <h6 class="mb-0">$${product.price}</h6>
                        ${product.originalPrice ? `<small class="text-muted"><del>$${product.originalPrice}</del></small>` : ''}
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="text-end">
                        <button class="btn btn-sm btn-outline-primary btn-action" onclick="editProduct('${product.id}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger btn-action" onclick="deleteProduct('${product.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter products
function filterProducts(searchTerm) {
    const filtered = currentProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displayProducts(filtered);
}

// Update dashboard statistics
function updateDashboardStats() {
    document.getElementById('totalProducts').textContent = currentProducts.length;
    
    const categories = [...new Set(currentProducts.map(p => p.category))];
    document.getElementById('totalCategories').textContent = categories.length;
    
    const inStock = currentProducts.filter(p => p.inStock !== false).length;
    document.getElementById('inStockProducts').textContent = inStock;
    
    const onSale = currentProducts.filter(p => p.originalPrice && p.originalPrice > p.price).length;
    document.getElementById('onSaleProducts').textContent = onSale;
    
    // Display recent products
    const recentProducts = currentProducts.slice(-5).reverse();
    const recentContainer = document.getElementById('recentProducts');
    recentContainer.innerHTML = recentProducts.map(product => `
        <div class="d-flex justify-content-between align-items-center border-bottom py-2">
            <div>
                <h6 class="mb-0">${product.name}</h6>
                <small class="text-muted">${product.brand} - ${product.category}</small>
            </div>
            <div class="text-end">
                <strong>$${product.price}</strong>
                ${product.badge ? `<span class="badge bg-warning ms-2">${product.badge}</span>` : ''}
            </div>
        </div>
    `).join('');
}

// Show add product modal
function showAddProductModal() {
    showSection('add-product');
}

// Add new product
function addProduct() {
    const newProduct = {
        id: 'prod-' + Date.now(),
        name: document.getElementById('newProductName').value,
        brand: document.getElementById('newProductBrand').value,
        category: document.getElementById('newProductCategory').value,
        price: parseFloat(document.getElementById('newProductPrice').value),
        description: document.getElementById('newProductDescription').value,
        image: document.getElementById('newProductImage').value || 'https://via.placeholder.com/300x300/cccccc/ffffff?text=No+Image',
        originalPrice: document.getElementById('newProductOriginalPrice').value ? parseFloat(document.getElementById('newProductOriginalPrice').value) : null,
        badge: document.getElementById('newProductBadge').value,
        inStock: true,
        rating: 4.5,
        reviews: 0,
        specs: {}
    };
    
    // Add to the appropriate category in the products object
    if (!products[newProduct.category]) {
        products[newProduct.category] = [];
    }
    products[newProduct.category].push(newProduct);
    
    // Reload and show success message
    loadProducts();
    showSection('products');
    
    // Reset form
    document.getElementById('addProductForm').reset();
    
    // Show success alert
    showAlert('Product added successfully!', 'success');
}

// Edit product
function editProduct(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Populate form
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductBrand').value = product.brand;
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductImage').value = product.image;
    document.getElementById('editProductOriginalPrice').value = product.originalPrice || '';
    document.getElementById('editProductBadge').value = product.badge || '';
    document.getElementById('editProductInStock').value = product.inStock !== false ? 'true' : 'false';
    
    // Show modal
    editModal.show();
}

// Update product
function updateProduct() {
    const productId = document.getElementById('editProductId').value;
    const productIndex = currentProducts.findIndex(p => p.id === productId);
    
    if (productIndex === -1) return;
    
    const updatedProduct = {
        ...currentProducts[productIndex],
        name: document.getElementById('editProductName').value,
        brand: document.getElementById('editProductBrand').value,
        category: document.getElementById('editProductCategory').value,
        price: parseFloat(document.getElementById('editProductPrice').value),
        description: document.getElementById('editProductDescription').value,
        image: document.getElementById('editProductImage').value,
        originalPrice: document.getElementById('editProductOriginalPrice').value ? parseFloat(document.getElementById('editProductOriginalPrice').value) : null,
        badge: document.getElementById('editProductBadge').value,
        inStock: document.getElementById('editProductInStock').value === 'true'
    };
    
    // Update in the products object
    const categoryProducts = products[updatedProduct.category];
    const categoryIndex = categoryProducts.findIndex(p => p.id === productId);
    if (categoryIndex !== -1) {
        categoryProducts[categoryIndex] = updatedProduct;
    }
    
    // Reload and close modal
    loadProducts();
    editModal.hide();
    
    showAlert('Product updated successfully!', 'success');
}

// Delete product
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const product = currentProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Remove from the products object
    const categoryProducts = products[product.category];
    const categoryIndex = categoryProducts.findIndex(p => p.id === productId);
    if (categoryIndex !== -1) {
        categoryProducts.splice(categoryIndex, 1);
    }
    
    // Reload
    loadProducts();
    
    showAlert('Product deleted successfully!', 'success');
}

// Show alert
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 3000);
}

// Refresh data
function refreshData() {
    loadProducts();
    showAlert('Data refreshed!', 'info');
}

// Logout
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUsername');
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    
    window.location.href = 'admin-login.html';
}
