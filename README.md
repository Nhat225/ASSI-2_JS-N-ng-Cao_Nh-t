# Susan Shop – Web Bán Hàng (Assignment WEB20301)

## Giới thiệu
Dự án xây dựng website bán hàng cơ bản bằng **JavaScript nâng cao + JSON Server**.  
Bao gồm các tính năng: xem sản phẩm, giỏ hàng, đăng nhập/đăng ký, quản trị (admin).

## Công nghệ sử dụng
- HTML5, CSS3 (Bootstrap 5, custom styles)
- JavaScript ES6 modules
- JSON Server (giả lập API RESTful)
- LocalStorage (lưu session & giỏ hàng)

## Chức năng chính
- Xem danh mục, sản phẩm, chi tiết sản phẩm
- Thêm vào giỏ hàng, tính tổng tiền, thanh toán
- Đăng nhập/đăng ký tài khoản
- Admin: Quản lý sản phẩm, danh mục, đơn hàng

## Cách chạy dự án
```bash
# Cài JSON Server
npm install -g json-server

# Chạy server (port 3000)
json-server --watch db.json --port 3000 --static .

