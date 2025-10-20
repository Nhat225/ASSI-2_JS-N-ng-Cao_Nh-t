import { endpoints, get, post, put, del } from './_config.js';
export const UserAPI = {
  list(params=''){ return get(`${endpoints.users}${params?`?${params}`:''}`); },
  get(id){ return get(`${endpoints.users}/${id}`); },
  create(data){ return post(endpoints.users, data); },
  update(id,data){ return put(`${endpoints.users}/${id}`, data); },
  remove(id){ return del(`${endpoints.users}/${id}`); },
  findByEmail(email){ return get(`${endpoints.users}?email=${encodeURIComponent(email)}`); }
};
