"use client";

import { Stats } from "@/types/index";

interface StatsCardProps {
  stats: Stats;
}

export default function StatsCard({ stats }: StatsCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 font-medium mb-2">Bài viết</h3>
        <p className="text-3xl font-bold">{stats.posts}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 font-medium mb-2">Danh mục</h3>
        <p className="text-3xl font-bold">{stats.categories}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 font-medium mb-2">Bình luận</h3>
        <p className="text-3xl font-bold">{stats.comments}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-500 font-medium mb-2">Người dùng</h3>
        <p className="text-3xl font-bold">{stats.users}</p>
      </div>
    </div>
  );
}