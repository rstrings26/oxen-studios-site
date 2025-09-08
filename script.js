// Product data
const products = [
    {
        id: 7,
        name: "Red Moon Edition",
        description: "Minimal red moon graphic on premium 240GSM oversized tee. Ultra-soft. Limited pieces.",
        price: 1499,
        originalPrice: 1999,
        discountPercent: 25,
        image: "images/red moon.jpg",
        sizes: ["S", "M", "L", "XL", "XXL"],
        stock: "Limited Pieces"
    },
    {
        id: 1,
        name: "Amiri Classic Collection",
        description: "Premium Amiri-inspired oversized t-shirt with luxury streetwear aesthetic. Limited stock available.",
        price: 1999,
        image: "images/Amiri Classic.jpg",
        sizes: ["S", "M", "L", "XL", "XXL"],
        stock: "Limited Stock"
    },
    {
        id: 2,
        name: "American Psycho Edition",
        description: "Bold American Psycho-inspired oversized t-shirt. Features iconic design elements with premium cotton blend. Limited stock available.",
        price: 1999,
        image: "images/Amricaan Psycho Edition.jpg",
        imageBack: "images/Amricaan Psycho Edition back.jpg",
        sizes: ["S", "M", "L", "XL", "XXL"],
        stock: "Limited Stock"
    },
    {
        id: 3,
        name: "Anime Collection - Black",
        description: "Striking black anime-inspired oversized t-shirt with modern streetwear vibes. Perfect for anime enthusiasts. Limited stock available.",
        price: 1999,
        image: "images/anime black.jpg",
        sizes: ["S", "M", "L", "XL", "XXL"],
        stock: "Limited Stock"
    },
    {
        id: 4,
        name: "Anime Collection - Cream",
        description: "Elegant cream anime-themed oversized t-shirt with soft, comfortable feel. Versatile design for everyday wear. Limited stock available.",
        price: 1999,
        image: "images/anime cream.jpg",
        sizes: ["S", "M", "L", "XL", "XXL"],
        stock: "Limited Stock"
    },
    {
        id: 5,
        name: "Anime Collection - White",
        description: "Clean white anime-inspired oversized t-shirt with minimalist design. Perfect for layering or wearing alone. Limited stock available.",
        price: 1999,
        image: "images/anime white.jpg",
        sizes: ["S", "M", "L", "XL", "XXL"],
        stock: "Limited Stock"
    },
    {
        id: 6,
        name: "Arabic Calligraphy Edition",
        description: "Beautiful Arabic calligraphy-inspired oversized t-shirt featuring traditional art with modern streetwear design. Limited stock available.",
        price: 1999,
        image: "images/Arabic Calligraphy Edition.jpg",
        imageBack: "images/Arabic Calligraphy  Edition front.jpg",
        sizes: ["S", "M", "L", "XL", "XXL"],
        stock: "Limited Stock"
    }
];

// Global variables
let cart = [];
let currentProduct = null;

// Google Sheets configuration
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwTbRG35QgtrWwKiPOxBex_MlBXlM5kSbmcMKlMDG1OBKROrAmLzM4x2zv-UfrLKN_lcg/exec'; // Replace with your actual Google Apps Script URL

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Show splash screen briefly (reduced to 800ms)
    setTimeout(() => {
        hideSplashScreen();
    }, 800);
    
    // Load products
    loadProducts();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Update cart count
    updateCartCount();

    // Initialize scroll reveal once content exists
    initializeScrollReveal();

    // Initialize theme
    initializeTheme();
}

function hideSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    
    splashScreen.classList.add('fade-out');
    
    setTimeout(() => {
        splashScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
    }, 800);
}

function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });

    // Tag product cards for reveal with small stagger
    const cards = productsGrid.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.classList.add('reveal');
        if (index % 3 === 1) card.classList.add('delay-1');
        if (index % 3 === 2) card.classList.add('delay-2');
    });
}

