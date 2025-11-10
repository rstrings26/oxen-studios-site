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
let modalCurrentProduct = null;
let modalCurrentIndex = 0;

// Google Sheets configuration
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwTbRG35QgtrWwKiPOxBex_MlBXlM5kSbmcMKlMDG1OBKROrAmLzM4x2zv-UfrLKN_lcg/exec';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('oxen_cart');
    if (savedCart) {
        try {
            const parsed = JSON.parse(savedCart);
            if (Array.isArray(parsed)) {
                // Clean up corrupted items - remove any with undefined/null required fields
                cart = parsed.filter(item => {
                    return item && 
                           item.id != null && 
                           item.name && 
                           item.price != null && 
                           item.size;
                });
                
                // If we filtered out bad items, update localStorage
                if (cart.length !== parsed.length) {
                    console.log('Cleaned up corrupted cart items');
                    localStorage.setItem('oxen_cart', JSON.stringify(cart));
                }
            } else {
                cart = [];
            }
        } catch (e) {
            console.error('Error loading cart:', e);
            cart = [];
            localStorage.removeItem('oxen_cart');
        }
    }
    
    // Show splash screen briefly
    setTimeout(() => {
        hideSplashScreen();
    }, 1200);
    
    // Load products
    loadProducts();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Update cart count and display
    updateCartCount();
    updateCartDisplay();

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
    const winterGrid = document.getElementById('winter-grid');
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        
        // Add to winter collection or regular products
        if (product.section === 'winter') {
            if (winterGrid) winterGrid.appendChild(productCard);
        } else {
            productsGrid.appendChild(productCard);
        }
    });

    // Tag product cards for reveal with small stagger
    const allCards = document.querySelectorAll('.product-card');
    allCards.forEach((card, index) => {
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

    // Add winter class for winter products
    if (product.section === 'winter') {
        card.classList.add('winter-product');
    }

    // Pick image (support array or string) and sanitize/encode it
    const rawImage = Array.isArray(product.image) ? product.image[0] : product.image || 'images/placeholder.jpg';
    const imgSrc = encodeURI(rawImage.trim());

    // Badges
    let badges = '';
    if (product.section === 'winter') {
        badges += `<div class="product-badge winter-badge">❄️ Winter</div>`;
    }
    if (product.discountPercent) {
        badges += `<div class="product-badge discount-badge">${product.discountPercent}% OFF</div>`;
    }

    card.innerHTML = `
        <div class="product-image-wrapper">
            ${badges}
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
            <div class="product-price">${product.originalPrice ? `<span class="original-price">Rs. ${product.originalPrice.toLocaleString()}</span><span class="sale-price">Rs. ${product.price.toLocaleString()}</span>` : `<span class="current-price">Rs. ${product.price.toLocaleString()}</span>`}</div>
            <div class="product-stock">${product.stock}</div>
        </div>
    `;
    
    return card;
}

function openProductModal(product) {
    if (!product) return;
    
    modalCurrentProduct = product;
    modalCurrentIndex = 0;

    const modal = document.getElementById('product-modal');
    const nameEl = document.getElementById('modal-product-name');
    const descEl = document.getElementById('modal-product-description');
    const priceEl = document.getElementById('modal-product-price');
    const sizeSelect = document.getElementById('size-select');

    if (!modal || !nameEl || !descEl || !priceEl || !sizeSelect) return;

    // Product text
    nameEl.textContent = product.name || '';
    descEl.textContent = product.description || '';
    priceEl.textContent = `Rs. ${Number(product.price || 0).toLocaleString()}`;

    // Fill sizes (if provided)
    if (product.sizes && Array.isArray(product.sizes)) {
        sizeSelect.innerHTML = product.sizes.map(s => `<option value="${s}">${s}</option>`).join('');
    } else {
        sizeSelect.innerHTML = '<option value="M">Medium</option>';
    }

    // Build images array (support string, array, and imageBack fields)
    let imgs = [];
    if (Array.isArray(product.image)) {
        imgs = product.image.slice();
    } else if (typeof product.image === 'string' && product.image.trim()) {
        imgs.push(product.image.trim());
    }
    if (product.imageBack && typeof product.imageBack === 'string') {
        const backImg = product.imageBack.trim();
        if (!imgs.includes(backImg)) imgs.push(backImg);
    }

    // Fallback placeholder if no images
    if (imgs.length === 0) imgs.push('images/placeholder.jpg');

    buildModalSlider(imgs);

    // show modal
    modal.style.display = 'flex';
    // Force reflow for animation
    void modal.offsetHeight;
    modal.classList.add('open', 'show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    
    modal.classList.remove('open', 'show');
    
    // Use setTimeout to allow animation to complete
    setTimeout(() => {
        modal.style.display = 'none';
        
        // clear slider
        const slider = document.getElementById('modal-slider');
        if (slider) slider.innerHTML = '';
        const thumbs = document.getElementById('modal-thumbs');
        if (thumbs) thumbs.innerHTML = '';
        
        modalCurrentProduct = null;
        modalCurrentIndex = 0;
    }, 300);
    
    document.body.style.overflow = '';
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
    prev.className = 'slider-arrow slider-arrow-prev';
    prev.setAttribute('aria-label', 'Previous image');
    prev.addEventListener('click', () => showSlide(modalCurrentIndex - 1));
    slider.appendChild(prev);

    const next = document.createElement('button');
    next.id = 'modal-next';
    next.innerHTML = '&#10095;';
    next.className = 'slider-arrow slider-arrow-next';
    next.setAttribute('aria-label', 'Next image');
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
        s.classList.toggle('active', i === index);
    });
    thumbs.forEach((t, i) => {
        t.style.opacity = i === index ? '1' : '0.5';
        t.classList.toggle('active', i === index);
        const img = t.querySelector('img');
        if (img) {
            img.style.boxShadow = i === index ? '0 6px 18px rgba(0,0,0,0.2)' : 'none';
            img.style.transform = i === index ? 'scale(1.05)' : 'scale(1)';
        }
    });
}

