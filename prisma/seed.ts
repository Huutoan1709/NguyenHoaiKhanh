import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Xóa dữ liệu cũ nếu có
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Đã xóa dữ liệu cũ');

  // Tạo user admin
  const admin = await prisma.user.create({
    data: {
      name: 'Nguyễn Hoài Khánh',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
    },
  });

  console.log(`Đã tạo user admin với id: ${admin.id}`);

  // Tạo một số bài viết mẫu
  const post1 = await prisma.post.create({
    data: {
      title: 'Triết lý LAOS và sự phát triển bền vững',
      slug: 'triet-ly-laos',
      content: 'Nội dung bài viết về triết lý LAOS...',
      excerpt: 'Tóm tắt về triết lý LAOS và tác động của nó',
      tags: ['LAOS', 'Phát triển bền vững'],
      status: 'published',
      authorId: admin.id,
    },
  });

  console.log(`Đã tạo bài viết với id: ${post1.id}`);

  const post2 = await prisma.post.create({
    data: {
      title: 'Văn Đại - Kết nối giáo dục và văn hóa',
      slug: 'van-dai-giao-duc',
      content: 'Nội dung về thương hiệu Văn Đại...',
      excerpt: 'Tóm tắt về thương hiệu Văn Đại',
      tags: ['Văn Đại', 'Giáo dục', 'Văn hóa'],
      status: 'published',
      authorId: admin.id,
    },
  });

  console.log(`Đã tạo bài viết với id: ${post2.id}`);

  // Thêm comment cho bài viết
  const comment1 = await prisma.comment.create({
    data: {
      content: 'Bài viết rất hay về LAOS!',
      userId: admin.id,
      postId: post1.id,
    },
  });

  console.log(`Đã tạo comment với id: ${comment1.id}`);

  console.log('Seeding hoàn tất!');
}

main()
  .catch((e) => {
    console.error('Lỗi khi thêm dữ liệu:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });