# README.md

# NextJS Blog Platform

Một nền tảng blog hiện đại được xây dựng với Next.js 14, TypeScript, và Prisma.

## 🚀 Tính năng

- ✅ Quản lý bài viết với Rich Text Editor
- ✅ Hệ thống danh mục và thẻ
- ✅ Bảng điều khiển quản trị viên
- ✅ Xác thực người dùng
- ✅ Upload ảnh với Cloudinary
- ✅ SEO tối ưu
- ✅ Responsive design
- ✅ Dark/Light mode

## 🛠️ Công nghệ sử dụng

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL với Prisma ORM
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + Custom Components
- **Authentication:** NextAuth.js
- **File Upload:** Cloudinary
- **Rich Text Editor:** React Quill
- **Animation:** Framer Motion
- **Form Handling:** React Hook Form
- **Notifications:** SweetAlert2

## 📋 Yêu cầu hệ thống

- Node.js 18+ 
- npm hoặc yarn
- PostgreSQL database

## ⚡ Cài đặt

1. **Clone repository:**
```bash
git clone https://github.com/yourusername/nextjs-blog.git
cd nextjs-blog
```

2. **Cài đặt dependencies:**
```bash
npm install
```
hoặc
```bash
yarn install
```

3. **Cấu hình database:**
- Cập nhật file `prisma/schema.prisma` với thông tin kết nối database của bạn.
- Chạy lệnh sau để tạo schema database:
```bash
npx prisma migrate dev --name init
```

## 🚀 Chạy ứng dụng

Để khởi động server phát triển, chạy lệnh:
```bash
npm run dev
```
hoặc
```bash
yarn dev
```
Ứng dụng sẽ chạy tại `http://localhost:3000`.

## 📖 Sử dụng

- Truy cập trang chủ để xem danh sách bài viết.
- Nhấp vào tiêu đề bài viết để xem nội dung đầy đủ.
- Sử dụng API để tạo hoặc quản lý bài viết.

## 🤝 Đóng góp

Đóng góp được chào đón! Vui lòng mở issue hoặc gửi pull request.

## 📄 Giấy phép

Dự án này được cấp phép theo giấy phép MIT.