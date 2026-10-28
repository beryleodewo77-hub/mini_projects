// ===== Product data (in-file catalog) =====
const PRODUCTS = [
  { id: 1, name: 'Wireless Noise-Cancelling Headphones', description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and plush memory foam ear cups for all-day comfort.', price: 299.99, image: 'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Audio', rating: 4.8, stock: 45 },
  { id: 2, name: 'Smart Watch Series 7', description: 'Track your fitness, monitor your heart rate, and stay connected with notifications on your wrist. Water-resistant up to 50m.', price: 249.99, image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Wearables', rating: 4.6, stock: 80 },
  { id: 3, name: 'Mechanical Gaming Keyboard', description: 'Hot-swappable mechanical keyboard with RGB backlighting, aluminum frame, and tactile blue switches for a satisfying typing experience.', price: 129.99, image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Accessories', rating: 4.7, stock: 120 },
  { id: 4, name: 'Wireless Charging Pad', description: 'Fast 15W wireless charging pad with a sleek minimalist design. Compatible with all Qi-enabled devices.', price: 39.99, image: 'https://images.pexels.com/photos/4526473/pexels-photo-4526473.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Accessories', rating: 4.3, stock: 200 },
  { id: 5, name: '4K Action Camera', description: 'Waterproof 4K action camera with image stabilization, voice control, and a 2-inch touchscreen. Includes mounting accessories.', price: 199.99, image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Cameras', rating: 4.5, stock: 35 },
  { id: 6, name: 'Bluetooth Portable Speaker', description: 'Compact waterproof speaker with 360-degree sound, 20-hour battery, and deep bass. Perfect for outdoor adventures.', price: 79.99, image: 'https://images.pexels.com/photos/1666320/pexels-photo-1666320.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Audio', rating: 4.4, stock: 150 },
  { id: 7, name: 'Ergonomic Office Chair', description: 'Breathable mesh back office chair with adjustable lumbar support, armrests, and seat height. Built for 8-hour comfort.', price: 349.99, image: 'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Furniture', rating: 4.6, stock: 25 },
  { id: 8, name: 'USB-C Hub 7-in-1', description: 'Expand your laptop connectivity with HDMI, USB 3.0 ports, SD card reader, and 100W power delivery pass-through.', price: 59.99, image: 'https://images.pexels.com/photos/2528118/pexels-photo-2528118.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Accessories', rating: 4.2, stock: 300 },
  { id: 9, name: 'Smart Home Security Camera', description: '1080p indoor security camera with night vision, motion detection, two-way audio, and cloud storage options.', price: 89.99, image: 'https://images.pexels.com/photos/2889447/pexels-photo-2889447.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Smart Home', rating: 4.3, stock: 90 },
  { id: 10, name: 'Fitness Tracker Band', description: 'Slim fitness band with heart rate monitoring, sleep tracking, 14-day battery life, and water resistance.', price: 69.99, image: 'https://images.pexels.com/photos/4498482/pexels-photo-4498482.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Wearables', rating: 4.1, stock: 175 },
  { id: 11, name: 'Wireless Earbuds Pro', description: 'True wireless earbuds with active noise cancellation, transparency mode, and wireless charging case. Up to 24h total battery.', price: 179.99, image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Audio', rating: 4.7, stock: 110 },
  { id: 12, name: 'Drone with 4K Camera', description: 'Compact foldable drone with 4K video, 3-axis gimbal stabilization, 30-minute flight time, and intelligent flight modes.', price: 499.99, image: 'https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg?auto=compress&cs=tinysrgb&w=800', category: 'Cameras', rating: 4.5, stock: 15 },
];

const CATEGORIES = ['All', 'Audio', 'Wearables', 'Accessories', 'Cameras', 'Smart Home', 'Furniture'];

// ===== State =====
let cart = [];
let activeCategory = 'All';
let searchQuery = '';

// ===== DOM helpers =====
const $ = (sel) => document.querySelector(sel);
const createEl = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
};

const formatPrice = (n) => '$' + n.toFixed(2);

// SVG icons
const ICON_STAR = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
const ICON_PLUS = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';
const ICON_CHECK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
const ICON_MINUS = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/></svg>';
const ICON_TRASH = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
const ICON_BAG = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';

// ===== Category filters =====
function renderCategories() {
  const container = $('#category-filters');
  container.innerHTML = '';
  CATEGORIES.forEach((cat) => {
    const btn = createEl('button', 'cat-btn' + (cat === activeCategory ? ' active' : ''), cat);
    btn.addEventListener('click', () => {
      activeCategory = cat;
      renderCategories();
      renderProducts();
    });
    container.appendChild(btn);
  });
}

// ===== Product grid =====
function getFilteredProducts() {
  let filtered = PRODUCTS;
  if (activeCategory !== 'All') {
    filtered = filtered.filter((p) => p.category === activeCategory);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }
  return filtered;
}

function renderProducts() {
  const grid = $('#product-grid');
  const products = getFilteredProducts();

  if (products.length === 0) {
    grid.innerHTML = '<div class="empty-state">No products found. Try a different search or category.</div>';
    return;
  }

  grid.innerHTML = '';
  products.forEach((product) => {
    const card = createEl('div', 'product-card');

    // Image
    const imgWrapper = createEl('div', 'product-image-wrapper');
    const img = createEl('img');
    img.src = product.image;
    img.alt = product.name;
    img.loading = 'lazy';
    imgWrapper.appendChild(img);

    const catTag = createEl('span', 'product-category-tag', product.category);
    imgWrapper.appendChild(catTag);

    if (product.stock === 0) {
      const tag = createEl('span', 'stock-tag out', 'Sold out');
      imgWrapper.appendChild(tag);
    } else if (product.stock < 20) {
      const tag = createEl('span', 'stock-tag low', 'Only ' + product.stock + ' left');
      imgWrapper.appendChild(tag);
    }

    card.appendChild(imgWrapper);

    // Body
    const body = createEl('div', 'product-body');

    const rating = createEl('div', 'product-rating');
    rating.innerHTML = ICON_STAR + '<span>' + product.rating.toFixed(1) + '</span>';
    body.appendChild(rating);

    const name = createEl('h3', 'product-name', product.name);
    body.appendChild(name);

    const desc = createEl('p', 'product-desc', product.description);
    body.appendChild(desc);

    const footer = createEl('div', 'product-footer');
    const price = createEl('span', 'product-price', formatPrice(product.price));
    footer.appendChild(price);

    const addBtn = createEl('button', 'add-btn');
    addBtn.innerHTML = ICON_PLUS + ' Add';
    if (product.stock === 0) {
      addBtn.disabled = true;
      addBtn.textContent = 'Sold out';
    } else {
      addBtn.addEventListener('click', () => {
        addToCart(product);
        addBtn.classList.add('added');
        addBtn.innerHTML = ICON_CHECK + ' Added';
        setTimeout(() => {
          addBtn.classList.remove('added');
          addBtn.innerHTML = ICON_PLUS + ' Add';
        }, 1200);
      });
    }
    footer.appendChild(addBtn);
    body.appendChild(footer);
    card.appendChild(body);

    grid.appendChild(card);
  });
}

// ===== Cart =====
function addToCart(product) {
  const existing = cart.find((i) => i.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  updateCartUI();
}

function updateQuantity(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity < 1) {
    removeFromCart(id);
    return;
  }
  updateCartUI();
}

function getCartTotal() {
  return cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

function getCartCount() {
  return cart.reduce((sum, i) => sum + i.quantity, 0);
}

function updateCartUI() {
  const count = getCartCount();
  const badge = $('#cart-badge');
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';

  const countLabel = $('#cart-count-label');
  countLabel.textContent = count > 0 ? '(' + count + ')' : '';

  const itemsContainer = $('#cart-items');
  const footer = $('#cart-footer');

  if (cart.length === 0) {
    itemsContainer.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">' + ICON_BAG + '</div><p>Your cart is empty.</p></div>';
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  itemsContainer.innerHTML = '';

  cart.forEach((item) => {
    const el = createEl('div', 'cart-item');

    const img = createEl('img');
    img.src = item.image;
    img.alt = item.name;
    el.appendChild(img);

    const info = createEl('div', 'cart-item-info');

    const top = createEl('div', 'cart-item-top');
    const name = createEl('span', 'cart-item-name', item.name);
    const removeBtn = createEl('button', 'remove-btn');
    removeBtn.innerHTML = ICON_TRASH;
    removeBtn.addEventListener('click', () => removeFromCart(item.id));
    top.appendChild(name);
    top.appendChild(removeBtn);
    info.appendChild(top);

    info.appendChild(createEl('span', 'cart-item-price', formatPrice(item.price)));

    const bottom = createEl('div', 'cart-item-bottom');
    const qtyControl = createEl('div', 'qty-control');

    const minusBtn = createEl('button', 'qty-btn');
    minusBtn.innerHTML = ICON_MINUS;
    minusBtn.addEventListener('click', () => updateQuantity(item.id, -1));

    const qtyValue = createEl('span', 'qty-value', item.quantity);

    const plusBtn = createEl('button', 'qty-btn');
    plusBtn.innerHTML = ICON_PLUS.replace('width="16"', 'width="12"').replace('height="16"', 'height="12"');
    plusBtn.addEventListener('click', () => updateQuantity(item.id, 1));

    qtyControl.appendChild(minusBtn);
    qtyControl.appendChild(qtyValue);
    qtyControl.appendChild(plusBtn);

    const total = createEl('span', 'cart-item-total', formatPrice(item.price * item.quantity));

    bottom.appendChild(qtyControl);
    bottom.appendChild(total);
    info.appendChild(bottom);
    el.appendChild(info);

    itemsContainer.appendChild(el);
  });

  $('#cart-subtotal-amount').textContent = formatPrice(getCartTotal());
}

// ===== Cart drawer open/close =====
function openCart() {
  $('#cart-backdrop').classList.add('open');
  $('#cart-drawer').classList.add('open');
}

function closeCart() {
  $('#cart-backdrop').classList.remove('open');
  $('#cart-drawer').classList.remove('open');
}

// ===== Checkout =====
function openCheckout() {
  if (cart.length === 0) return;
  closeCart();
  renderCheckoutSummary();
  $('#checkout-form-view').style.display = 'block';
  $('#checkout-success-view').style.display = 'none';
  $('#checkout-modal').style.display = 'flex';
}

function closeCheckout() {
  $('#checkout-modal').style.display = 'none';
}

function renderCheckoutSummary() {
  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const summary = $('#checkout-summary');
  summary.innerHTML = '';
  summary.appendChild(makeSummaryLine('Subtotal', formatPrice(subtotal)));
  summary.appendChild(makeSummaryLine('Shipping', shipping === 0 ? 'Free' : formatPrice(shipping)));
  summary.appendChild(makeSummaryLine('Tax (8%)', formatPrice(tax)));
  const totalLine = makeSummaryLine('Total', formatPrice(total));
  totalLine.classList.add('total');
  summary.appendChild(totalLine);

  $('#place-order-btn').textContent = 'Place Order — ' + formatPrice(total);
}

function makeSummaryLine(label, value) {
  const line = createEl('div', 'summary-line');
  line.appendChild(createEl('span', null, label));
  line.appendChild(createEl('span', null, value));
  return line;
}

function handleCheckoutSubmit(e) {
  e.preventDefault();
  const btn = $('#place-order-btn');
  btn.disabled = true;
  btn.textContent = 'Processing...';

  setTimeout(() => {
    cart = [];
    updateCartUI();
    $('#checkout-form-view').style.display = 'none';
    $('#checkout-success-view').style.display = 'block';
    btn.disabled = false;
    $('#checkout-form').reset();
  }, 1500);
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderProducts();
  updateCartUI();

  $('#cart-btn').addEventListener('click', openCart);
  $('#cart-close').addEventListener('click', closeCart);
  $('#cart-backdrop').addEventListener('click', closeCart);
  $('#checkout-btn').addEventListener('click', openCheckout);
  $('#checkout-close').addEventListener('click', closeCheckout);
  $('#success-close').addEventListener('click', closeCheckout);
  $('#checkout-form').addEventListener('submit', handleCheckoutSubmit);

  $('#search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderProducts();
  });

  // Close modal on overlay click
  $('#checkout-modal').addEventListener('click', (e) => {
    if (e.target.id === 'checkout-modal') closeCheckout();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      closeCheckout();
    }
  });
});
