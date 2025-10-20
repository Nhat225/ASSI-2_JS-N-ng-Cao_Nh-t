import { endpoints, get, post, put, del } from './_config.js';
export const CategoryAPI = {
  list(){ return get(endpoints.categories); },
  get(id){ return get(`${endpoints.categories}/${id}`); },
  create(data){ return post(endpoints.categories, data); },
  update(id,data){ return put(`${endpoints.categories}/${id}`, data); },
  remove(id){ return del(`${endpoints.categories}/${id}`); },
};
