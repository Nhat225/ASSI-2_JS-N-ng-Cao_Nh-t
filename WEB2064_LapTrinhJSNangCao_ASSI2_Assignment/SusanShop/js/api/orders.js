import { endpoints, get, post, put, del } from './_config.js';
export const OrderAPI = {
  list(params=''){ return get(`${endpoints.orders}${params?`?${params}`:''}`); },
  get(id){ return get(`${endpoints.orders}/${id}`); },
  create(data){ return post(endpoints.orders, data); },
  update(id,data){ return put(`${endpoints.orders}/${id}`, data); },
  remove(id){ return del(`${endpoints.orders}/${id}`); },
};
export const OrderDetailAPI = {
  byOrder(order_id){ return get(`${endpoints.orderDetails}?order_id=${order_id}`); },
  create(data){ return post(endpoints.orderDetails, data); },
};
