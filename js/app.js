const CART_KEY = "nova_cart_v1";

const state = {
  filter: "todos",
  search: "",
  sort: "featured"
};

let cart = [];

const $ = (id) => document.getElementById(id);

const els = {
  header: $("header"),
  nav: $("siteNav"),
  navToggle: $("navToggle"),
  cartOpenBtn: $("cartOpenBtn"),
  cartCloseBtn: $("cartCloseBtn"),
  overlay: $("overlay"),
  drawer: $("cartDrawer"),
  cartItems: $("cartItems"),
  cartFooter: $("cartFooter"),
  cartCount: $("cartCount"),
  cartCountLabel: $("cartCountLabel"),
  cartTotal: $("cartTotal"),
  savingsRow: $("savingsRow"),
  savingsAmount: $("savingsAmount"),
  checkoutBtn: $("checkoutBtn"),
  continueBtn: $("continueBtn"),
  chips: $("chips"),
  searchInput: $("searchInput"),
  sortSelect: $("sortSelect"),
  grid: $("coursesGrid"),
  noResults: $("noResults"),
  toastContainer: $("toastContainer"),
  year: $("year")
};

const UI_ICONS = {
  plus:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  check:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  star:
    '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg>',
  clock:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  level:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/></svg>',
  users:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  cartBig:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
  toastSuccess:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
  toastInfo:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  toastError:
    '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>'
};

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const formatPrice = (n) => currency.format(n);

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;
    cart = parsed.filter((i) => COURSES.some((c) => c.id === i.id) && Number.isInteger(i.qty));
  } catch {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function isInCart(id) {
  return cart.some((i) => i.id === id);
}

function addToCart(id) {
  if (isInCart(id)) {
    showToast("Este curso ya está en tu carrito", "info");
    openCart();
    return;
  }
  cart.push({ id, qty: 1 });
  saveCart();
  updateCartUI();
  showToast("Curso agregado al carrito", "success");
  bumpBadge();
}

function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart();
  updateCartUI();
  showToast("Curso eliminado del carrito", "error");
}

function bumpBadge() {
  els.cartCount.classList.remove("bump");
  void els.cartCount.offsetWidth;
  els.cartCount.classList.add("bump");
}

function updateCartUI() {
  const count = cart.length;
  els.cartCount.hidden = count === 0;
  els.cartCount.textContent = count;
  els.cartCountLabel.textContent = count === 1 ? "1 curso" : `${count} cursos`;

  if (count === 0) {
    els.cartItems.innerHTML = `
      <div class="cart-empty">
        ${UI_ICONS.cartBig}
        <p>Tu carrito está vacío</p>
        <small>Agrega cursos para comenzar a aprender.</small>
        <button class="btn btn-outline" id="browseBtn">Explorar cursos</button>
      </div>`;
    els.cartFooter.style.display = "none";
    const browseBtn = document.getElementById("browseBtn");
    browseBtn.addEventListener("click", () => {
      closeCart();
      document.getElementById("cursos").scrollIntoView({ behavior: "smooth" });
    });
  } else {
    els.cartFooter.style.display = "";
    let total = 0;
    let savings = 0;
    els.cartItems.innerHTML = cart
      .map(({ id }) => {
        const c = COURSES.find((x) => x.id === id);
        total += c.price;
        if (c.oldPrice) savings += c.oldPrice - c.price;
        return `
        <div class="cart-item cat-${c.category}">
          <div class="cart-item-icon">${ICONS[c.category]}</div>
          <div class="cart-item-info">
            <p class="cart-item-title">${c.title}</p>
            <p class="cart-item-cat">${CATEGORY_META[c.category].short}</p>
            <div class="cart-item-row">
              <span class="cart-item-price">${formatPrice(c.price)}</span>
              <button class="cart-remove" data-remove="${c.id}">Eliminar</button>
            </div>
          </div>
        </div>`;
      })
      .join("");
    els.savingsRow.hidden = savings <= 0;
    els.savingsAmount.textContent = `-${formatPrice(savings)}`;
    els.cartTotal.textContent = formatPrice(total);
  }
  syncAddButtons();
}

function syncAddButtons() {
  document.querySelectorAll("[data-add]").forEach((btn) => {
    const added = isInCart(Number(btn.dataset.add));
    btn.classList.toggle("added", added);
    btn.innerHTML = added ? `${UI_ICONS.check}<span>En el carrito</span>` : `${UI_ICONS.plus}<span>Agregar</span>`;
  });
}

function openCart() {
  els.drawer.classList.remove("success");
  els.drawer.classList.add("open");
  els.overlay.classList.add("open");
  document.body.classList.add("no-scroll");
}

