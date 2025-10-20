export const $ = (s, scope = document) => scope.querySelector(s);
export const $$ = (s, scope = document) => [...scope.querySelectorAll(s)];
export const fmtVND = n => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(n || 0));
export const toast = (msg, type = 'info') => {
  const el = document.createElement('div');
  el.textContent = msg;
  el.style = `position:fixed; right:12px; top:12px; background:#111827; color:#fff; padding:10px 14px; border-radius:10px; z-index:9999; opacity:.95`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1800);
};
export const qs = key => new URL(location.href).searchParams.get(key);
export const imgFallback = e => { e.target.src = 'https://placehold.co/600x400?text=No+Image'; };

const SESSION_KEY = 'susan_session_user';

const readSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
};

const toggleNodes = (nodes, shouldShow) => {
  nodes.forEach(node => {
    if (shouldShow) {
      node.classList.remove('d-none');
      node.removeAttribute('hidden');
      if (node.style) node.style.removeProperty('display');
    } else {
      node.classList.add('d-none');
      node.setAttribute('hidden', '');
      if (node.style) node.style.display = 'none';
    }
  });
};

const syncAuthElements = () => {
  const session = readSession();
  const isLoggedIn = !!session;

  toggleNodes(document.querySelectorAll('[data-auth=\"guest\"]'), !isLoggedIn);
  toggleNodes(document.querySelectorAll('[data-auth=\"user\"]'), isLoggedIn);

  document.querySelectorAll('[data-user-name]').forEach(el => {
    if (isLoggedIn) {
      el.textContent = session.name || session.email || 'Tài khoản';
    } else {
      el.textContent = '';
    }
  });

  const adminLinks = document.querySelectorAll('[data-admin-link]');
  adminLinks.forEach(link => {
    if (isLoggedIn && session.role === 'admin') {
      link.classList.remove('d-none');
      link.removeAttribute('hidden');
      link.style.display = 'inline-flex';
    } else {
      link.classList.add('d-none');
      link.setAttribute('hidden', '');
      link.style.display = 'none';
    }
  });
};

const registerLogoutHandlers = () => {
  document.querySelectorAll('[data-action=\"logout\"]').forEach(btn => {
    if (btn.dataset.boundLogout) return;
    btn.dataset.boundLogout = '1';
    btn.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem(SESSION_KEY);
      toast('Đăng xuất thành công');
      syncAuthElements();
      const redirect = location.pathname.includes('/admin/')
        ? '../login.html'
        : 'index.html';
      setTimeout(() => { location.href = redirect; }, 400);
    });
  });
};

const bootstrapAuthUI = () => {
  syncAuthElements();
  registerLogoutHandlers();
};

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', bootstrapAuthUI);
  window.addEventListener('storage', event => {
    if (event.key === SESSION_KEY) {
      syncAuthElements();
      registerLogoutHandlers();
    }
  });
}
