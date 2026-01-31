// Admin Dashboard JavaScript

let currentEditingProductId = null;
let allProducts = [];

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleAddProduct);
    }

    const editProductForm = document.getElementById('editProductForm');
    if (editProductForm) {
        editProductForm.addEventListener('submit', handleEditProduct);
    }

    const searchProducts = document.getElementById('searchProducts');
    if (searchProducts) {
        searchProducts.addEventListener('input', filterProductsTable);
    }

    const productImage = document.getElementById('productImage');
    if (productImage) {
        productImage.addEventListener('change', updateImagePreview);
    }

    const editProductImage = document.getElementById('editProductImage');
    if (editProductImage) {
        editProductImage.addEventListener('change', updateEditImagePreview);
    }

    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
    }
});

// Handle Admin Login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    // Demo credentials
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUsername', username);
        showDashboard();
    } else {
        alert('Invalid username or password');
    }
}

// Show Dashboard
function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboardScreen').style.display = 'flex';
    document.getElementById('adminName').textContent = localStorage.getItem('adminUsername') || 'Admin';
    
    loadAllProducts();
    updateOverview();
    showSection('overview');
}

// Load all products from products.js
function loadAllProducts() {
    allProducts = getAllProducts();
}

// Update overview stats
function updateOverview() {
    const totalProducts = allProducts.length;
    const inStock = allProducts.filter(p => p.inStock).length;
    const categories = new Set(allProducts.map(p => p.category)).size;
    const totalValue = allProducts.reduce((sum, p) => sum + (p.price * 1), 0);

    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('inStockCount').textContent = inStock;
    document.getElementById('categoryCount').textContent = categories;
    document.getElementById('totalValue').textContent = '$' + totalValue.toFixed(2);
}

// Show specific section
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(el => el.style.display = 'none');
    
    // Remove active class from all menu links
    document.querySelectorAll('.menu-link').forEach(el => el.classList.remove('active'));
    
    // Show selected section
    if (section === 'overview') {
        document.getElementById('overviewSection').style.display = 'block';
        document.querySelector('[data-section="overview"]').classList.add('active');
    } else if (section === 'products') {
        document.getElementById('productsSection').style.display = 'block';
        document.querySelector('[data-section="products"]').classList.add('active');
        loadProductsTable();
    } else if (section === 'addProduct') {
        document.getElementById('addProductSection').style.display = 'block';
        document.querySelector('[data-section="addProduct"]').classList.add('active');
        resetForm();
    }
}

// Load products into table
function loadProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';

    allProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.inStock ? '<span class="badge bg-success">In Stock</span>' : '<span class="badge bg-danger">Out of Stock</span>'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-info" onclick="editProduct('${product.id}')">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="removeProduct('${product.id}')">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Filter products in table
function filterProductsTable() {
    const searchTerm = document.getElementById('searchProducts').value.toLowerCase();
    const tbody = document.getElementById('productsTableBody');
    const rows = tbody.querySelectorAll('tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Handle Add Product
function handleAddProduct(e) {
    e.preventDefault();

    const product = {
        id: 'product-' + Date.now(),
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        originalPrice: parseFloat(document.getElementById('productOriginalPrice').value) || null,
        brand: document.getElementById('productBrand').value || 'Generic',
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value,
        rating: parseFloat(document.getElementById('productRating').value) || 4.5,
        reviews: 0,
        inStock: document.getElementById('productInStock').checked,
        badge: document.getElementById('productBadge').value || null
    };

    // Add product to products.js data structure
    if (!products[product.category]) {
        products[product.category] = [];
    }

    products[product.category].push(product);
    
    // Save to localStorage
    saveProductsToStorage();
    
    // Reload data
    loadAllProducts();
    updateOverview();
    
    alert('Product added successfully!');
    resetForm();
    showSection('products');
    loadProductsTable();
}

// Edit Product
function editProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    currentEditingProductId = productId;

    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductOriginalPrice').value = product.originalPrice || '';
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductImage').value = product.image;
    document.getElementById('editProductInStock').checked = product.inStock;

    if (product.image) {
        const preview = document.getElementById('editImagePreview');
        preview.src = product.image;
        preview.style.display = 'block';
    }

    const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
    modal.show();
}

// Handle Edit Product
function handleEditProduct(e) {
    e.preventDefault();

    if (!currentEditingProductId) return;

    const product = allProducts.find(p => p.id === currentEditingProductId);
    if (!product) return;

    // Update product properties
    product.name = document.getElementById('editProductName').value;
    product.category = document.getElementById('editProductCategory').value;
    product.price = parseFloat(document.getElementById('editProductPrice').value);
    product.originalPrice = parseFloat(document.getElementById('editProductOriginalPrice').value) || null;
    product.description = document.getElementById('editProductDescription').value;
    product.image = document.getElementById('editProductImage').value;
    product.inStock = document.getElementById('editProductInStock').checked;

    // Save to localStorage
    saveProductsToStorage();

    // Close modal and refresh
    const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
    modal.hide();

    alert('Product updated successfully!');
    loadAllProducts();
    updateOverview();
    loadProductsTable();
}

// Delete Product from edit modal
function deleteCurrentProduct() {
    if (!currentEditingProductId) return;

    if (confirm('Are you sure you want to delete this product?')) {
        deleteProductById(currentEditingProductId);
        const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
        modal.hide();
    }
}

// Remove Product (quick delete)
function removeProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        deleteProductById(productId);
    }
}

// Delete Product by ID
function deleteProductById(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    // Remove from products object
    if (products[product.category]) {
        products[product.category] = products[product.category].filter(p => p.id !== productId);
    }

    // Save to localStorage
    saveProductsToStorage();

    // Reload data
    loadAllProducts();
    updateOverview();
    loadProductsTable();

    alert('Product deleted successfully!');
}

// Reset Form
function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('formTitle').textContent = 'Add New Product';
    document.getElementById('submitBtn').textContent = 'Add Product';
    document.getElementById('deleteBtn').style.display = 'none';
    currentEditingProductId = null;
}

// Update image preview
function updateImagePreview() {
    const url = document.getElementById('productImage').value;
    const preview = document.getElementById('imagePreview');
    if (url) {
        preview.src = url;
        preview.style.display = 'block';
        preview.onerror = function() {
            this.style.display = 'none';
            alert('Invalid image URL');
        };
    } else {
        preview.style.display = 'none';
    }
}

// Update edit image preview
function updateEditImagePreview() {
    const url = document.getElementById('editProductImage').value;
    const preview = document.getElementById('editImagePreview');
    if (url) {
        preview.src = url;
        preview.style.display = 'block';
        preview.onerror = function() {
            this.style.display = 'none';
            alert('Invalid image URL');
        };
    } else {
        preview.style.display = 'none';
    }
}

// Save products to localStorage
function saveProductsToStorage() {
    localStorage.setItem('fastTechProducts', JSON.stringify(products));
}

// Load products from localStorage
function loadProductsFromStorage() {
    const stored = localStorage.getItem('fastTechProducts');
    if (stored) {
        Object.assign(products, JSON.parse(stored));
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUsername');
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('dashboardScreen').style.display = 'none';
        document.getElementById('loginForm').reset();
        currentEditingProductId = null;
    }
}

// Load saved products on page load
window.addEventListener('load', function() {
    loadProductsFromStorage();
});
