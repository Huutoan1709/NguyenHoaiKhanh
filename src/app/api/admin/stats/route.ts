import { NextResponse } from 'next/server';

export async function GET() {
  // Tạo dữ liệu giả
  const mockStats = {
    posts: 24,
    categories: 6,
    comments: 128,
    users: 42
  };
  
  return NextResponse.json(mockStats);
}