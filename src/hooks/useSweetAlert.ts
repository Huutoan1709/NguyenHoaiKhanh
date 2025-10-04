import { useCallback } from 'react';
import Swal from 'sweetalert2';

// Kiểu dữ liệu cho các tùy chọn
export interface SweetAlertOptions {
  title?: string;
  text?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
}

// Đảm bảo export default
export default function useSweetAlert() {
  // Hiển thị thông báo toast
  const toast = useCallback((title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success', timer = 3000) => {
    return Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title,
      showConfirmButton: false,
      timer,
      timerProgressBar: true,
    });
  }, []);

  // Hiển thị hộp thoại xác nhận
  const confirm = useCallback(async (options: SweetAlertOptions = {}) => {
    const result = await Swal.fire({
      title: options.title || 'Bạn có chắc chắn?',
      text: options.text,
      icon: options.icon || 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#d1d5db',
      confirmButtonText: options.confirmButtonText || 'Xác nhận',
      cancelButtonText: options.cancelButtonText || 'Hủy',
    });
    
    return result.isConfirmed;
  }, []);

  // Hiển thị hộp thoại thông báo
  const alert = useCallback((options: SweetAlertOptions = {}) => {
    return Swal.fire({
      title: options.title || 'Thông báo',
      text: options.text,
      icon: options.icon || 'info',
      confirmButtonText: options.confirmButtonText || 'Đóng',
    });
  }, []);

  // Hiển thị loading và đóng loading
  const loading = useCallback((title: string = 'Đang xử lý...') => {
    Swal.fire({
      title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    
    return {
      close: () => Swal.close(),
    };
  }, []);

  return {
    toast,
    confirm,
    alert,
    loading,
    Swal, // Xuất Swal nguyên bản nếu cần sử dụng các tính năng nâng cao
  };
}