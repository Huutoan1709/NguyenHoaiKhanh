export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  } catch (error) {
    console.error('Date formatting error:', error);
    return "-";
  }
}

export const generateUniqueSlug = async (baseSlug: string): Promise<string> => {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const response = await fetch(`/api/posts/check-slug?slug=${slug}`, {
      credentials: 'include'
    });
    const data = await response.json();
    
    if (!data.exists) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};