function initializeScrollReveal() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

    // Mark hero and sections
    const hero = document.querySelector('.hero .hero-content');
    if (hero) hero.classList.add('reveal', 'delay-1');
    const sections = document.querySelectorAll('.section-title, .about-content, .contact-info');
    sections.forEach((el, i) => {
        el.classList.add('reveal');
        if (i % 2 === 0) el.classList.add('delay-1');
        if (i % 3 === 0) el.classList.add('delay-2');
    });

    if (!prefersReduced) {
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    } else {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => openProductModal(product);
    
    card.innerHTML = `
        <div style="position: relative;">
            ${product.discountPercent ? `<div class="discount-badge" style="position:absolute; top:10px; left:10px; background:#ff3b30; color:#fff; padding:4px 8px; font-weight:700; border-radius:6px; font-size:0.8rem; z-index:1;">${product.discountPercent}% OFF</div>` : ''}
            <img
                src="${product.image}?nf_resize=fit&w=800"
                srcset="
                    ${product.image}?nf_resize=fit&w=400 400w,
                    ${product.image}?nf_resize=fit&w=800 800w,
                    ${product.image}?nf_resize=fit&w=1200 1200w"
                sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                alt="${product.name}"
                class="product-image"
                loading="lazy"
                decoding="async"
                width="800"
                height="800"
            >
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${product.originalPrice ? `<span style="text-decoration: line-through; color: #888; margin-right: 8px;">Rs. ${product.originalPrice.toLocaleString()}</span><span style="color: #28a745; font-weight: 700;">Rs. ${product.price.toLocaleString()}</span>` : `Rs. ${product.price.toLocaleString()}`}</div>
            <div class="product-stock">${product.stock}</div>
        </div>
    `;
    
    return card;
}

function openProductModal(product) {
    currentProduct = product;
    const modal = document.getElementById('product-modal');
    const modalName = document.getElementById('modal-product-name');
    const modalImage = document.getElementById('modal-product-image');
    const modalDescription = document.getElementById('modal-product-description');
    const modalPrice = document.getElementById('modal-product-price');
    
    modalName.textContent = product.name;
    modalImage.src = product.image + '?nf_resize=fit&w=1200';
    modalImage.srcset = `
        ${product.image}?nf_resize=fit&w=600 600w,
        ${product.image}?nf_resize=fit&w=900 900w,
        ${product.image}?nf_resize=fit&w=1200 1200w`;
    modalImage.sizes = '(max-width: 900px) 90vw, 1200px';
    modalImage.alt = product.name;
    modalDescription.textContent = product.description;
    if (product.originalPrice && product.price < product.originalPrice) {
        modalPrice.innerHTML = `<span style="text-decoration: line-through; color: #888; margin-right: 8px;">Rs. ${product.originalPrice.toLocaleString()}</span><span style="color: #28a745; font-weight: 700;">Rs. ${product.price.toLocaleString()}</span>`;
    } else {
        modalPrice.textContent = `Rs. ${product.price.toLocaleString()}`;
    }
    
    // Add stock information to description
    const stockInfo = document.createElement('div');
    stockInfo.className = 'product-stock-modal';
    stockInfo.textContent = product.stock;
    stockInfo.style.cssText = 'color: #ff6b35; font-weight: 600; margin-top: 0.5rem; font-size: 0.9rem;';
    
    // Clear previous stock info and add new one
    const existingStock = modalDescription.parentNode.querySelector('.product-stock-modal');
    if (existingStock) {
        existingStock.remove();
    }
    modalDescription.parentNode.appendChild(stockInfo);
    
    modal.classList.add('show');
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function addToCartFromModal() {
    if (!currentProduct) return;
    
    const sizeSelect = document.getElementById('size-select');
    const selectedSize = sizeSelect.value;
    
    addToCart(currentProduct, selectedSize);
    closeModal();
    
    // Show success feedback
    showCartFeedback();
}

function addToCart(product, size) {
    const existingItem = cart.find(item => item.id === product.id && item.size === size);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            size: size,
            quantity: 1,
            image: product.image
        });
    }
    
    updateCartCount();
    updateCartDisplay();
}

