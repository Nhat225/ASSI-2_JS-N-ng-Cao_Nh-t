# Susan Shop – Assignment WEB2064

Website bán hàng dùng **Vanilla JavaScript** + **JSON Server** (chuẩn theo đề).

## Tính năng
- Xem danh sách & chi tiết sản phẩm
- Lọc theo danh mục, khoảng giá (đơn giản)
- Giỏ hàng, cập nhật số lượng, xoá
- Thanh toán → tạo `orders` + `order_details` → trang cảm ơn
- Đăng ký / Đăng nhập (User/Admin)
- Admin CRUD: Danh mục, Sản phẩm, xem Users, Orders, Stats

## Chạy dự án
```bash
npm i -g json-server
json-server --watch db.json --port 3000
```
Mở `index.html` để chạy frontend.
Đăng nhập admin: **admin@susan.vn / 123456**

## Cấu trúc
- `js/api/*` các hàm gọi API (fetch)
- `js/auth.js` đăng nhập/đăng ký
- `js/cart.js` giỏ hàng + checkout
- `js/main.js` render trang chủ / sản phẩm / chi tiết
