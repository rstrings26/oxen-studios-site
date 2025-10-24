// Product data
const products = [
   {
    "id": 8,
    "name": "The OX Hoodie",
    "description": "Premium heavy-weight oversized hoodie built for warmth and street-ready style. Double-stitched seams and brushed interior fleece.",
    "price": 2200,
    "image":
   [
        "images/hoodie1 back.png",
        "images/hoodie1 front.png"
    ],
    "sizes": ["S", "M", "L", "XL", "XXL"],
    "stock": "Limited Drop",
    "section": "winter"
},
   
    {
        id: 7,
        name: "Retro Ferrari Edition",
        description: "Iconic Retro Ferrari tee in premium 240GSM cotton. Vibrant print, ultra-soft feel, limited drop.",
        price: 999,
        originalPrice: 1999,
        discountPercent: 50,
        image: "images/Ferrari Retro.jpg",
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

// modal state
let modalCurrentProduct = null;
let modalCurrentIndex = 0;

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

    // Pick image (support array or string) and sanitize/encode it
    const rawImage = Array.isArray(product.image) ? product.image[0] : product.image || 'images/placeholder.jpg';
    const imgSrc = encodeURI(rawImage.trim());

    card.innerHTML = `
        <div style="position: relative;">
            ${product.discountPercent ? `<div class="discount-badge" style="position:absolute; top:10px; left:10px; background:#ff3b30; color:#fff; padding:4px 8px; font-weight:700; border-radius:6px; font-size:0.8rem; z-index:1;">${product.discountPercent}% OFF</div>` : ''}
            <img
                src="${imgSrc}?nf_resize=fit&w=800"
                srcset="
                    ${imgSrc}?nf_resize=fit&w=400 400w,
                    ${imgSrc}?nf_resize=fit&w=800 800w,
                    ${imgSrc}?nf_resize=fit&w=1200 1200w"
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
    modalCurrentProduct = product;
    modalCurrentIndex = 0;

    const modal = document.getElementById('product-modal');
    const nameEl = document.getElementById('modal-product-name');
    const descEl = document.getElementById('modal-product-description');
    const priceEl = document.getElementById('modal-product-price');
    const sizeSelect = document.getElementById('size-select');

    // Product text
    nameEl.textContent = product.name || '';
    descEl.textContent = product.description || '';
    priceEl.textContent = `Rs. ${Number(product.price || 0).toLocaleString()}`;

    // Fill sizes (if provided)
    if (product.sizes && Array.isArray(product.sizes)) {
        sizeSelect.innerHTML = product.sizes.map(s => `<option value="${s}">${s}</option>`).join('');
    }

    // Build images array (support string, array, and imageBack fields)
    let imgs = [];
    if (Array.isArray(product.image)) {
        imgs = product.image.slice();
    } else if (typeof product.image === 'string' && product.image.trim()) {
        imgs.push(product.image.trim());
    }
    if (product.imageBack && typeof product.imageBack === 'string') {
        if (!imgs.includes(product.imageBack.trim())) imgs.push(product.imageBack.trim());
    }

    if (imgs.length === 0) imgs.push('images/placeholder.jpg');

    buildModalSlider(imgs);

    // show modal (use CSS .open -> flex centering)
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
    // clear slider
    const slider = document.getElementById('modal-slider');
    if (slider) slider.innerHTML = '';
    const thumbs = document.getElementById('modal-thumbs');
    if (thumbs) thumbs.innerHTML = '';
    modalCurrentProduct = null;
    modalCurrentIndex = 0;
}

function buildModalSlider(images) {
    const slider = document.getElementById('modal-slider');
    const thumbs = document.getElementById('modal-thumbs');
    slider.innerHTML = '';
    thumbs.innerHTML = '';

    images.forEach((src, i) => {
        const imgSrc = encodeURI(src.trim());

        // Slide
        const slide = document.createElement('div');
        slide.className = 'modal-slide';
        slide.style.display = i === 0 ? 'block' : 'none';
        slide.style.textAlign = 'center';
        slide.style.padding = '10px 0';

        const img = document.createElement('img');
        img.src = `${imgSrc}`;
        img.alt = `${modalCurrentProduct ? modalCurrentProduct.name : 'product'} - ${i+1}`;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.borderRadius = '8px';
        img.loading = 'lazy';
        slide.appendChild(img);

        slider.appendChild(slide);

        // Thumb
        const thumbBtn = document.createElement('button');
        thumbBtn.className = 'modal-thumb';
        thumbBtn.style.border = 'none';
        thumbBtn.style.padding = '0';
        thumbBtn.style.background = 'transparent';
        thumbBtn.style.cursor = 'pointer';
        thumbBtn.style.opacity = i === 0 ? '1' : '0.6';

        const thumbImg = document.createElement('img');
        thumbImg.src = `${imgSrc}`;
        thumbImg.alt = `thumb-${i+1}`;
        thumbImg.style.width = '72px';
        thumbImg.style.height = '72px';
        thumbImg.style.objectFit = 'cover';
        thumbImg.style.borderRadius = '6px';
        thumbImg.style.boxShadow = i === 0 ? '0 6px 18px rgba(0,0,0,0.12)' : 'none';

        thumbBtn.appendChild(thumbImg);
        thumbBtn.addEventListener('click', () => showSlide(i));

        thumbs.appendChild(thumbBtn);
    });

    // Prev / Next arrows
    // Remove existing arrows if any
    const existingPrev = document.getElementById('modal-prev');
    const existingNext = document.getElementById('modal-next');
    if (existingPrev) existingPrev.remove();
    if (existingNext) existingNext.remove();

    const prev = document.createElement('button');
    prev.id = 'modal-prev';
    prev.innerHTML = '&#10094;';
    prev.style.position = 'absolute';
    prev.style.left = '6px';
    prev.style.top = '50%';
    prev.style.transform = 'translateY(-50%)';
    prev.style.background = 'rgba(0,0,0,0.5)';
    prev.style.color = '#fff';
    prev.style.border = 'none';
    prev.style.padding = '8px 10px';
    prev.style.borderRadius = '6px';
    prev.style.cursor = 'pointer';
    prev.addEventListener('click', () => showSlide(modalCurrentIndex - 1));
    slider.appendChild(prev);

    const next = document.createElement('button');
    next.id = 'modal-next';
    next.innerHTML = '&#10095;';
    next.style.position = 'absolute';
    next.style.right = '6px';
    next.style.top = '50%';
    next.style.transform = 'translateY(-50%)';
    next.style.background = 'rgba(0,0,0,0.5)';
    next.style.color = '#fff';
    next.style.border = 'none';
    next.style.padding = '8px 10px';
    next.style.borderRadius = '6px';
    next.style.cursor = 'pointer';
    next.addEventListener('click', () => showSlide(modalCurrentIndex + 1));
    slider.appendChild(next);

    // ensure global index set
    modalCurrentIndex = 0;
    showSlide(0);
}

function showSlide(index) {
    const slides = document.querySelectorAll('#modal-slider .modal-slide');
    const thumbs = document.querySelectorAll('#modal-thumbs .modal-thumb');

    if (!slides || slides.length === 0) return;
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    modalCurrentIndex = index;

    slides.forEach((s, i) => {
        s.style.display = i === index ? 'block' : 'none';
    });
    thumbs.forEach((t, i) => {
        t.style.opacity = i === index ? '1' : '0.6';
        const img = t.querySelector('img');
        if (img) img.style.boxShadow = i === index ? '0 6px 18px rgba(0,0,0,0.12)' : 'none';
    });
}

// existing addToCartFromModal may exist; safe implementation:
function addToCartFromModal() {
    if (!modalCurrentProduct) return;
    const sizeSelect = document.getElementById('size-select');
    const size = sizeSelect ? sizeSelect.value : '';
    const item = {
        id: modalCurrentProduct.id,
        name: modalCurrentProduct.name,
        price: Number(modalCurrentProduct.price || 0),
        size,
        image: (modalCurrentProduct.image && (Array.isArray(modalCurrentProduct.image) ? modalCurrentProduct.image[0] : modalCurrentProduct.image)) || modalCurrentProduct.imageBack || ''
    };

    // If your code already exposes addToCart function, use it; otherwise gracefully fallback to existing cart handler
    if (typeof addToCart === 'function') {
        addToCart(item);
    } else if (typeof addToCartHandler === 'function') {
        addToCartHandler(item);
    } else {
        // minimal fallback: push to localStorage cart array and update cart-count if present
        try {
            const cartKey = 'oxen_cart_v1';
            const raw = localStorage.getItem(cartKey);
            const cart = raw ? JSON.parse(raw) : [];
            cart.push(item);
            localStorage.setItem(cartKey, JSON.stringify(cart));
            const countEl = document.getElementById('cart-count');
            if (countEl) countEl.textContent = cart.length;
            closeModal();
            alert('Added to cart');
        } catch (e) {
            console.error('addToCartFromModal fallback failed', e);
        }
    }
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
    // clear slider
    const slider = document.getElementById('modal-slider');
    if (slider) slider.innerHTML = '';
    const thumbs = document.getElementById('modal-thumbs');
    if (thumbs) thumbs.innerHTML = '';
    modalCurrentProduct = null;
    modalCurrentIndex = 0;
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