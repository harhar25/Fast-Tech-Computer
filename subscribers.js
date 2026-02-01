// Helper function to send email with EmailJS
async function sendEmailWithRetry(serviceId, templateId, templateParams, email) {
    try {
        // Check if EmailJS is available
        if (typeof emailjs === 'undefined') {
            console.warn('%c⚠️ EmailJS not available yet, waiting...', 'color: orange;');
            // Wait for emailjs to become available
            let attempts = 0;
            while (typeof emailjs === 'undefined' && attempts < 30) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS failed to load');
            }
        }
        
        // Now send the email
        const response = await emailjs.send(serviceId, templateId, templateParams);
        console.log('%c✉️ Email sent to:', 'color: green;', email, 'Response:', response);
        return true;
    } catch (error) {
        console.warn('%c⚠️ Failed to send email to', 'color: orange;', email, error);
        return false;
    }
}

// Newsletter Subscription System
let subscribersDB, subscribersRef, subscribersPush, subscribersGet;

// Initialize EmailJS
function initializeEmailJS() {
    try {
        const tryInitialize = () => {
            if (typeof emailjs !== 'undefined') {
                try {
                    emailjs.init({
                        publicKey: 'tt1lZ0AV5V-8OdX76'  // Fast Tech EmailJS public key
                    });
                    console.log('%c✅ EmailJS initialized successfully', 'color: green;');
                } catch (initError) {
                    console.error('%c❌ Error calling emailjs.init:', 'color: red;', initError);
                }
            } else {
                // EmailJS not available yet, retry in 500ms
                setTimeout(tryInitialize, 500);
            }
        };
        
        tryInitialize();
    } catch (error) {
        console.error('%c❌ Error in initializeEmailJS:', 'color: red;', error);
    }
}

// Initialize Firebase for subscribers
async function initializeSubscriberSystem() {
    try {
        console.log('%c📧 Initializing Subscriber System...', 'color: blue; font-weight: bold;');
        const { initializeApp, getApp } = await import("https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js");
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
        
        // Try to get existing app first
        let app;
        try {
            console.log('%c✓ Attempting to get existing Firebase app...', 'color: blue;');
            app = getApp();
            console.log('%c✓ Using existing Firebase app', 'color: green;');
        } catch (e) {
            // App doesn't exist, create new one
            console.log('%c✓ No existing app found, creating new Firebase app...', 'color: blue;');
            app = initializeApp(firebaseConfig);
            console.log('%c✓ New Firebase app created', 'color: green;');
        }
        
        subscribersDB = getDatabase(app);
        subscribersRef = ref;
        subscribersPush = push;
        subscribersGet = get;
        
        console.log('%c✅ Subscriber System Initialized', 'color: green; font-weight: bold;');
        
        // Initialize EmailJS
        initializeEmailJS();
        
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
async function handleSubscription(event) {
    if (event) {
        event.preventDefault();
    }
    
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
        if (!window.firebaseDB || !window.firebaseGet || !window.firebaseRef || !window.firebasePush) {
            showMessage('System not ready. Please try again later.', 'danger');
            return;
        }
        
        const subscribersSnapshot = await window.firebaseGet(window.firebaseRef(window.firebaseDB, 'subscribers'));
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
        
        const subscribersRefPath = window.firebaseRef(window.firebaseDB, 'subscribers');
        await window.firebasePush(subscribersRefPath, subscriberData);
        
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
        // Use Firebase initialized from admin.html
        if (!window.firebaseDB || !window.firebaseGet || !window.firebaseRef) {
            console.warn('%c⚠️ Firebase not available, returning empty subscribers', 'color: orange;');
            return [];
        }
        
        const subscribersSnapshot = await window.firebaseGet(window.firebaseRef(window.firebaseDB, 'subscribers'));
        
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
            return {
                success: false,
                message: 'No active subscribers',
                subscriberCount: 0
            };
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
        if (window.firebaseRef && window.firebasePush && window.firebaseDB) {
            const notificationsRef = window.firebaseRef(window.firebaseDB, 'notifications');
            await window.firebasePush(notificationsRef, notification);
        }
        
        // Send actual emails using EmailJS
        let emailsSent = 0;
        
        console.log('%c📧 Sending emails to', 'color: blue;', subscribers.length, 'subscribers...');
        
        for (const subscriber of subscribers) {
            const success = await sendEmailWithRetry('service_fast_tech', 'template_imne3bp', {
                to_email: subscriber.email,
                product_name: productName,
                product_description: productDescription,
                product_price: '₱' + parseFloat(productPrice).toFixed(2),
                store_name: 'Fast Tech',
                store_link: window.location.origin,
                message_type: 'New Product Alert'
            }, subscriber.email);
            
            if (success) {
                emailsSent++;
            }
        }
        
        if (emailsSent > 0) {
            console.log('%c✅ Notification process completed:', 'color: green;', `${emailsSent}/${subscribers.length} emails sent about: ${productName}`);
        } else {
            console.log('%c⚠️ No emails sent - waiting for EmailJS to load...', 'color: orange;');
        }
        
        return {
            success: true,
            message: `Notification sent to ${emailsSent} subscribers about: ${productName}`,
            subscriberCount: emailsSent
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

// Notify subscribers about price changes
async function notifySubscribersAboutPriceChange(productName, oldPrice, newPrice) {
    try {
        console.log('%c💰 Preparing to notify subscribers about price change...', 'color: blue;');
        
        const subscribers = await getActiveSubscribers();
        
        if (subscribers.length === 0) {
            console.log('%c ℹ️ No active subscribers to notify', 'color: orange;');
            return { success: false };
        }
        
        // Create notification record
        const notification = {
            type: 'price_change',
            productName: productName,
            oldPrice: oldPrice,
            newPrice: newPrice,
            priceDifference: newPrice - oldPrice,
            sentAt: new Date().toISOString(),
            recipientCount: subscribers.length
        };
        
        // Store notification in Firebase
        if (window.firebaseRef && window.firebasePush && window.firebaseDB) {
            const notificationsRef = window.firebaseRef(window.firebaseDB, 'notifications');
            await window.firebasePush(notificationsRef, notification);
        }
        
        // Send actual emails using EmailJS
        let emailsSent = 0;
        
        console.log('%c📧 Sending price change emails to', 'color: blue;', subscribers.length, 'subscribers...');
        
        for (const subscriber of subscribers) {
            const priceStatus = newPrice < oldPrice ? 'PRICE DROP! 🎉' : 'Price Update';
            const success = await sendEmailWithRetry('service_fast_tech', 'template_imne3bp', {
                to_email: subscriber.email,
                product_name: productName,
                old_price: '₱' + parseFloat(oldPrice).toFixed(2),
                new_price: '₱' + parseFloat(newPrice).toFixed(2),
                price_difference: '₱' + Math.abs(newPrice - oldPrice).toFixed(2),
                price_status: priceStatus,
                store_name: 'Fast Tech',
                store_link: window.location.origin,
                message_type: 'Price Change Alert'
            }, subscriber.email);
            
            if (success) {
                emailsSent++;
            }
        }
        
        console.log('%c✅ Price change notification completed:', 'color: green;', `${emailsSent} emails sent`);
        
        return {
            success: true,
            subscriberCount: emailsSent
        };
        
    } catch (error) {
        console.error('%c❌ Error notifying about price change:', 'color: red;', error);
        return { success: false };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeSubscriberSystem();
});
