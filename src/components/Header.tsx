"use client";

import { Container } from "@/components/ui/container";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLayout } from "@/providers/LayoutProvider";
import { 
  User, 
  Settings, 
  Home, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  Sparkles,
  Shield
} from "lucide-react";

export default function Header() {
  const { showHeader } = useLayout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname?.includes('/admin');
  const isHomePage = pathname === "/";

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load admin user data
  useEffect(() => {
    const fetchAdminUser = async () => {
      if (!isAdmin) return;
      
      try {
        const cachedUser = localStorage.getItem('adminUser');
        if (cachedUser) {
          setAdminUser(JSON.parse(cachedUser));
          return;
        }

        const res = await fetch('/api/auth/me', {
          credentials: 'include'
        });

        if (res.ok) {
          const userData = await res.json();
          setAdminUser(userData);
          localStorage.setItem('adminUser', JSON.stringify(userData));
        } else {
          throw new Error('Unauthorized');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/admin/login');
      }
    };

    fetchAdminUser();
  }, [isAdmin, router]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Enhanced logout function
  const handleLogout = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      
      localStorage.removeItem("adminUser");
      setAdminUser(null);
      setProfileDropdownOpen(false);
      
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("adminUser");
      setAdminUser(null);
      router.push("/admin/login");
    } finally {
      setTimeout(() => setIsLoggingOut(false), 1000);
    }
  };

  // Avatar utilities
  const isValidImageUrl = (url?: string): boolean => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
  };

  const getFallbackAvatar = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff&size=128`;
  };

  const getAvatarUrl = (user: any) => {
    if (!user) return null;
    if (user.avatar && isValidImageUrl(user.avatar)) return user.avatar;
    if (user.image && isValidImageUrl(user.image)) return user.image;
    return getFallbackAvatar(user.name || 'Admin');
  };

  if (!showHeader) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isHomePage 
          ? isScrolled 
            ? "bg-white/95 backdrop-blur-xl py-3 shadow-xl border-b border-gray-200/50" 
            : "bg-transparent py-4"
          : "bg-white/95 backdrop-blur-xl py-3 shadow-xl border-b border-gray-200/50"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          {isAdmin ? (
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 overflow-hidden border-2 border-primary-200 shadow-lg bg-gradient-to-br from-primary-50 to-blue-50">
                  <Image
                    src="/images/LOGO.png"
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-primary-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Shield className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-lg tracking-wide">
                    ADMIN PANEL
                  </span>
                  <Sparkles className="w-4 h-4 text-primary-500" />
                </div>
                <p className="text-xs text-gray-500 font-medium">Quản trị hệ thống</p>
              </div>
            </Link>
          ) : (
            <a
              href="#top"
              className="flex items-center gap-3 group"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                if (!isHomePage) {
                  router.push('/#top');
                } else {
                  document.querySelector("#top")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <div className={`relative transition-all duration-500 ${isScrolled || !isHomePage ? 'scale-90' : ''}`}>
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-200 shadow-lg bg-gradient-to-br from-primary-50 to-blue-50">
                  <Image
                    src="/images/LOGO.png"
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className={`transition-all duration-500 ${isScrolled || !isHomePage ? 'opacity-100' : 'opacity-90'}`}>
                <span className={`font-bold tracking-wide transition-colors duration-300 ${
                  isHomePage && !isScrolled ? 'text-white' : 'text-gray-900'
                } text-lg`}>
                  NGUYỄN HOÀI KHÁNH
                </span>
              </div>
            </a>
          )}

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            {isAdmin ? (
              <div className="mr-4 flex items-center gap-1 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-1.5 border border-gray-200 shadow-lg">
                <AdminNavLink href="/admin">Dashboard</AdminNavLink>
                <AdminNavLink href="/admin/posts">Bài viết</AdminNavLink>
                <AdminNavLink href="/admin/categories">Danh mục</AdminNavLink>
              </div>
            ) : (
              <div className={`mr-4 flex items-center gap-1 rounded-2xl p-1.5 border shadow-lg transition-all duration-300 ${
                isHomePage && !isScrolled 
                  ? 'bg-white/10 backdrop-blur-sm border-white/20' 
                  : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
              }`}>
                {[
                  ["#overview", "Giới thiệu"],
                  ["#founder", "Sáng lập"],
                  ["/blog", "Bài viết"],
                  ["#values", "Giá trị"],
                ].map(([href, label]) => (
                  <NavLink key={href} href={href} isScrolled={isScrolled}>
                    {label}
                  </NavLink>
                ))}
              </div>
            )}
            
            {/* Enhanced Action Button/User Menu */}
            {isAdmin ? (
              adminUser ? (
                <div className="relative">
                  <button 
                    ref={buttonRef}
                    className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl overflow-hidden border-2 border-primary-200 shadow-md">
                        <Image
                          src={getAvatarUrl(adminUser)}
                          alt={adminUser.name || 'Admin'}
                          width={32}
                          height={32}
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">{adminUser.name}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                      profileDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {/* Enhanced Dropdown */}
                  {profileDropdownOpen && (
                    <div 
                      ref={dropdownRef}
                      className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50 animate-in slide-in-from-top-5 duration-200"
                    >
                      {/* User Info Header */}
                      <div className="p-4 bg-gradient-to-r from-primary-50 to-blue-50 border-b border-gray-200/50">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary-200 shadow-md">
                            <Image
                              src={getAvatarUrl(adminUser)}
                              alt={adminUser.name || 'Admin'}
                              width={48}
                              height={48}
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{adminUser.name}</p>
                            <p className="text-sm text-gray-600 truncate">{adminUser.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <DropdownLink href="/admin/profile" icon={User} onClick={() => setProfileDropdownOpen(false)}>
                          Hồ sơ cá nhân
                        </DropdownLink>
                        <DropdownLink href="/admin/settings" icon={Settings} onClick={() => setProfileDropdownOpen(false)}>
                          Cài đặt hệ thống
                        </DropdownLink>
                        <DropdownLink href="/" icon={Home} onClick={() => setProfileDropdownOpen(false)}>
                          Về trang chủ
                        </DropdownLink>
                        
                        <div className="my-2 border-t border-gray-200"></div>
                        
                        <button
                          onClick={(e) => handleLogout(e)}
                          disabled={isLoggingOut}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                        >
                          {isLoggingOut ? (
                            <>
                              <div className="w-5 h-5 border-2 border-red-300 border-t-red-600 animate-spin rounded-full" />
                              Đang đăng xuất...
                            </>
                          ) : (
                            <>
                              <LogOut className="w-5 h-5" />
                              Đăng xuất
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/admin/login" 
                  className="px-6 py-2.5 rounded-2xl font-semibold bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Đăng nhập
                </Link>
              )
            ) : (
              <a
                href="#contact"
                className={`px-6 py-2.5 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                  isHomePage && !isScrolled
                    ? 'bg-white/90 text-primary-600 hover:bg-white'
                    : 'bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white'
                }`}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Liên hệ
              </a>
            )}
          </nav>

          {/* Enhanced Mobile Toggle */}
          <button
            className={`lg:hidden p-2.5 rounded-xl border shadow-lg transition-all duration-300 ${
              isHomePage && !isScrolled
                ? 'bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20'
                : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </Container>

      {/* Enhanced Mobile Navigation */}
      <div 
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        } bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-xl`}
      >
        <Container className="py-6">
          <nav className="space-y-2">
            {isAdmin ? (
              <>
                <MobileAdminLink href="/admin" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </MobileAdminLink>
                <MobileAdminLink href="/admin/posts" onClick={() => setIsMenuOpen(false)}>
                  Bài viết
                </MobileAdminLink>
                <MobileAdminLink href="/admin/categories" onClick={() => setIsMenuOpen(false)}>
                  Danh mục
                </MobileAdminLink>
                
                {adminUser && (
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-4 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl border border-primary-100">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary-200 shadow-md">
                        <Image
                          src={getAvatarUrl(adminUser)}
                          alt={adminUser.name || 'Admin'}
                          width={48}
                          height={48}
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{adminUser.name}</p>
                        <p className="text-sm text-gray-600">{adminUser.email}</p>
                      </div>
                    </div>
                    
                    <MobileAdminLink href="/admin/profile" onClick={() => setIsMenuOpen(false)}>
                      Hồ sơ cá nhân
                    </MobileAdminLink>
                    <MobileAdminLink href="/" onClick={() => setIsMenuOpen(false)}>
                      Về trang chủ
                    </MobileAdminLink>
                    
                    <button
                      onClick={(e) => {
                        handleLogout(e);
                        setIsMenuOpen(false);
                      }}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-3 py-3 px-4 text-red-600 font-semibold bg-red-50 hover:bg-red-100 rounded-xl mt-4 transition-all duration-200"
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="w-5 h-5 border-2 border-red-300 border-t-red-600 animate-spin rounded-full" />
                          Đang đăng xuất...
                        </>
                      ) : (
                        <>
                          <LogOut className="w-5 h-5" />
                          Đăng xuất
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                {[
                  ["#overview", "Giới thiệu"],
                  ["#founder", "Sáng lập"],
                  ["/blog", "Bài viết"],
                  ["#values", "Giá trị"],
                ].map(([href, label]) => (
                  <MobileNavLink
                    key={href}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {label}
                  </MobileNavLink>
                ))}
                <a
                  href="#contact"
                  className="mt-4 inline-block w-full text-center px-6 py-3 rounded-2xl font-semibold bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                    setIsMenuOpen(false);
                  }}
                >
                  Liên hệ
                </a>
              </>
            )}
          </nav>
        </Container>
      </div>
    </header>
  );
}

// Enhanced NavLink Component
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isScrolled: boolean;
}

function NavLink({ href, children, isScrolled }: NavLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isExternalLink = href.startsWith("/");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (isExternalLink) {
      router.push(href);
    } else if (!isHomePage) {
      router.push(`/${href}`);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <a
      href={href}
      className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
        isHomePage && !isScrolled
          ? 'text-white/90 hover:text-white hover:bg-white/20'
          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
      }`}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

// Enhanced AdminNavLink Component
function AdminNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link
      href={href}
      className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
        isActive 
          ? "bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-lg" 
          : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
      }`}
    >
      {children}
    </Link>
  );
}

// Enhanced DropdownLink Component
interface DropdownLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onClick: () => void;
}

function DropdownLink({ href, icon: Icon, children, onClick }: DropdownLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
      onClick={onClick}
    >
      <Icon className="w-5 h-5" />
      {children}
    </Link>
  );
}

// Enhanced Mobile Components
interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

function MobileNavLink({ href, children, onClick }: MobileNavLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isExternalLink = href.startsWith("/");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (isExternalLink) {
      router.push(href);
    } else if (!isHomePage) {
      router.push(`/${href}`);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }

    if (onClick) onClick();
  };

  return (
    <a
      href={href} 
      className="block py-3 px-4 text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-semibold rounded-xl transition-all duration-200"
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

function MobileAdminLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <a
      href={href}
      className={`block py-3 px-4 font-semibold rounded-xl transition-all duration-200 ${
        isActive 
          ? "text-white bg-gradient-to-r from-primary-600 to-blue-600 shadow-lg" 
          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
      }`}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
}