// Add to cart from modal
function addToCartFromModal() {
    if (!modalCurrentProduct) return;
    const sizeSelect = document.getElementById('size-select');
    const size = sizeSelect ? sizeSelect.value : 'M';
    
    addToCart(modalCurrentProduct, size);
    closeModal();
}

function addToCart(product, size) {
    if (!product || !size || !product.id || !product.name || product.price == null) {
        console.error('Invalid product or size:', {product, size});
        showCartFeedback('Error adding item to cart', 'remove');
        return;
    }
    
    const existingItem = cart.find(item => item.id === product.id && item.size === size);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            size: size,
            quantity: 1,
            image: Array.isArray(product.image) ? product.image[0] : product.image
        });
    }
    
    // Save to localStorage
    localStorage.setItem('oxen_cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    updateCartDisplay();
    
    // Show cart feedback
    showCartFeedback(`${product.name} added to cart!`, 'success');
}

function updateQuantity(productId, size, change) {
    console.log('updateQuantity called:', {productId, size, change});
    
    // Decode HTML entities in size
    const decodedSize = size.replace(/&#39;/g, "'");
    
    const item = cart.find(item => item.id == productId && item.size == decodedSize);
    
    if (item) {
        item.quantity = (item.quantity || 1) + change;
        
        // Remove if quantity is 0 or less
        if (item.quantity <= 0) {
            removeFromCart(productId, decodedSize);
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('oxen_cart', JSON.stringify(cart));
        
        // Update UI
        updateCartCount();
        updateCartDisplay();
    } else {
        console.error('Item not found in cart:', {productId, size, decodedSize, cart});
    }
}

function removeFromCart(productId, size) {
    console.log('removeFromCart called:', {productId, size});
    
    // Decode HTML entities in size
    const decodedSize = size.replace(/&#39;/g, "'");
    
    // Find the item
    const item = cart.find(item => item.id == productId && item.size == decodedSize);
    const itemName = item ? item.name : 'Item';
    
    console.log('Found item to remove:', item);
    
    // Remove from cart
    const beforeLength = cart.length;
    cart = cart.filter(item => !(item.id == productId && item.size == decodedSize));
    
    console.log('Cart length before:', beforeLength, 'after:', cart.length);
    
    // Save to localStorage
    localStorage.setItem('oxen_cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    updateCartDisplay();
    
    // Show feedback
    showCartFeedback(`${itemName} removed from cart`, 'remove');
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (!cartCount) return;
    
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    // Only animate if count is greater than 0
    if (totalItems > 0) {
        cartCount.style.animation = 'none';
        setTimeout(() => {
            cartCount.style.animation = 'cartBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }, 10);
    }
    
    cartCount.textContent = totalItems;
    
    // Hide badge if cart is empty
    if (totalItems === 0) {
        cartCount.style.display = 'none';
    } else {
        cartCount.style.display = 'flex';
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;
    
    // Clean cart of any corrupted items before displaying
    cart = cart.filter(item => item && item.id != null && item.name && item.price != null && item.size);
    
    if (!cart || cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 2rem;">Your cart is empty</p>';
        updateCartTotal();
        return;
    }
    
    cartItems.innerHTML = cart.map((item, index) => {
        // Safely get values with fallbacks
        const imgSrc = Array.isArray(item.image) ? item.image[0] : item.image || 'images/placeholder.jpg';
        const sanitizedSize = (item.size || 'M').replace(/'/g, '&#39;');
        const itemName = item.name || 'Product';
        const itemPrice = item.price || 0;
        const itemQuantity = item.quantity || 1;
        const itemSize = item.size || 'M';
        
        return `
        <div class="cart-item" style="animation-delay: ${index * 0.05}s">
            <img src="${encodeURI(imgSrc.trim())}?nf_resize=fit&w=200" alt="${itemName}" class="cart-item-image" loading="lazy" decoding="async" width="200" height="200">
            <div class="cart-item-details">
                <div class="cart-item-name">${itemName}</div>
                <div class="cart-item-size">Size: ${itemSize}</div>
                <div class="cart-item-price">Rs. ${(itemPrice * itemQuantity).toLocaleString()}</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" data-id="${item.id}" data-size="${sanitizedSize}" data-action="decrease" title="Decrease quantity">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="qty-display">${itemQuantity}</span>
                    <button class="qty-btn" data-id="${item.id}" data-size="${sanitizedSize}" data-action="increase" title="Increase quantity">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <button class="cart-item-remove" data-id="${item.id}" data-size="${sanitizedSize}" title="Remove from cart">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        `;
    }).join('');
    
    // Use event delegation on the cart container for better reliability
    cartItems.addEventListener('click', function(e) {
        const target = e.target.closest('.cart-item-remove, .qty-btn');
        if (!target) return;
        
        e.stopPropagation();
        e.preventDefault();
        
        const id = parseInt(target.dataset.id);
        const size = target.dataset.size;
        
        console.log('Cart button clicked:', {
            button: target.className,
            id: id,
            size: size,
            dataset: target.dataset
        });
        
        if (target.classList.contains('cart-item-remove')) {
            console.log('DELETE button clicked!');
            removeFromCart(id, size);
        } else if (target.classList.contains('qty-btn')) {
            const action = target.dataset.action;
            const change = action === 'increase' ? 1 : -1;
            console.log('Quantity button clicked:', action, change);
            updateQuantity(id, size, change);
        }
    });
    
    updateCartTotal();
}

function updateCartTotal() {
    const cartTotal = document.getElementById('cart-total');
    if (!cartTotal) return;
    
    const total = cart.reduce((sum, item) => {
        const price = item.price || 0;
        const quantity = item.quantity || 0;
        return sum + (price * quantity);
    }, 0);
    
    cartTotal.textContent = `Rs. ${total.toLocaleString()}`;
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (!cartSidebar || !cartOverlay) return;
    
    const isOpen = cartSidebar.classList.contains('open');
    
    if (isOpen) {
        // Close cart
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('show');
        document.body.style.overflow = '';
    } else {
        // Open cart
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        updateCartDisplay();
    }
}

function openCheckout() {
    if (cart.length === 0) {
        showCartFeedback('Your cart is empty!', 'remove');
        
        // Shake the cart icon
        const cartIcon = document.querySelector('.cart-icon');
        cartIcon.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            cartIcon.style.animation = '';
        }, 500);
        
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
    
    // Smooth scrolling for navigation links with offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close cart if open
                const cartSidebar = document.getElementById('cart-sidebar');
                const cartOverlay = document.getElementById('cart-overlay');
                if (cartSidebar && cartSidebar.classList.contains('open')) {
                    toggleCart();
                }
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
        submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
        submitBtn.disabled = true;
        submitBtn.style.cursor = 'wait';
        
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
        submitBtn.style.cursor = 'pointer';
        
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

function showCartFeedback(message = 'Added to cart!', type = 'success') {
    // Remove existing feedback if any
    const existing = document.querySelector('.cart-feedback');
    if (existing) existing.remove();
    
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.className = 'cart-feedback';
    
    const bgColor = type === 'success' ? '#28a745' : '#ff4444';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-trash-alt';
    
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;
    feedback.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    
    document.body.appendChild(feedback);
    
    // Remove after delay
    setTimeout(() => {
        feedback.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 300);
    }, 2000);
}

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Header scroll effect
let lastScroll = 0;
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Handle window resize
window.addEventListener('resize', function() {
    // Close cart on mobile when resizing to desktop
    if (window.innerWidth > 768) {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartSidebar) cartSidebar.classList.remove('open');
        if (cartOverlay) cartOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', function(event) {
    // Close modals with Escape key
    if (event.key === 'Escape') {
        const productModal = document.getElementById('product-modal');
        const checkoutModal = document.getElementById('checkout-modal');
        const confirmation = document.getElementById('order-confirmation');
        const cartSidebar = document.getElementById('cart-sidebar');
        
        if (productModal && (productModal.classList.contains('show') || productModal.classList.contains('open'))) {
            closeModal();
        }
        if (checkoutModal && checkoutModal.classList.contains('show')) {
            closeCheckout();
        }
        if (confirmation && !confirmation.classList.contains('hidden')) {
            closeConfirmation();
        }
        if (cartSidebar && cartSidebar.classList.contains('open')) {
            toggleCart();
        }
    }
    
    // Navigate modal slider with arrow keys
    const productModal = document.getElementById('product-modal');
    if (productModal && (productModal.classList.contains('show') || productModal.classList.contains('open'))) {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            showSlide(modalCurrentIndex - 1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            showSlide(modalCurrentIndex + 1);
        }
    }
});