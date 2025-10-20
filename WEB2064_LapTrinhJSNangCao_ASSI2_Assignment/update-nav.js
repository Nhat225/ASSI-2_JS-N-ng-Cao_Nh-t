const fs = require("fs");
const path = process.argv[2];
if (!path) {
  console.error('Usage: node update-nav.js <file> [active] [ctaText] [ctaHref] [ctaVisibility] [ctaClass]');
  process.exit(1);
}
const activeKey = process.argv[3] || '';
const ctaText = process.argv[4] || '&#272;&#7863;t tr&#432;&#7899;c ngay';
const ctaHref = process.argv[5] || 'products.html';
const ctaVisibility = process.argv[6] || 'all';
const ctaClass = process.argv[7] || 'btn btn-sm btn-dark';

const content = fs.readFileSync(path, 'utf8');
const activeClass = (name) => `nav-link${activeKey === name ? ' active' : ''}`;
const ctaAuthAttr = ctaVisibility === 'guest' ? ' data-auth="guest"' : '';
const logoutButton = '<button class="btn btn-sm btn-outline-secondary d-none" data-action="logout" data-auth="user">&#272;&#259;ng xu&#7845;t</button>';
const nav = `\n<nav class="navbar navbar-expand-lg sticky-top py-3">\n  <div class="container">\n    <a class="navbar-brand fw-semibold" href="index.html">Susan Shop</a>\n    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false" aria-label="M&#7903; &#273;i&#7873;u h&#432;&#7899;ng">\n      <span class="navbar-toggler-icon"></span>\n    </button>\n    <div class="collapse navbar-collapse" id="nav">\n      <ul class="navbar-nav ms-lg-5 me-auto align-items-lg-center gap-lg-3 mb-3 mb-lg-0">\n        <li class="nav-item"><a class="${activeClass('home')}" href="index.html">Trang ch&#7911;</a></li>\n        <li class="nav-item"><a class="${activeClass('products')}" href="products.html">&#272;i&#7879;n tho&#7841;i</a></li>\n        <li class="nav-item" data-auth="guest"><a class="${activeClass('login')}" href="login.html">&#272;&#259;ng nh&#7853;p</a></li>\n        <li class="nav-item" data-auth="guest"><a class="${activeClass('register')}" href="register.html">&#272;&#259;ng k&#253;</a></li>\n        <li class="nav-item"><a class="${activeClass('cart')}" href="cart.html">Gi&#7887; h&#224;ng</a></li>\n        <li class="nav-item d-none" data-auth="user">\n          <span class="nav-link disabled text-nowrap" data-user-name>Xin ch&#224;o</span>\n        </li>\n      </ul>\n      <div class="d-flex align-items-center gap-3">\n        <a class="btn btn-sm btn-outline-secondary d-none" data-admin-link href="admin/index.html">Qu&#7843;n tr&#7883;</a>\n        <a class="${ctaClass}" href="${ctaHref}"${ctaAuthAttr}>${ctaText}</a>\n        ${logoutButton}\n      </div>\n    </div>\n  </div>\n</nav>\n`;
const updated = content.replace(/<nav class=['\"]navbar[\s\S]*?<\/nav>/, nav);
fs.writeFileSync(path, updated, 'utf8');
