document.addEventListener("DOMContentLoaded", function () {
  // ============================================================
  // 1. MEGA MENU LOGGING
  // ============================================================
  document.querySelectorAll(".dropdown-menu a").forEach((link) => {
    link.addEventListener("click", function (e) {
      if (this.getAttribute("href") === "#") {
        e.preventDefault();
        console.log("آیتم دمو کلیک شد: " + this.textContent.trim());
      }
    });
  });

  // ============================================================
  // 2. SWIPER SLIDERS
  // ============================================================
  if (document.querySelector(".myProductsSwiper")) {
    new Swiper(".myProductsSwiper", {
      navigation: { nextEl: ".swiper-next", prevEl: ".swiper-prev" },
      slidesPerView: "auto",
      spaceBetween: 0,
    });
  }
  if (document.querySelector(".myProductsSwiper1")) {
    new Swiper(".myProductsSwiper1", {
      navigation: { nextEl: ".swiper-next-1", prevEl: ".swiper-prev-1" },
      slidesPerView: "auto",
      spaceBetween: 0,
    });
  }
  if (document.querySelector(".myProductsSwiper-classic")) {
    new Swiper(".myProductsSwiper-classic", {
      navigation: {
        nextEl: ".swiper-next-classic",
        prevEl: ".swiper-prev-classic",
      },
      slidesPerView: "auto",
      spaceBetween: 0,
    });
  }
  if (document.querySelector(".myTestimonialSwiper")) {
    new Swiper(".myTestimonialSwiper", {
      slidesPerView: "auto",
      spaceBetween: 20,
      loop: false,
      autoplay: { delay: 3500, disableOnInteraction: false },
      breakpoints: {
        0: { slidesPerView: 1, spaceBetween: 10 },
        768: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 20 },
      },
      navigation: { nextEl: ".swiper-next-cm", prevEl: ".swiper-prev-cm" },
    });
  }

  // ============================================================
  // 3. SHOPPING CART
  // ============================================================
  let cart = [];
  const cartBadge = document.querySelector(".cart-badge");
  const cartItemsContainer = document.getElementById("cartItems");

  if (!cartBadge || !cartItemsContainer) {
    console.error("Cart elements not found – check HTML");
    return;
  }

  function renderCart() {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<p class="text-muted text-center mb-0">سبد خرید خالی است</p>';
      cartBadge.textContent = "0";
      return;
    }

    let html = "";
    let total = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      html += `
        <div class="d-flex align-items-center gap-2 mb-2 pb-2 border-bottom" data-index="${index}">
          <img src="${item.image}" alt="${item.name}" style="width:40px;height:40px;object-fit:cover;border-radius:6px;">
          <div class="flex-grow-1">
            <div class="fw-bold" style="font-size:14px;">${item.name}</div>
            <div class="text-warning" style="font-size:13px;">${item.price.toLocaleString()} تومان</div>
          </div>
          <div class="d-flex align-items-center gap-1">
            <button class="btn btn-sm btn-outline-secondary qty-dec" data-index="${index}">−</button>
            <span style="min-width:24px;text-align:center;">${item.quantity}</span>
            <button class="btn btn-sm btn-outline-secondary qty-inc" data-index="${index}">+</button>
            <button class="btn btn-sm btn-danger remove-item" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </div>
      `;
    });

    html += `
      <div class="d-flex justify-content-between align-items-center mt-2 pt-2">
        <strong>جمع کل:</strong>
        <span class="text-warning fw-bold">${total.toLocaleString()} تومان</span>
      </div>
      <div class="d-grid mt-3">
        <a href="#" class="btn btn-warning">پرداخت</a>
      </div>
    `;

    cartItemsContainer.innerHTML = html;
    cartBadge.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);

    cartItemsContainer.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", function () {
        removeFromCart(parseInt(this.dataset.index));
      });
    });
    cartItemsContainer.querySelectorAll(".qty-inc").forEach((btn) => {
      btn.addEventListener("click", function () {
        changeQuantity(parseInt(this.dataset.index), 1);
      });
    });
    cartItemsContainer.querySelectorAll(".qty-dec").forEach((btn) => {
      btn.addEventListener("click", function () {
        changeQuantity(parseInt(this.dataset.index), -1);
      });
    });
  }

  function addToCart(name, price, image) {
    const existing = cart.find(
      (item) => item.name === name && item.price === price,
    );
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: Date.now() + Math.random(),
        name,
        price,
        image,
        quantity: 1,
      });
    }
    renderCart();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
  }

  function changeQuantity(index, delta) {
    if (cart[index]) {
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
      renderCart();
    }
  }

  // Attach "Add to Cart" buttons
  document.querySelectorAll(".nav-btn.bg-warning a").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const productCard = this.closest(".products");
      if (!productCard) return;
      const img = productCard.querySelector(".pr-img img");
      const image = img ? img.src : "";
      const priceEl = productCard.querySelector(".pr-text .price");
      const nameEl = productCard.querySelector(".pr-text p");
      if (!priceEl || !nameEl) return;
      const priceText = priceEl.textContent.replace(/[^\d]/g, "");
      const price = parseInt(priceText, 10);
      const name = nameEl.textContent.trim();
      if (isNaN(price) || !name) return;
      addToCart(name, price, image);
      const originalText = this.textContent;
      this.textContent = "✓ اضافه شد";
      setTimeout(() => {
        this.textContent = originalText;
      }, 1000);
    });
  });

  renderCart();

  // ============================================================
  // 4. NEWSLETTER FORM
  // ============================================================
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = this.querySelector('input[type="email"]');
      const btn = this.querySelector("button");
      if (!input.value.trim()) return;
      this.classList.add("subscribed");
      input.value = "با تشکر، کد تخفیف برای شما ارسال شد";
      input.disabled = true;
      btn.textContent = "ثبت شد";
      btn.disabled = true;
    });
  }

  // ============================================================
  // 5. SAVE PRODUCTS TO LOCALSTORAGE (برای صفحات دیگر)
  // ============================================================
  function saveProductsToStorage() {
    const products = [];
    document.querySelectorAll(".products").forEach((card) => {
      const wrapper = card.closest(".product-wrapper-item");
      const img = card.querySelector(".pr-img img");
      const priceEl = card.querySelector(".pr-text .price");
      const nameEl = card.querySelector(".pr-text p");
      if (img && priceEl && nameEl) {
        const priceText = priceEl.textContent.replace(/[^\d]/g, "");
        const price = parseInt(priceText, 10);
        products.push({
          name: nameEl.textContent.trim(),
          price: price,
          priceDisplay: priceEl.textContent.trim(),
          image: img.src,
          category: wrapper ? wrapper.dataset.category || "general" : "general",
          date: wrapper
            ? wrapper.dataset.date || new Date().toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          mostSold: wrapper ? parseInt(wrapper.dataset.mostSold) || 0 : 0,
          favorites: wrapper ? parseInt(wrapper.dataset.favorites) || 0 : 0,
        });
      }
    });
    localStorage.setItem("lusterProducts", JSON.stringify(products));
    console.log("✅ محصولات در localStorage ذخیره شدند:", products.length);
  }
  saveProductsToStorage(); // ذخیره اولیه

  // ============================================================
  // 6. SEARCH FUNCTIONALITY – با هدایت به صفحه جستجو
  // ============================================================
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const resultsContainer = document.getElementById("searchResults");

  // تابع هدایت به صفحه جستجو با پارامتر جستجو
  function redirectToSearchPage(query) {
    const trimmed = query.trim();
    if (!trimmed) return;
    // ✅ CORRECT: using the right file name (search-result.html with "e")
    window.location.href = `/products-category/search-result.html?search=${encodeURIComponent(trimmed)}`;
  }

  // (اختیاری) نمایش نتایج در dropdown هنگام تایپ
  function getAllProducts() {
    const products = [];
    document.querySelectorAll(".products").forEach((card) => {
      const img = card.querySelector(".pr-img img");
      const priceEl = card.querySelector(".pr-text .price");
      const nameEl = card.querySelector(".pr-text p");
      if (img && priceEl && nameEl) {
        const priceText = priceEl.textContent.replace(/[^\d]/g, "");
        const price = parseInt(priceText, 10);
        products.push({
          name: nameEl.textContent.trim(),
          price: price,
          priceDisplay: priceEl.textContent.trim(),
          image: img.src,
          element: card,
        });
      }
    });
    return products;
  }

  const allProducts = getAllProducts();

  function renderSearchResults(query, container) {
    if (!container) return;
    if (!query.trim()) {
      container.style.display = "none";
      return;
    }
    const lowerQuery = query.trim().toLowerCase();
    const results = allProducts.filter((p) =>
      p.name.toLowerCase().includes(lowerQuery),
    );
    if (results.length === 0) {
      container.innerHTML = `<div class="empty-state">هیچ محصولی یافت نشد</div>`;
      container.style.display = "block";
      return;
    }
    let html = "";
    results.forEach((p) => {
      html += `
        <div class="result-item" data-name="${p.name}" data-price="${p.price}" data-image="${p.image}">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          <div class="info">
            <div class="name">${p.name}</div>
            <div class="price">${p.priceDisplay}</div>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
    container.style.display = "block";

    container.querySelectorAll(".result-item").forEach((item) => {
      item.addEventListener("click", function () {
        const name = this.dataset.name;
        const price = parseInt(this.dataset.price, 10);
        const image = this.dataset.image;
        addToCart(name, price, image);
        container.style.display = "none";
        const inputs = document.querySelectorAll(
          "#searchInput, #mobileSearchInput",
        );
        inputs.forEach((inp) => {
          inp.value = "";
        });
      });
    });
  }

  // اتصال رویدادها
  if (searchInput) {
    // هنگام تایپ، dropdown را به‌روز کن (اختیاری)
    let debounceTimer;
    searchInput.addEventListener("input", function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        renderSearchResults(this.value, resultsContainer);
      }, 300);
    });

    // هنگام فشردن Enter → هدایت به صفحه جستجو
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        redirectToSearchPage(this.value);
      }
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", function () {
      if (searchInput) {
        redirectToSearchPage(searchInput.value);
      }
    });
  }

  // بستن نتایج با Escape یا کلیک خارج
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && resultsContainer) {
      resultsContainer.style.display = "none";
    }
  });
  document.addEventListener("click", function (e) {
    if (resultsContainer && !e.target.closest(".position-relative")) {
      resultsContainer.style.display = "none";
    }
  });

  // Mobile search (همانند دسکتاپ)
  const mobileSearchInput = document.getElementById("mobileSearchInput");
  const mobileResultsContainer = document.getElementById("mobileSearchResults");
  if (mobileSearchInput && mobileResultsContainer) {
    let mobileTimer;
    mobileSearchInput.addEventListener("input", function () {
      clearTimeout(mobileTimer);
      mobileTimer = setTimeout(() => {
        renderSearchResults(this.value, mobileResultsContainer);
      }, 300);
    });
    mobileSearchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        redirectToSearchPage(this.value);
      }
    });
  }
});
