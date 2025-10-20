import { endpoints, get, post, put, del } from './_config.js';
export const ProductAPI = {
  list(params=''){ return get(`${endpoints.products}${params?`?${params}`:''}`); },
  get(id){ return get(`${endpoints.products}/${id}`); },
  create(data){ return post(endpoints.products, data); },
  update(id,data){ return put(`${endpoints.products}/${id}`, data); },
  remove(id){ return del(`${endpoints.products}/${id}`); },
};
export const VariantAPI = {
  list(params=''){ return get(`${endpoints.variants}${params?`?${params}`:''}`); },
  byProduct(product_id){ return get(`${endpoints.variants}?product_id=${product_id}`); },
  create(data){ return post(endpoints.variants, data); },
  update(id,data){ return put(`${endpoints.variants}/${id}`, data); },
  remove(id){ return del(`${endpoints.variants}/${id}`); },
};
