// Order System - Advertisement Based
// Replaces shopping cart with direct Facebook ordering

const FACEBOOK_ORDER_LINK = 'https://www.facebook.com/profile.php?id=100064328760462';

// Handle order button click
function handleOrderClick(productName) {
    // Copy product name to clipboard
    copyToClipboard(productName);
    
    // Show success message
    showOrderNotification(`Copied: "${productName}"\n\nOpening Facebook to contact our agent...`);
    
    // Open Facebook link in new tab
    setTimeout(() => {
        window.open(FACEBOOK_ORDER_LINK, '_blank');
    }, 1000);
}

// Copy text to clipboard
function copyToClipboard(text) {
    // Create temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    
    // Select and copy
    textarea.select();
    document.execCommand('copy');
    
    // Remove temporary element
    document.body.removeChild(textarea);
    
    console.log('%c✅ Copied to clipboard:', 'color: green; font-weight: bold;', text);
}

// Show order notification
function showOrderNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'order-notification';
    notification.innerHTML = `
        <div class="alert alert-info alert-dismissible fade show" role="alert" style="
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        ">
            <i class="bi bi-clipboard-check"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        const alert = notification.querySelector('.alert');
        if (alert) {
            alert.remove();
        }
    }, 5000);
}

// Disable cart functionality on page load
document.addEventListener('DOMContentLoaded', function() {
    // Remove cart button click handler
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.style.display = 'none';
    }
    
    // Hide cart count badge
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.style.display = 'none';
    }
    
    console.log('%c🛍️ Advertisement-Based Order System Activated', 'color: blue; font-weight: bold;');
    console.log('%c📱 Orders redirect to Facebook:', 'color: blue;', FACEBOOK_ORDER_LINK);
});
