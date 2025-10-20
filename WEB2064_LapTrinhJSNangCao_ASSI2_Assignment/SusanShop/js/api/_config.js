export const API_BASE = 'http://localhost:3000/api';
export const endpoints = {
  categories: `${API_BASE}/categories`,
  products: `${API_BASE}/products`,
  variants: `${API_BASE}/product_variants`,
  users: `${API_BASE}/users`,
  orders: `${API_BASE}/orders`,
  orderDetails: `${API_BASE}/order_details`,
};
const j = (r)=>{ if(!r.ok) throw new Error('API error'); return r.json(); };
export const get = (url)=> fetch(url).then(j);
export const post = (url, body)=> fetch(url,{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)}).then(j);
export const put = (url, body)=> fetch(url,{method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)}).then(j);
export const del = (url)=> fetch(url,{method:'DELETE'}).then(j);
