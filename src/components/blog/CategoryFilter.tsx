"use client";

import { useState, useEffect } from 'react';
import { Category } from '@/types';

interface CategoryFilterProps {
  onSelect: (categoryId: string) => void;
  selectedCategory?: string;
}

export default function CategoryFilter({ onSelect, selectedCategory }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      setCategories(data.items || []);
    } catch (error) {
      console.error('Fetch categories error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-4">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <button
        onClick={() => onSelect('')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
          ${!selectedCategory 
            ? 'bg-blue-600 text-white' 
            : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
      >
        Tất cả
      </button>
      
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
            ${selectedCategory === category.id
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
        >
          {category.name}
          {category._count?.posts && (
            <span className="ml-1 text-xs">
              ({category._count.posts})
            </span>
          )}
        </button>
      ))}
    </div>
  );
}