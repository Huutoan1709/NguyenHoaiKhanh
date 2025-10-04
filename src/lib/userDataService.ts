import useSWR, { mutate } from 'swr';

const API_BASE = '/api';

// Hàm fetcher cho SWR
const fetcher = async (url: string) => {
  const response = await fetch(url, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// Hook để lấy dữ liệu người dùng với real-time updates
export const useUserData = (userId: string | null) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    userId ? `${API_BASE}/users/${userId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
      errorRetryCount: 3,
    }
  );

  // Hàm để refresh dữ liệu người dùng
  const refreshUserData = () => {
    return mutate();
  };

  // Hàm để cập nhật dữ liệu người dùng và refresh cache
  const updateUserData = async (updatedData: any) => {
    if (!userId) return null;

    const response = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Update failed');
    }

    const result = await response.json();
    // Cập nhật cache ngay lập tức cho UX tốt hơn
    mutate(result, false);
    
    return result;
  };

  // Hàm upload avatar với optimistic UI
  const uploadAvatar = async (file: File) => {
    if (!userId || !file || !data) return null;

    // Tạo URL tạm thời cho preview
    const tempUrl = URL.createObjectURL(file);
    
    // Optimistic update UI ngay lập tức
    mutate({...data, avatar: tempUrl}, false);
    
    // Tạo FormData cho upload
    const formData = new FormData();
    formData.append("file", file);

    // Thực hiện upload thực tế
    const response = await fetch(`${API_BASE}/users/${userId}/avatar`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    // Revoke URL tạm thời để tránh memory leak
    URL.revokeObjectURL(tempUrl);

    if (!response.ok) {
      // Rollback nếu có lỗi
      mutate();
      const errorData = await response.json();
      throw new Error(errorData.error || "Upload failed");
    }

    const result = await response.json();
    // Cập nhật với dữ liệu thực từ server
    mutate({...data, avatar: result.avatar}, false);
    
    return result;
  };

  // Hàm xóa avatar với optimistic UI
  const deleteAvatar = async () => {
    if (!userId || !data) return null;
    
    // Lưu avatar cũ để có thể khôi phục nếu lỗi
    const oldAvatar = data.avatar;
    
    // Optimistic update UI ngay lập tức
    mutate({...data, avatar: undefined}, false);
    
    // Thực hiện xóa thực tế
    const response = await fetch(`${API_BASE}/users/${userId}/avatar`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      // Rollback nếu có lỗi
      mutate({...data, avatar: oldAvatar}, false);
      const errorData = await response.json();
      throw new Error(errorData.error || "Delete failed");
    }

    // Dữ liệu đã được cập nhật ở optimistic update
    return { success: true };
  };

  return {
    user: data,
    isLoading,
    isValidating,
    isError: error,
    refreshUserData,
    updateUserData,
    uploadAvatar,
    deleteAvatar
  };
};