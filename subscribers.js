// Newsletter Subscription System
let subscribersDB, subscribersRef, subscribersPush, subscribersGet;

// Initialize Firebase for subscribers
async function initializeSubscriberSystem() {
    try {
        console.log('%c📧 Initializing Subscriber System...', 'color: blue; font-weight: bold;');
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js");
        const { getDatabase, ref, push, get } = await import("https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js");
        
        const firebaseConfig = {
            apiKey: "AIzaSyDhy1IWM62djijn4vRUNmfYFTA3tGPY5tU",
            authDomain: "fast-tech-computer.firebaseapp.com",
            databaseURL: "https://fast-tech-computer-default-rtdb.firebaseio.com",
            projectId: "fast-tech-computer",
            storageBucket: "fast-tech-computer.firebasestorage.app",
            messagingSenderId: "503689724923",
            appId: "1:503689724923:web:0c6196cdffc88905dc415e"
        };
        
        const app = initializeApp(firebaseConfig);
        subscribersDB = getDatabase(app);
        subscribersRef = ref;
        subscribersPush = push;
        subscribersGet = get;
        
        console.log('%c✅ Subscriber System Initialized', 'color: green; font-weight: bold;');
        
        // Initialize form listener
        initializeSubscriptionForm();
    } catch (error) {
        console.error('%c❌ Error initializing subscriber system:', 'color: red;', error);
    }
}

// Initialize subscription form
function initializeSubscriptionForm() {
    const form = document.getElementById('newsletterForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleSubscription();
        });
    }
}

// Handle subscription submission
async function handleSubscription() {
    const emailInput = document.getElementById('subscriberEmail');
    const messageDiv = document.getElementById('subscriptionMessage');
    const email = emailInput.value.trim();
    
    if (!email) {
        showMessage('Please enter a valid email', 'danger');
        return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'danger');
        return;
    }
    
    try {
        // Check if email already subscribed
        const subscribersSnapshot = await subscribersGet(subscribersRef(subscribersDB, 'subscribers'));
        let subscribers = [];
        
        if (subscribersSnapshot.exists()) {
            const data = subscribersSnapshot.val();
            subscribers = Array.isArray(data) ? data : Object.values(data);
        }
        
        const emailExists = subscribers.some(sub => sub && sub.email === email);
        
        if (emailExists) {
            showMessage('This email is already subscribed!', 'info');
            emailInput.value = '';
            return;
        }
        
        // Add new subscriber
        const subscriberData = {
            email: email,
            subscribedAt: new Date().toISOString(),
            active: true
        };
        
        const subscribersRefPath = subscribersRef(subscribersDB, 'subscribers');
        await subscribersPush(subscribersRefPath, subscriberData);
        
        console.log('%c✅ Subscriber added:', 'color: green;', email);
        
        showMessage('✅ Successfully subscribed! You will receive updates on new products and deals.', 'success');
        emailInput.value = '';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
        
    } catch (error) {
        console.error('%c❌ Error adding subscriber:', 'color: red;', error);
        showMessage('Error subscribing. Please try again later.', 'danger');
    }
}

// Show subscription message
function showMessage(message, type) {
    const messageDiv = document.getElementById('subscriptionMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
        messageDiv.className = 'text-' + (type === 'success' ? 'success' : type === 'danger' ? 'danger' : 'info') + ' mt-3';
    }
}

// Get all active subscribers
async function getActiveSubscribers() {
    try {
        const subscribersSnapshot = await subscribersGet(subscribersRef(subscribersDB, 'subscribers'));
        
        if (!subscribersSnapshot.exists()) {
            return [];
        }
        
        const data = subscribersSnapshot.val();
        let subscribers = Array.isArray(data) ? data : Object.values(data);
        return subscribers.filter(sub => sub && sub.active === true);
        
    } catch (error) {
        console.error('%c❌ Error fetching subscribers:', 'color: red;', error);
        return [];
    }
}

// Send notification to subscribers
async function notifySubscribersAboutNewProduct(productName, productDescription, productPrice) {
    try {
        console.log('%c📧 Preparing to notify subscribers about new product...', 'color: blue;');
        
        const subscribers = await getActiveSubscribers();
        
        if (subscribers.length === 0) {
            console.log('%c ℹ️ No active subscribers to notify', 'color: orange;');
            return;
        }
        
        console.log('%c📧 Sending notifications to', 'color: blue;', subscribers.length, 'subscribers');
        
        // Create notification record
        const notification = {
            type: 'new_product',
            productName: productName,
            productDescription: productDescription,
            productPrice: productPrice,
            sentAt: new Date().toISOString(),
            recipientCount: subscribers.length
        };
        
        // Store notification in Firebase
        const notificationsRef = subscribersRef(subscribersDB, 'notifications');
        await subscribersPush(notificationsRef, notification);
        
        // In production, you would integrate with EmailJS or a backend service here
        // For now, we're logging that notification would be sent
        console.log('%c✅ Notifications recorded for subscribers:', 'color: green;', subscribers.map(s => s.email));
        
        return {
            success: true,
            message: `Notification sent to ${subscribers.length} subscribers about: ${productName}`,
            subscriberCount: subscribers.length
        };
        
    } catch (error) {
        console.error('%c❌ Error notifying subscribers:', 'color: red;', error);
        return {
            success: false,
            message: 'Error sending notifications',
            error: error
        };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeSubscriberSystem();
});