function closeCart() {
  els.drawer.classList.remove("open", "success");
  els.overlay.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

function checkout() {
  if (cart.length === 0) {
    showToast("Tu carrito está vacío", "info");
    return;
  }
  cart = [];
  saveCart();
  els.drawer.classList.add("success");
}

function showToast(message, type = "success") {
  const iconMap = { success: "toastSuccess", info: "toastInfo", error: "toastError" };
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `${UI_ICONS[iconMap[type]] || UI_ICONS.toastSuccess}<span>${message}</span>`;
  els.toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, 2600);
}

function getFilteredCourses() {
  let list = [...COURSES];
  if (state.filter !== "todos") {
    list = list.filter((c) => c.category === state.filter);
  }
  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        CATEGORY_META[c.category].label.toLowerCase().includes(q)
    );
  }
  switch (state.sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "popular":
      list.sort((a, b) => parseFloat(b.students) - parseFloat(a.students));
      break;
  }
  return list;
}

function renderCourses() {
  const list = getFilteredCourses();
  els.noResults.hidden = list.length > 0;
  els.grid.innerHTML = list
    .map(
      (c) => `
    <article class="course-card reveal cat-${c.category}">
      <div class="course-media">${ICONS[c.category]}</div>
      <div class="course-body">
        <div class="meta-top">
          <span class="cat-label">${CATEGORY_META[c.category].short}</span>
          <span class="rating">${UI_ICONS.star}${c.rating.toFixed(1)}</span>
        </div>
        <h3>${c.title}</h3>
        <p class="course-desc">${c.desc}</p>
        <ul class="course-meta">
          <li>${UI_ICONS.clock}${c.hours}h</li>
          <li>${UI_ICONS.level}${c.level}</li>
          <li>${UI_ICONS.users}${c.students}</li>
        </ul>
        <div class="course-foot">
          <div class="price">
            <strong>${formatPrice(c.price)}</strong>
            ${c.oldPrice ? `<s>${formatPrice(c.oldPrice)}</s>` : ""}
          </div>
          <button class="btn-add" data-add="${c.id}" aria-label="Agregar ${c.title} al carrito"></button>
        </div>
      </div>
    </article>`
    )
    .join("");
  observeReveals(els.grid.querySelectorAll(".reveal"));
  syncAddButtons();
}

function renderChips() {
  els.chips.innerHTML = FILTERS.map(
    (f) => `<button class="chip${f.id === state.filter ? " active" : ""}" data-filter="${f.id}">${f.label}</button>`
  ).join("");
}

const revealObserver =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 }
      )
    : null;

function observeReveals(nodes) {
  nodes.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    if (revealObserver) {
      revealObserver.observe(el);
    } else {
      el.classList.add("visible");
    }
  });
}

function toggleMenu(force) {
  const open = force !== undefined ? force : !els.nav.classList.contains("open");
  els.nav.classList.toggle("open", open);
  els.navToggle.classList.toggle("active", open);
  els.navToggle.setAttribute("aria-expanded", String(open));
}

function bindEvents() {
  window.addEventListener("scroll", () => {
    els.header.classList.toggle("scrolled", window.scrollY > 8);
  });

  els.navToggle.addEventListener("click", () => toggleMenu());
  els.nav.addEventListener("click", (e) => {
    if (e.target.closest(".nav-link")) toggleMenu(false);
  });

  els.chips.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-filter]");
    if (!chip) return;
    state.filter = chip.dataset.filter;
    renderChips();
    renderCourses();
  });

  els.searchInput.addEventListener("input", (e) => {
    state.search = e.target.value.toLowerCase().trim();
    renderCourses();
  });

  els.sortSelect.addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderCourses();
  });

  els.grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (btn && !btn.classList.contains("added")) addToCart(Number(btn.dataset.add));
  });

  els.cartItems.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove]");
    if (btn) removeFromCart(Number(btn.dataset.remove));
  });

  els.cartOpenBtn.addEventListener("click", openCart);
  els.cartCloseBtn.addEventListener("click", closeCart);
  els.overlay.addEventListener("click", closeCart);
  els.checkoutBtn.addEventListener("click", checkout);
  els.continueBtn.addEventListener("click", () => {
    closeCart();
    document.getElementById("cursos").scrollIntoView({ behavior: "smooth" });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (els.drawer.classList.contains("open")) closeCart();
      else if (els.nav.classList.contains("open")) toggleMenu(false);
    }
  });
}

function init() {
  els.year.textContent = new Date().getFullYear();
  renderChips();
  renderCourses();
  loadCart();
  updateCartUI();
  observeReveals(document.querySelectorAll(".section-head.reveal, .hero-content.reveal, .hero-visual.reveal, .benefit-card.reveal, .cta-band.reveal"));
  bindEvents();
}

init();
