import { OrderAPI, OrderDetailAPI } from './api/orders.js';
import { ProductAPI, VariantAPI } from './api/products.js';
import { $, fmtVND, toast } from './utils.js';

const LS_CART = 'susan_cart';

export const Cart = {
  get(){
    try{
      return JSON.parse(localStorage.getItem(LS_CART)) || [];
    }catch{
      return [];
    }
  },
  set(items){
    localStorage.setItem(LS_CART, JSON.stringify(items || []));
  },
  add(item){
    const cart = this.get();
    const idx = cart.findIndex(x => x.variant_id === item.variant_id);
    if(idx > -1){
      cart[idx].qty += item.qty;
      cart[idx].price = item.price;
      cart[idx].title = item.title || cart[idx].title;
      cart[idx].variant_label = item.variant_label || cart[idx].variant_label;
      cart[idx].name = item.name || cart[idx].name;
    }else{
      cart.push({
        variant_id: item.variant_id,
        product_id: item.product_id,
        title: item.title || item.name || 'Sản phẩm',
        variant_label: item.variant_label || item.name || '',
        price: item.price,
        qty: item.qty,
        name: item.name || item.variant_label || ''
      });
    }
    this.set(cart);
  },
  remove(variant_id){
    this.set(this.get().filter(x => x.variant_id !== variant_id));
  },
  removeProduct(product_id){
    this.set(this.get().filter(x => x.product_id !== product_id));
  },
  clear(){ this.set([]); },
  total(){
    return this.get().reduce((sum, item) => sum + item.price * item.qty, 0);
  }
};

export async function bindAddToCart(){
  const btn = $('#btnAddToCart');
  if(!btn) return;
  btn.addEventListener('click', async ()=>{
    const variantId = Number($('#variant').value);
    if(!variantId){ toast('Vui lòng chọn phiên bản'); return; }
    const qty = Number($('#qty').value || 1);
    const variant = (await VariantAPI.list(`id=${variantId}`))[0];
    if(!variant) return toast('Không tìm thấy phiên bản');

    let productName = '';
    try{
      const product = await ProductAPI.get(variant.product_id);
      productName = product?.name || '';
    }catch{}

    Cart.add({
      variant_id: variant.id,
      product_id: variant.product_id,
      title: productName,
      variant_label: variant.variant_name,
      price: variant.price,
      qty
    });
    toast('Đã thêm vào giỏ hàng');
  });
}

export function renderCart(){
  const wrap = $('#cartBody');
  if(!wrap) return;
  const items = Cart.get();
  if(!items.length){
    wrap.innerHTML = '<p>Giỏ hàng trống.</p>';
    const checkoutBtn = $('#checkoutBtn');
    if(checkoutBtn) checkoutBtn.disabled = true;
    $('#total').textContent = fmtVND(0);
    return;
  }

  const checkoutBtn = $('#checkoutBtn');
  if(checkoutBtn) checkoutBtn.disabled = false;

  wrap.innerHTML = items.map(item => {
    const title = item.title || item.name || 'Sản phẩm';
    const variant = item.variant_label || '';
    const showVariant = variant && variant !== title;
    return `
      <div class="cart-line">
        <div class="cart-line-info">
          <span class="cart-line-title">${title}</span>
          ${showVariant ? `<span class="cart-line-variant">${variant}</span>` : ''}
          <span class="cart-line-price">${fmtVND(item.price)}</span>
        </div>
        <div class="cart-line-actions">
          <input type="number" class="form-control form-control-sm" value="${item.qty}" data-id="${item.variant_id}" min="1"/>
          <button class="btn btn-sm btn-outline-danger" data-remove-product="${item.product_id}">Xóa</button>
        </div>
      </div>`;
  }).join('');

  $('#total').textContent = fmtVND(Cart.total());
  wrap.querySelectorAll('input[data-id]').forEach(input=>{
    input.addEventListener('change', ()=>{
      const id = Number(input.dataset.id);
      if(!id) return;
      const cart = Cart.get();
      const idx = cart.findIndex(x => x.variant_id === id);
      if(idx > -1){
        cart[idx].qty = Math.max(1, Number(input.value || 1));
        Cart.set(cart);
        $('#total').textContent = fmtVND(Cart.total());
      }
    });
  });

  wrap.querySelectorAll('button[data-remove-product]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const productId = Number(btn.dataset.removeProduct);
      if(!productId) return;
      Cart.removeProduct(productId);
      renderCart();
    });
  });
}

export async function bindCheckout(){
  const btn = $('#checkoutBtn');
  if(!btn) return;
  btn.addEventListener('click', async ()=>{
    const items = Cart.get();
    if(!items.length) return toast('Giỏ hàng trống');
    try{
      const order = await OrderAPI.create({
        user_id: 2,
        created_date: new Date().toISOString(),
        status: 'pending',
        total: Cart.total()
      });
      for(const it of items){
        await OrderDetailAPI.create({
          order_id: order.id,
          product_id: it.product_id,
          quantity: it.qty,
          unit_price: it.price
        });
      }
      Cart.clear();
      location.href = 'thank-you.html?order=' + order.id;
    }catch(err){
      toast('Thanh toán thất bại');
    }
  });
}
