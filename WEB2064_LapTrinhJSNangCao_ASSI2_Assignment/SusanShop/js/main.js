import { CategoryAPI } from "./api/categories.js";
import { ProductAPI, VariantAPI } from "./api/products.js";
import { $, fmtVND, qs } from "./utils.js";

async function loadCategories(selectEl) {
  const categories = await CategoryAPI.list();
  if (selectEl) {
    const options = ["<option value=''>Tat ca danh muc</option>", ...categories.map((c) => `<option value="${c.id}">${c.name}</option>`)].join("");
    selectEl.innerHTML = options;
  } else {
    const nav = document.getElementById("catNav");
    if (nav) {
      nav.innerHTML = categories
        .map((c) => `<a class="btn btn-sm btn-outline-secondary me-2 mb-2" href="products.html?cate=${c.id}">${c.name}</a>`)
        .join("");
    }
  }
}

async function renderProducts(container, { cate, min, max, limit = 20 } = {}) {
  const params = new URLSearchParams();
  if (cate) params.set("cate_id", cate);
  if (limit) params.set("_limit", limit);
  if (min) params.set("price_gte", min);
  if (max) params.set("price_lte", max);

  const products = await ProductAPI.list(params.toString());
  const cards = await Promise.all(
    products.map(async (product) => {
      const variants = await VariantAPI.byProduct(product.id);
      const prices = variants.map((variant) => Number(variant.price));
      const minPrice = prices.length ? Math.min(...prices) : null;
      const priceText = Number.isFinite(minPrice) ? fmtVND(minPrice) : "Lien he";
      return `
        <div class="card product-card">
          <img src="${product.image || ""}" alt="${product.name}" onerror="this.src='https://placehold.co/600x400?text=No+Image'"/>
          <div class="p-2">
            <div class="small text-muted">#${product.id} - <span class="badge">${variants.length || 0} phien ban</span></div>
            <h6 class="mt-1 mb-2">${product.name}</h6>
            <div class="price mb-2">${priceText}</div>
            <a class="btn btn-sm btn-primary w-100" href="product-detail.html?id=${product.id}">Xem chi tiet</a>
          </div>
        </div>`;
    })
  );

  container.innerHTML = `<div class="grid grid-4">${cards.join("")}</div>`;
}

export async function initHome() {
  await loadCategories();
  const wrap = document.getElementById("homeProducts");
  if (wrap) renderProducts(wrap, { limit: 8 });
}

export async function initProductsPage() {
  const cate = qs("cate") || "";
  const select = document.getElementById("cateSelect");
  await loadCategories(select);
  if (cate) select.value = cate;

  const min = document.getElementById("min");
  const max = document.getElementById("max");
  const listWrap = document.getElementById("listProducts");

  const refresh = () => renderProducts(listWrap, { cate: select.value, min: min.value, max: max.value });
  document.getElementById("filterBtn").addEventListener("click", refresh);
  await refresh();
}

export async function initProductDetail() {
  const id = qs("id");
  if (!id) return;

  let product;
  try {
    product = await ProductAPI.get(id);
  } catch (error) {
    console.error("Cannot load product", error);
    return;
  }

  const variants = await VariantAPI.byProduct(id);
  const productName = product.name || "San pham";
  const productDetailText = (product.detail && product.detail.trim()) || "Thong tin dang cap nhat.";
  const productImage = product.image || "https://placehold.co/600x400?text=No+Image";

  const nameEl = document.getElementById("pName");
  if (nameEl) nameEl.textContent = productName;
  document.querySelectorAll("[data-product-name]").forEach((el) => {
    el.textContent = productName;
  });

  const imgEl = document.getElementById("pImage");
  if (imgEl) {
    imgEl.src = productImage;
    imgEl.alt = productName || "Dien thoai Susan Shop";
  }

  const detailEl = document.getElementById("pDetail");
  if (detailEl) detailEl.textContent = productDetailText;
  document.querySelectorAll("[data-product-detail]").forEach((el) => {
    el.textContent = productDetailText;
  });

  const variantSelect = document.getElementById("variant");
  if (variantSelect) {
    if (variants.length) {
      const options = ["<option value=''>Chon phien ban</option>", ...variants.map(
        (variant) => `<option value='${variant.id}'>${variant.variant_name} - ${fmtVND(variant.price)} (con ${variant.quantity})</option>`
      )].join("");
      variantSelect.innerHTML = options;
      variantSelect.disabled = false;
    } else {
      variantSelect.innerHTML = "<option value=''>Hien chua co phien ban</option>";
      variantSelect.disabled = true;
    }
  }
}