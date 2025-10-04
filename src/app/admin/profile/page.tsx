"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/cn";
import { 
  CheckCircle2, 
  Circle, 
  Eye, 
  EyeOff, 
  User,
  Camera,
  Key,
  AlertTriangle,
  Upload,
  Trash2,
  Facebook,
  Twitter,
  Linkedin,
  Globe,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  Settings,
  Shield
} from "lucide-react";

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  website?: string;
  [key: string]: string | undefined;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  phoneNumber?: string;
  position?: string;
  socialLinks?: SocialLinks;
  createdAt?: string;
  updatedAt?: string;
}

// Password schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
  newPassword: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
    .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ thường")
    .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 số")
    .regex(/[^A-Za-z0-9]/, "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"),
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = localStorage.getItem("adminUser");

        if (!userData) {
          router.push("/admin/login");
          return;
        }

        const parsedUser = JSON.parse(userData);

        if (!parsedUser || !parsedUser.id) {
          router.push("/admin/login");
          return;
        }

        try {
          const response = await fetch(`/api/users/${parsedUser.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            console.warn("Sử dụng dữ liệu từ localStorage do API thất bại");
            setUser(parsedUser);
          }
        } catch (apiError) {
          console.warn("Sử dụng dữ liệu từ localStorage do không thể kết nối API", apiError);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      loadUserData();
    }
  }, [router, mounted]);

  const updateUserData = (updatedUser: User) => {
    setUser(updatedUser);
    const currentUserData = localStorage.getItem("adminUser");
    if (currentUserData) {
      try {
        const parsedCurrentUser = JSON.parse(currentUserData);
        localStorage.setItem("adminUser", JSON.stringify({
          ...parsedCurrentUser,
          ...updatedUser
        }));
      } catch (e) {
        console.error("Lỗi khi cập nhật localStorage:", e);
      }
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      const updatedData = {
        name: formData.get("name") as string,
        bio: formData.get("bio") as string,
        phoneNumber: formData.get("phoneNumber") as string,
        position: formData.get("position") as string,
        socialLinks: {
          facebook: formData.get("facebook") as string,
          twitter: formData.get("twitter") as string,
          instagram: formData.get("instagram") as string,
          linkedin: formData.get("linkedin") as string,
          youtube: formData.get("youtube") as string,
          website: formData.get("website") as string,
        }
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(`/api/users/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
          credentials: "include",
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Có lỗi xảy ra khi cập nhật thông tin");
        }

        const result = await response.json();
        updateUserData(result);
        toast.success("Cập nhật thông tin thành công");
      } catch (fetchError: any) {
        if (fetchError.name === 'AbortError') {
          throw new Error("Yêu cầu đã hết thời gian chờ, vui lòng thử lại");
        }
        throw fetchError;
      }
    } catch (error: any) {
      console.error("Lỗi khi cập nhật profile:", error);
      toast.error(error.message || "Không thể cập nhật thông tin. Vui lòng thử lại sau!");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 5MB");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      try {
        const response = await fetch(`/api/users/${user.id}/avatar`, {
          method: "POST",
          body: formData,
          credentials: "include",
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 405) {
            throw new Error("API không hỗ trợ phương thức này. Vui lòng kiểm tra cấu hình API");
          }

          let errorMessage;
          try {
            const errorData = await response.json();
            errorMessage = errorData.error;
          } catch (e) {
            errorMessage = `Lỗi HTTP ${response.status}: ${response.statusText}`;
          }
          throw new Error(errorMessage || "Có lỗi xảy ra khi tải lên ảnh đại diện");
        }

        const result = await response.json();
        updateUserData({ ...user, avatar: result.avatar });
        toast.success("Cập nhật ảnh đại diện thành công");
      } catch (fetchError: any) {
        if (fetchError.name === 'AbortError') {
          throw new Error("Quá trình tải lên ảnh đã hết thời gian chờ, vui lòng thử lại");
        }
        throw fetchError;
      }
    } catch (error: any) {
      console.error("Lỗi khi upload avatar:", error);
      toast.error(error.message || "Không thể tải lên ảnh đại diện. Vui lòng thử lại sau!");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user || !user.avatar) return;

    if (!window.confirm("Bạn có chắc chắn muốn xóa ảnh đại diện không?")) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/users/${user.id}/avatar`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Có lỗi xảy ra khi xóa ảnh đại diện");
      }

      updateUserData({ ...user, avatar: undefined });
      toast.success("Xóa ảnh đại diện thành công");
    } catch (error: any) {
      console.error("Lỗi khi xóa avatar:", error);
      toast.error(error.message || "Không thể xóa ảnh đại diện. Vui lòng thử lại sau!");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (data: PasswordFormData) => {
    if (!user) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/users/${user.id}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Có lỗi xảy ra khi đổi mật khẩu");
      }

      toast.success("Đổi mật khẩu thành công");
    } catch (error: any) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      toast.error(error.message || "Không thể đổi mật khẩu. Vui lòng thử lại sau!");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async (confirmation: string) => {
    if (!user) return;
    if (confirmation !== "xóa tài khoản") {
      toast.error('Vui lòng nhập đúng cụm từ "xóa tài khoản" để xác nhận');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Có lỗi xảy ra khi xóa tài khoản");
      }

      try {
        localStorage.removeItem("adminUser");
        document.cookie = "admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      } catch (e) {
        console.error("Lỗi khi xóa dữ liệu người dùng:", e);
      }

      toast.success("Tài khoản đã được xóa thành công");

      setTimeout(() => {
        router.push("/admin/login");
      }, 1500);
    } catch (error: any) {
      console.error("Lỗi khi xóa tài khoản:", error);
      toast.error(error.message || "Không thể xóa tài khoản. Vui lòng thử lại sau!");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 pt-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl p-8 text-center">
              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500 to-blue-600 animate-pulse"></div>
                <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Đang tải thông tin</h3>
              <p className="text-gray-600">Vui lòng chờ trong giây lát...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 pt-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl p-8 text-center max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-red-600 mb-2">Không thể tải thông tin</h2>
              <p className="text-gray-600 mb-6">Vui lòng đăng nhập lại để tiếp tục.</p>
              <button 
                onClick={() => router.push('/admin/login')}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-blue-600 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Đến trang đăng nhập
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  const PasswordForm = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      watch
    } = useForm<PasswordFormData>({
      resolver: zodResolver(passwordSchema)
    });
  
    const [showPassword, setShowPassword] = useState({
      current: false,
      new: false,
      confirm: false
    });
  
    const newPassword = watch("newPassword");
  
    const requirements = [
      { regex: /.{8,}/, text: "Ít nhất 8 ký tự" },
      { regex: /[A-Z]/, text: "Ít nhất 1 chữ hoa" },
      { regex: /[a-z]/, text: "Ít nhất 1 chữ thường" },
      { regex: /[0-9]/, text: "Ít nhất 1 số" },
      { regex: /[^A-Za-z0-9]/, text: "Ít nhất 1 ký tự đặc biệt" }
    ];
  
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">Bảo mật tài khoản</h3>
              <p className="text-sm text-amber-700">
                Sử dụng mật khẩu mạnh để bảo vệ tài khoản của bạn. Mật khẩu nên bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-8">
          {/* Current Password */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Key className="w-4 h-4" />
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                {...register("currentPassword")}
                className={cn(
                  "w-full h-12 pl-4 pr-12 py-3 border-2 rounded-xl transition-all duration-200",
                  "focus:outline-none focus:ring-4 focus:ring-primary-100",
                  "placeholder:text-gray-400",
                  errors.currentPassword
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-primary-500"
                )}
                placeholder="Nhập mật khẩu hiện tại"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
              >
                {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertTriangle size={16} />
                {errors.currentPassword.message}
              </p>
            )}
          </div>
  
          {/* New Password */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Key className="w-4 h-4" />
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                {...register("newPassword")}
                className={cn(
                  "w-full h-12 pl-4 pr-12 py-3 border-2 rounded-xl transition-all duration-200",
                  "focus:outline-none focus:ring-4 focus:ring-primary-100",
                  "placeholder:text-gray-400",
                  errors.newPassword
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-primary-500"
                )}
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
              >
                {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertTriangle size={16} />
                {errors.newPassword.message}
              </p>
            )}
  
            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className="text-sm font-medium text-gray-700 mb-3">Yêu cầu mật khẩu:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {requirements.map((req, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center text-sm gap-2 transition-colors",
                      newPassword && req.regex.test(newPassword)
                        ? "text-green-600"
                        : "text-gray-500"
                    )}
                  >
                    {newPassword && req.regex.test(newPassword) ? (
                      <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle size={16} className="flex-shrink-0" />
                    )}
                    <span>{req.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
  
          {/* Confirm Password */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Key className="w-4 h-4" />
              Xác nhận mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                {...register("confirmPassword")}
                className={cn(
                  "w-full h-12 pl-4 pr-12 py-3 border-2 rounded-xl transition-all duration-200",
                  "focus:outline-none focus:ring-4 focus:ring-primary-100",
                  "placeholder:text-gray-400",
                  errors.confirmPassword
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-primary-500"
                )}
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
              >
                {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertTriangle size={16} />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
  
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className={cn(
                "px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300",
                "flex items-center gap-2 shadow-lg hover:shadow-xl",
                saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700"
              )}
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Cập nhật mật khẩu
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-600 to-blue-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
            </div>
            
            {/* Breadcrumb */}
            <div className="hidden md:flex items-center text-sm text-gray-500">
              <button 
                onClick={() => router.push('/admin')}
                className="hover:text-primary-600 transition-colors flex items-center gap-1"
              >
                <Settings className="w-4 h-4" />
                Dashboard
              </button>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-gray-900">Hồ sơ</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                <Image
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=random`}
                  alt={user?.name || ''}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h2>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600 mb-4">
                <Mail className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800">
                  <Shield className="w-4 h-4 mr-2" />
                  {user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                </span>
                {user?.position && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800">
                    <User className="w-4 h-4 mr-2" />
                    {user.position}
                  </span>
                )}
              </div>

              {user?.bio && (
                <p className="text-gray-600 max-w-2xl">{user.bio}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-gray-500">
                {user?.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
                {user?.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Tham gia {formatDate(user.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="info" className="space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg p-2">
            <TabsList className="bg-transparent p-0 h-auto w-full grid grid-cols-2 lg:grid-cols-4 gap-2">
              <TabsTrigger 
                value="info"
                className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-600 data-[state=active]:to-blue-600 data-[state=active]:text-white font-semibold transition-all duration-300"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Thông tin</span>
              </TabsTrigger>
              <TabsTrigger 
                value="avatar"
                className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white font-semibold transition-all duration-300"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Ảnh đại diện</span>
              </TabsTrigger>
              <TabsTrigger 
                value="password"
                className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-orange-600 data-[state=active]:text-white font-semibold transition-all duration-300"
              >
                <Key className="w-4 h-4" />
                <span className="hidden sm:inline">Mật khẩu</span>
              </TabsTrigger>
              <TabsTrigger 
                value="danger"
                className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-pink-600 data-[state=active]:text-white text-red-600 font-semibold transition-all duration-300"
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden sm:inline">Nguy hiểm</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl overflow-hidden">
            <TabsContent value="info" className="p-8">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h3>
                  <p className="text-gray-600">Cập nhật thông tin cá nhân và liên kết mạng xã hội của bạn.</p>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-200">
                        <User className="w-5 h-5" />
                        Thông tin cơ bản
                      </h4>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">
                          Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="name"
                          defaultValue={user?.name}
                          className="w-full h-12 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">
                          Chức vụ
                        </label>
                        <input
                          name="position"
                          defaultValue={user?.position}
                          className="w-full h-12 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200"
                          placeholder="VD: Senior Developer"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">
                          Số điện thoại
                        </label>
                        <input
                          name="phoneNumber"
                          defaultValue={user?.phoneNumber}
                          className="w-full h-12 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200"
                          placeholder="VD: 0123456789"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">
                          Giới thiệu bản thân
                        </label>
                        <textarea
                          name="bio"
                          defaultValue={user?.bio}
                          rows={4}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 resize-none"
                          placeholder="Viết một vài điều về bản thân..."
                        />
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-6">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-200">
                        <Globe className="w-5 h-5" />
                        Liên kết mạng xã hội
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Facebook className="w-4 h-4 text-blue-600" />
                            Facebook
                          </label>
                          <input
                            name="facebook"
                            defaultValue={user?.socialLinks?.facebook}
                            className="w-full h-12 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                            placeholder="https://facebook.com/username"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Twitter className="w-4 h-4 text-sky-600" />
                            Twitter
                          </label>
                          <input
                            name="twitter"
                            defaultValue={user?.socialLinks?.twitter}
                            className="w-full h-12 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-500 transition-all duration-200"
                            placeholder="https://twitter.com/username"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Linkedin className="w-4 h-4 text-blue-700" />
                            LinkedIn
                          </label>
                          <input
                            name="linkedin"
                            defaultValue={user?.socialLinks?.linkedin}
                            className="w-full h-12 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-600" />
                            Website
                          </label>
                          <input
                            name="website"
                            defaultValue={user?.socialLinks?.website}
                            className="w-full h-12 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-gray-500 transition-all duration-200"
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button 
                      type="submit"
                      disabled={saving}
                      className="px-8 py-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <Settings className="w-5 h-5" />
                          Lưu thay đổi
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="avatar" className="p-8">
              <div className="max-w-2xl mx-auto text-center">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Ảnh đại diện</h3>
                  <p className="text-gray-600">Tải lên ảnh đại diện mới cho tài khoản của bạn.</p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 mb-8">
                  <div className="relative inline-block mb-6">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                      <Image
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=random`}
                        alt={user?.name || ''}
                        width={160}
                        height={160}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
                    disabled={saving}
                  />
                  
                  <div className="flex gap-4 justify-center">
                    <label
                      htmlFor="avatar"
                      className="cursor-pointer px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      Tải ảnh lên
                    </label>
                    
                    {user?.avatar && (
                      <button
                        onClick={handleDeleteAvatar}
                        disabled={saving}
                        className="px-6 py-3 bg-gradient-to-r from-red-100 to-red-200 text-red-600 hover:from-red-200 hover:to-red-300 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                      >
                        <Trash2 className="w-5 h-5" />
                        Xóa ảnh
                      </button>
                    )}
                  </div>

                  <div className="mt-6 text-sm text-gray-500">
                    <p>• Kích thước tối đa: 5MB</p>
                    <p>• Định dạng: JPG, PNG, GIF</p>
                    <p>• Khuyến nghị: ảnh vuông, tỷ lệ 1:1</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="password" className="p-8">
              <PasswordForm />
            </TabsContent>

            <TabsContent value="danger" className="p-8">
              <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-red-600 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6" />
                    Vùng nguy hiểm
                  </h3>
                  <p className="text-gray-600">Các hành động trong vùng này không thể hoàn tác.</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-3xl p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-red-200 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-red-800 mb-2">
                        Xóa tài khoản vĩnh viễn
                      </h4>
                      <p className="text-sm text-red-700 mb-4">
                        Khi xóa tài khoản, tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn và không thể khôi phục. 
                        Điều này bao gồm hồ sơ, bài viết, bình luận và tất cả hoạt động khác.
                      </p>
                      <p className="text-sm font-semibold text-red-800">
                        Để xác nhận, vui lòng nhập <code className="bg-red-200 px-2 py-1 rounded">"xóa tài khoản"</code> vào ô bên dưới.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      className="w-full h-12 px-4 py-3 border-2 border-red-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200"
                      placeholder='Nhập "xóa tài khoản" để xác nhận'
                      onChange={(e) => {
                        const confirmText = e.target.value;
                        const deleteBtn = document.getElementById('deleteAccountBtn') as HTMLButtonElement;
                        if (deleteBtn) {
                          deleteBtn.disabled = confirmText !== 'xóa tài khoản' || saving;
                        }
                      }}
                    />
                    
                    <button
                      id="deleteAccountBtn"
                      onClick={() => {
                        const confirmInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                        handleDeleteAccount(confirmInput?.value || '');
                      }}
                      disabled={true}
                      className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-red-300 disabled:to-red-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-5 h-5" />
                          Xóa tài khoản vĩnh viễn
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}