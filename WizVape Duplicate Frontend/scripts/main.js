/**
 * WizVape Duplicate Frontend - Main Client Logic
 * Handles: Cart Drawer, Swatch Switching, Quantity Stepper, Live Search Flydown, Toast Notifications
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Initial State & Store Data
  // -------------------------------------------------------------------------
  const FREE_SHIPPING_THRESHOLD = 20.00;

  const sampleCart = [
    {
      id: 'oxva-xlim-4-pink',
      title: 'Oxva Xlim 4 Pod Kit',
      variant: 'Aurora Petal Pink',
      price: 18.99,
      quantity: 1,
      image: 'https://cdn.shopify.com/s/files/1/0527/5104/0704/files/AuroraPetalPink.webp?v=1788877448'
    }
  ];

  let cart = JSON.parse(localStorage.getItem('wizvape_cart')) || sampleCart;

  // -------------------------------------------------------------------------
  // 2. DOM Elements
  // -------------------------------------------------------------------------
  const cartToggleBtn = document.getElementById('cartToggleBtn');
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const cartDrawerCloseBtn = document.getElementById('cartDrawerCloseBtn');
  const drawerItemsList = document.getElementById('drawerItemsList');
  const drawerSubtotal = document.getElementById('drawerSubtotal');
  const headerCartCount = document.getElementById('headerCartCount');
  const freeShippingText = document.getElementById('freeShippingText');
  const freeShippingFill = document.getElementById('freeShippingFill');
  const toastContainer = document.getElementById('toastContainer');

  // -------------------------------------------------------------------------
  // 3. Cart Drawer Operations
  // -------------------------------------------------------------------------
  function openCartDrawer() {
    if (!cartDrawerOverlay) return;
    cartDrawerOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    if (cartDrawerCloseBtn) cartDrawerCloseBtn.focus();
  }

  function closeCartDrawer() {
    if (!cartDrawerOverlay) return;
    cartDrawerOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
    if (cartToggleBtn) cartToggleBtn.focus();
  }

  function renderCart() {
    if (!drawerItemsList) return;

    drawerItemsList.innerHTML = '';
    let subtotal = 0;
    let totalCount = 0;

    if (cart.length === 0) {
      drawerItemsList.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <p style="font-size: var(--font-size-xl); color: var(--color-text-tertiary); margin-bottom: 16px;">Your basket is currently empty.</p>
          <button type="button" class="btn btn--primary" id="continueShoppingBtn">Start Shopping</button>
        </div>
      `;
      const continueBtn = document.getElementById('continueShoppingBtn');
      if (continueBtn) {
        continueBtn.addEventListener('click', closeCartDrawer);
      }
    } else {
      cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;
        totalCount += item.quantity;

        const itemEl = document.createElement('div');
        itemEl.className = 'drawer-item';
        itemEl.innerHTML = `
          <img src="${item.image}" alt="${item.title}" class="drawer-item-img" onerror="this.src='https://wizvape.co.uk/cdn/shop/files/new_log_test_500x180_17cc6547-5857-45d7-81d4-0cf0ad4f77d0_1204x630.png?v=1614776945'">
          <div class="drawer-item-details">
            <h4 class="drawer-item-title">${item.title}</h4>
            <div class="drawer-item-variant">${item.variant}</div>
            <div class="drawer-item-controls">
              <div class="qty-stepper" style="height: 34px;">
                <button type="button" class="qty-btn" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">&minus;</button>
                <span class="qty-val" style="width: 32px; font-size: 14px; line-height: 34px;">${item.quantity}</span>
                <button type="button" class="qty-btn" data-action="increase" data-index="${index}" aria-label="Increase quantity">&plus;</button>
              </div>
              <span class="drawer-item-price">£${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
          <button type="button" class="item-remove-btn" data-action="remove" data-index="${index}" aria-label="Remove ${item.title}">Remove</button>
        `;
        drawerItemsList.appendChild(itemEl);
      });
    }

    // Update Subtotal and Counts
    if (drawerSubtotal) {
      drawerSubtotal.textContent = `£${subtotal.toFixed(2)}`;
    }
    if (headerCartCount) {
      headerCartCount.textContent = totalCount;
    }

    // Free Shipping Calculations
    if (freeShippingText && freeShippingFill) {
      if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        freeShippingText.innerHTML = `🎉 <strong>Congratulations! You have unlocked FREE UK Delivery!</strong>`;
        freeShippingFill.style.width = '100%';
        freeShippingFill.style.backgroundColor = 'var(--color-status-instock)';
      } else {
        const remaining = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
        const percent = Math.min(100, Math.max(5, (subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        freeShippingText.innerHTML = `Add <strong>£${remaining}</strong> more for <strong>FREE UK Delivery</strong>!`;
        freeShippingFill.style.width = `${percent}%`;
        freeShippingFill.style.backgroundColor = 'var(--color-status-instock)';
      }
    }

    localStorage.setItem('wizvape_cart', JSON.stringify(cart));
  }

  function addToCart(product) {
    const existingIndex = cart.findIndex(item => item.id === product.id && item.variant === product.variant);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += (product.quantity || 1);
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        variant: product.variant || 'Standard',
        price: parseFloat(product.price),
        quantity: product.quantity || 1,
        image: product.image
      });
    }
    renderCart();
    showToast(`Added "${product.title}" (${product.variant}) to your basket!`);
    openCartDrawer();
  }

  // -------------------------------------------------------------------------
  // 4. Toast Notifications
  // -------------------------------------------------------------------------
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #4ade80;">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // -------------------------------------------------------------------------
  // 5. Event Delegations
  // -------------------------------------------------------------------------
  document.addEventListener('click', function (e) {
    // Open Cart Drawer
    if (e.target.closest('#cartToggleBtn')) {
      e.preventDefault();
      openCartDrawer();
    }

    // Close Cart Drawer
    if (e.target.closest('#cartDrawerCloseBtn') || e.target === cartDrawerOverlay) {
      e.preventDefault();
      closeCartDrawer();
    }

    // Drawer Item Quantity Actions
    const actionBtn = e.target.closest('[data-action]');
    if (actionBtn && actionBtn.closest('#drawerItemsList')) {
      const action = actionBtn.getAttribute('data-action');
      const index = parseInt(actionBtn.getAttribute('data-index'), 10);

      if (action === 'increase') {
        cart[index].quantity += 1;
        renderCart();
      } else if (action === 'decrease') {
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        renderCart();
      } else if (action === 'remove') {
        cart.splice(index, 1);
        renderCart();
      }
    }

    // Add to Basket button clicks (Product Cards)
    // Add to Basket button clicks (Product Cards & Device Pods)
    const atcBtn = e.target.closest('.js-add-to-cart');
    if (atcBtn) {
      e.preventDefault();
      atcBtn.classList.add('is-loading');

      const card = atcBtn.closest('.product-card') || atcBtn.closest('.device-pod-card');
      const title = atcBtn.getAttribute('data-title') || (card ? card.getAttribute('data-title') : 'Vape Product') || 'Vape Item';
      const id = atcBtn.getAttribute('data-id') || (card ? card.getAttribute('data-id') : 'vape-item') || 'vape-item';
      const price = atcBtn.getAttribute('data-price') || (card ? card.getAttribute('data-price') : '18.99') || '18.99';
      
      const activeImg = card ? (card.querySelector('.js-card-img') || card.querySelector('.device-card-img')) : null;
      const imgSrc = activeImg ? activeImg.src : 'https://wizvape.co.uk/cdn/shop/files/new_log_test_500x180_17cc6547-5857-45d7-81d4-0cf0ad4f77d0_1204x630.png?v=1614776945';
      
      const activeSwatch = card ? card.querySelector('.swatch-circle.is-selected') : null;
      const activeStrength = card ? card.querySelector('.strength-pill.is-selected') : null;
      
      let variant = 'Standard';
      if (activeSwatch) {
        variant = activeSwatch.getAttribute('data-color') || 'Standard';
      } else if (activeStrength) {
        variant = activeStrength.getAttribute('data-strength') || '10mg';
      }

      setTimeout(() => {
        atcBtn.classList.remove('is-loading');
        addToCart({
          id: id,
          title: title,
          variant: variant,
          price: price,
          quantity: 1,
          image: imgSrc
        });
      }, 350);
    }

    // Swatch selection in product cards
    const swatch = e.target.closest('.swatch-circle');
    if (swatch) {
      const card = swatch.closest('.product-card');
      if (card) {
        card.querySelectorAll('.swatch-circle').forEach(s => s.classList.remove('is-selected'));
        swatch.classList.add('is-selected');

        const newImgUrl = swatch.getAttribute('data-img');
        const cardImg = card.querySelector('.js-card-img');
        if (cardImg && newImgUrl) {
          cardImg.style.opacity = '0.4';
          setTimeout(() => {
            cardImg.src = newImgUrl;
            cardImg.style.opacity = '1';
          }, 120);
        }
      }
    }

    // Strength pill selection in nic salts cards
    const strengthPill = e.target.closest('.strength-pill');
    if (strengthPill) {
      const group = strengthPill.closest('.strength-group');
      if (group) {
        group.querySelectorAll('.strength-pill').forEach(p => p.classList.remove('is-selected'));
        strengthPill.classList.add('is-selected');
      }
    }

    // Find Pod by Device - Brand Tab Filtering
    const brandTabBtn = e.target.closest('.brand-tab-btn');
    if (brandTabBtn) {
      e.preventDefault();
      document.querySelectorAll('.brand-tab-btn').forEach(btn => btn.classList.remove('is-active'));
      brandTabBtn.classList.add('is-active');

      const selectedBrand = brandTabBtn.getAttribute('data-brand');
      const podCards = document.querySelectorAll('.device-pod-card');

      podCards.forEach(card => {
        const cardBrand = card.getAttribute('data-brand');
        if (selectedBrand === 'all' || cardBrand === selectedBrand) {
          card.style.display = 'flex';
          card.style.animation = 'slideUp 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    }
  });

  // Keyboard accessibility: Close drawer on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && cartDrawerOverlay && cartDrawerOverlay.classList.contains('is-active')) {
      closeCartDrawer();
    }
  });

  // -------------------------------------------------------------------------
  // 6. Live Search Flydown
  // -------------------------------------------------------------------------
  const searchInput = document.getElementById('searchInput');
  const searchFlydown = document.getElementById('searchFlydown');

  if (searchInput && searchFlydown) {
    searchInput.addEventListener('input', function () {
      const query = this.value.trim().toLowerCase();
      if (query.length > 1) {
        searchFlydown.classList.add('is-open');
      } else {
        searchFlydown.classList.remove('is-open');
      }
    });

    document.addEventListener('click', function (e) {
      if (!searchInput.contains(e.target) && !searchFlydown.contains(e.target)) {
        searchFlydown.classList.remove('is-open');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 7. Newsletter Form Submit Simulation
  // -------------------------------------------------------------------------
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      const btn = this.querySelector('button');
      if (emailInput && emailInput.value) {
        btn.disabled = true;
        btn.textContent = 'Subscribed!';
        btn.style.backgroundColor = 'var(--color-status-instock)';
        showToast('Thank you for subscribing to WizVape updates & deals!');
        setTimeout(() => {
          emailInput.value = '';
          btn.disabled = false;
          btn.textContent = 'Sign Up';
          btn.style.backgroundColor = '';
        }, 3000);
      }
    });
  }

  // Initial render on boot
  renderCart();

})();