function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    updateCartCount();
    updateCartDisplay();
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}?nf_resize=fit&w=200" alt="${item.name}" class="cart-item-image" loading="lazy" decoding="async" width="200" height="200">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-size">Size: ${item.size}</div>
                <div class="cart-item-price">Rs. ${(item.price * item.quantity).toLocaleString()}</div>
                <div class="cart-item-quantity">Qty: ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id}, '${item.size}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    updateCartTotal();
}

function updateCartTotal() {
    const cartTotal = document.getElementById('cart-total');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Rs. ${total.toLocaleString()}`;
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('show');
    
    if (cartSidebar.classList.contains('open')) {
        updateCartDisplay();
    }
}

function openCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const checkoutModal = document.getElementById('checkout-modal');
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    
    // Populate order summary
    orderItems.innerHTML = cart.map(item => `
        <div class="order-item">
            <span>${item.name} (${item.size}) x${item.quantity}</span>
            <span>Rs. ${(item.price * item.quantity).toLocaleString()}</span>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    orderTotal.textContent = `Rs. ${total.toLocaleString()}`;
    
    checkoutModal.classList.add('show');
    checkoutModal.style.display = 'flex';
}

function closeCheckout() {
    const checkoutModal = document.getElementById('checkout-modal');
    checkoutModal.classList.remove('show');
    setTimeout(() => {
        checkoutModal.style.display = 'none';
    }, 300);
}

function initializeEventListeners() {
    // Checkout form submission
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', handleCheckout);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const productModal = document.getElementById('product-modal');
        const checkoutModal = document.getElementById('checkout-modal');
        
        if (event.target === productModal) {
            closeModal();
        }
        if (event.target === checkoutModal) {
            closeCheckout();
        }
    });
    
    // Smooth scrolling for navigation links
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

    // Theme toggle
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleTheme);
    }
}

function initializeTheme() {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    setTheme(theme);
}

function setTheme(theme) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

async function handleCheckout(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const orderData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        city: formData.get('city'),
        address: formData.get('address'),
        payment: formData.get('payment'),
        shirt: cart.map(item => `${item.name} (${item.size}) x${item.quantity}`).join(', '),
        size: cart.map(item => `${item.size} x${item.quantity}`).join(', ')
    };
    
    try {
        // Show loading state
        const submitBtn = event.target.querySelector('.submit-order-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        // Submit to Google Sheets
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(orderData)
        });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success confirmation
        showOrderConfirmation();
        
        // Clear cart and close checkout
        cart = [];
        updateCartCount();
        updateCartDisplay();
        closeCheckout();
        
        // Reset form
        event.target.reset();
        
    } catch (error) {
        console.error('Error submitting order:', error);
        alert('There was an error processing your order. Please try again.');
        
        // Reset button
        const submitBtn = event.target.querySelector('.submit-order-btn');
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Place Order';
        submitBtn.disabled = false;
    }
}

function showOrderConfirmation() {
    const confirmation = document.getElementById('order-confirmation');
    confirmation.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        closeConfirmation();
    }, 5000);
}

function closeConfirmation() {
    const confirmation = document.getElementById('order-confirmation');
    confirmation.classList.add('hidden');
}

function showCartFeedback() {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #28a745;
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-weight: 600;
        z-index: 1004;
        animation: feedbackSlideIn 0.3s ease;
    `;
    feedback.innerHTML = '<i class="fas fa-check"></i> Added to cart!';
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes feedbackSlideIn {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(feedback);
    
    // Remove after animation
    setTimeout(() => {
        feedback.style.animation = 'feedbackSlideIn 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(feedback);
            document.head.removeChild(style);
        }, 300);
    }, 1500);
}

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Handle window resize
window.addEventListener('resize', function() {
    // Close cart on mobile when resizing to desktop
    if (window.innerWidth > 768) {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('show');
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', function(event) {
    // Close modals with Escape key
    if (event.key === 'Escape') {
        const productModal = document.getElementById('product-modal');
        const checkoutModal = document.getElementById('checkout-modal');
        const confirmation = document.getElementById('order-confirmation');
        
        if (productModal.classList.contains('show')) {
            closeModal();
        }
        if (checkoutModal.classList.contains('show')) {
            closeCheckout();
        }
        if (!confirmation.classList.contains('hidden')) {
            closeConfirmation();
        }
    }
});