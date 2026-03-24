// src/components/layout/HeaderView.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Users,
  CreditCard,
  Boxes,
  Menu,
  Home,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import NotificationPopover from "@/components/push/NotificationPopover";
import { useThemeStore } from "@/store/themeStore";
import {
  headerThemes,
  navPillStyles,
  getMobileNavItemStyle,
} from "@/config/themeConfig";

function Sticker({ children, color = "bg-transparent", className = "" }) {
  return <div className={`${color} ${className}`}>{children}</div>;
}

function NavPill({ to, icon: Icon, children, active, theme = "classic" }) {
  const style = navPillStyles[theme] || navPillStyles.classic;

  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2 px-4 py-2 font-black text-[15px] rounded-2xl whitespace-nowrap transition-all duration-200
        ${style.base}
        ${active ? style.active : style.inactive}
      `}
    >
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-xl transition-all duration-200
          ${style.iconBase}
          ${active ? style.iconActive : style.iconInactive}
        `}
      >
        <Icon className="w-4 h-4" />
      </span>
      <span>{children}</span>
    </Link>
  );
}

export default function HeaderView({
  user,
  isAdmin,
  isAdminMode,
  profileImageUrl,
  userInitial,
  displayNickname,
  displayEmail,
  logout,
  handleAdminSwitch,
}) {
  const location = useLocation();
  const { theme: currentTheme } = useThemeStore();
  const themeStyle = headerThemes[currentTheme] || headerThemes.classic;

  // Scroll detection for floating header background
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (to) => {
    const p = location.pathname || "/";
    if (to === "/") return p === "/";
    return p === to || p.startsWith(to + "/");
  };

  const renderProviderBadge = () => {
    if (isAdmin) {
      return (
        <Badge className="w-fit bg-lime-400 text-black border-0 px-1.5 py-0 text-[9px] font-black rounded-full">
          ADMIN
        </Badge>
      );
    }

    const p = (user?.loginProvider || "email").toLowerCase();

    switch (p) {
      case "kakao":
        return (
          <Badge className="w-fit bg-[#FEE500] text-black border-0 px-1.5 py-0 text-[9px] font-black rounded-full">
            KAKAO
          </Badge>
        );
      case "google":
        return (
          <Badge className="w-fit bg-white text-black border border-gray-300 px-1.5 py-0 text-[9px] font-black rounded-full">
            GOOGLE
          </Badge>
        );
      default:
        return (
          <Badge className="w-fit bg-pink-100 text-pink-600 border-0 px-1.5 py-0 text-[9px] font-black rounded-full">
            EMAIL
          </Badge>
        );
    }
  };

  const renderMobileNavItems = (withSeparator = true) => {
    const separator = withSeparator ? (
      <DropdownMenuSeparator className={`my-3 ${themeStyle.separatorColor}`} />
    ) : null;

    const navItemStyle = getMobileNavItemStyle(currentTheme);

    if (isAdmin) {
      return (
        <>
          <DropdownMenuGroup className="md:hidden space-y-2">
            <DropdownMenuItem
              asChild
              className="cursor-pointer focus:bg-transparent"
            >
              <Link
                to="/admin/dashboard"
                className="py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-black hover:text-white border border-gray-200 bg-white px-3 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5" />
                  대시보드
                </span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="cursor-pointer focus:bg-transparent"
            >
              <Link
                to="/admin/users"
                className="py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-black hover:text-white border border-gray-200 bg-white px-3 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  회원 관리
                </span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="cursor-pointer focus:bg-transparent"
            >
              <Link
                to="/product"
                className="py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-black hover:text-white border border-gray-200 bg-white px-3 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Boxes className="w-5 h-5" />
                  구독상품
                </span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          {separator}
        </>
      );
    }

    return (
      <>
        <DropdownMenuGroup className="md:hidden space-y-2">
          <DropdownMenuItem
            asChild
            className="cursor-pointer focus:bg-transparent"
          >
            <Link
              to="/product"
              className="py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-black hover:text-white border border-gray-200 bg-white px-3 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Boxes className="w-5 h-5" />
                구독상품
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="cursor-pointer focus:bg-transparent"
          >
            <Link
              to="/party"
              className="py-2.5 flex items-center justify-between gap-3 font-black text-black rounded-2xl hover:bg-black hover:text-white border border-gray-200 bg-white px-3 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                파티 찾기
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {separator}
      </>
    );
  };
  return (
    <header className="sticky top-0 z-[100] isolate w-full bg-transparent border-b border-transparent">
      {/* 스크롤시 슈웅~ 나타나는 반투명 배경 */}
      <div
        className={`
          absolute left-1/2 -translate-x-1/2 top-2 h-16
          w-[calc(100%-2rem)] max-w-7xl
          bg-white/40 backdrop-blur-2xl backdrop-saturate-150
          rounded-2xl border border-white/30
          shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4)]
          transition-all duration-300 ease-out
          ${
            isScrolled
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }
        `}
      />
      <div className="relative w-full max-w-7xl mx-auto h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 min-w-0">
          <Link to="/" className="shrink-0">
            <Sticker className="px-4 py-2 rounded-2xl">
              <span className="text-2xl font-black tracking-tight">MoA!</span>
            </Sticker>
          </Link>

          <nav className="hidden md:flex items-center gap-3 min-w-0">
            {isAdmin ? (
              <>
                <NavPill
                  theme={currentTheme}
                  to="/admin/dashboard"
                  icon={LayoutDashboard}
                  active={isActive("/admin/dashboard")}
                >
                  대시보드
                </NavPill>
                <NavPill
                  theme={currentTheme}
                  to="/admin/users"
                  icon={Users}
                  active={isActive("/admin/users")}
                >
                  회원 관리
                </NavPill>
                <NavPill
                  theme={currentTheme}
                  to="/product"
                  icon={Boxes}
                  active={isActive("/product")}
                >
                  구독상품
                </NavPill>
              </>
            ) : (
              <>
                <NavPill
                  theme={currentTheme}
                  to="/product"
                  icon={Boxes}
                  active={isActive("/product")}
                >
                  구독상품
                </NavPill>
                <NavPill
                  theme={currentTheme}
                  to="/party"
                  icon={Users}
                  active={isActive("/party")}
                >
                  파티 찾기
                </NavPill>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3 justify-end shrink-0">
          {user ? (
            <>
              {user?.role === "ADMIN" && (
                <Sticker className="hidden lg:flex items-center gap-2 rounded-2xl px-3 py-2">
                  <Switch
                    id="admin-mode"
                    checked={isAdminMode}
                    onCheckedChange={handleAdminSwitch}
                    className={`${
                      currentTheme === "dark"
                        ? "data-[state=checked]:bg-[#635bff] data-[state=unchecked]:bg-gray-600"
                        : currentTheme === "christmas"
                        ? "data-[state=checked]:bg-[#c41e3a] data-[state=unchecked]:bg-gray-300"
                        : "data-[state=checked]:bg-black data-[state=unchecked]:bg-slate-300"
                    }`}
                  />
                  <Label
                    htmlFor="admin-mode"
                    className={`text-[11px] font-black cursor-pointer tracking-[0.18em] uppercase ${themeStyle.stickerText}`}
                  >
                    {isAdminMode ? "SUP" : "MGR"}
                  </Label>
                </Sticker>
              )}

              <Sticker className="rounded-2xl p-1.5">
                <NotificationPopover />
              </Sticker>

              <Separator
                orientation="vertical"
                className={`h-9 hidden sm:block ${themeStyle.separatorColor}`}
              />

              {/* 데스크탑용 아바타 드롭다운 */}
              <div className="relative hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 cursor-pointer">
                      <Sticker className="rounded-2xl p-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-gray-200 bg-slate-50">
                            <AvatarImage
                              src={profileImageUrl}
                              alt={displayNickname}
                            />
                            <AvatarFallback
                              className={`text-lg font-black ${themeStyle.avatarFallback}`}
                            >
                              {userInitial}
                            </AvatarFallback>
                          </Avatar>

                          <div className="hidden xl:flex flex-col items-start gap-0.5 w-32 overflow-hidden">
                            <span
                              className={`text-[15px] font-black leading-tight truncate text-left ${themeStyle.stickerText}`}
                            >
                              {displayNickname}
                            </span>
                            {renderProviderBadge()}
                          </div>
                        </div>
                      </Sticker>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    usePortal={false}
                    className="w-48 p-2 bg-white border border-gray-200 rounded-2xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] z-[150]"
                  >
                    {!isAdmin && (
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer focus:bg-transparent p-0 mb-1"
                      >
                        <Link
                          to="/mypage"
                          className="w-full px-3 py-2.5 flex items-center gap-2 font-bold text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <Home className="w-4 h-4" />
                          마이페이지
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer focus:bg-transparent p-0"
                    >
                      <div className="w-full px-3 py-2.5 flex items-center gap-2 font-bold text-red-500 rounded-xl hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" />
                        로그아웃
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="relative md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="p-0 border-0 bg-transparent hover:bg-transparent"
                    >
                      <div
                        className={`${themeStyle.menuBg} ${
                          themeStyle.menuBorder
                        } ${
                          currentTheme === "pop" ? "" : "shadow-lg"
                        } w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200`}
                      >
                        <Menu className={`w-6 h-6 ${themeStyle.menuText}`} />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    usePortal={false}
                    className="w-72 sm:w-80 max-w-[calc(100vw-24px)] p-3 bg-white border border-gray-200 rounded-3xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] z-[150]"
                  >
                    {!isAdmin && (
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer focus:bg-transparent p-0 mb-3"
                      >
                        <Link to="/mypage">
                          <div
                            className={`rounded-2xl p-3 w-full ${themeStyle.dropdownItemBg} hover:opacity-80 transition-opacity`}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-11 w-11 border border-gray-200 bg-white">
                                <AvatarImage
                                  src={profileImageUrl}
                                  alt={displayNickname}
                                />
                                <AvatarFallback
                                  className={`text-lg font-black ${themeStyle.avatarFallback}`}
                                >
                                  {userInitial}
                                </AvatarFallback>
                              </Avatar>

                              <div className="min-w-0 flex-1">
                                <p
                                  className={`text-sm font-black truncate ${themeStyle.dropdownItemText}`}
                                >
                                  {displayNickname}님
                                </p>
                                <p
                                  className={`text-xs font-bold truncate ${themeStyle.dropdownItemSubtext}`}
                                >
                                  {displayEmail}
                                </p>
                                <div className="mt-1">
                                  {renderProviderBadge()}
                                </div>
                              </div>
                              <ChevronRight
                                className={`w-5 h-5 ${themeStyle.dropdownItemSubtext}`}
                              />
                            </div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {isAdmin && (
                      <DropdownMenuLabel className="font-normal p-0 mb-3">
                        <div
                          className={`rounded-2xl p-3 ${themeStyle.dropdownItemBg}`}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-11 w-11 border border-gray-200 bg-white">
                              <AvatarImage
                                src={profileImageUrl}
                                alt={displayNickname}
                              />
                              <AvatarFallback
                                className={`text-lg font-black ${themeStyle.avatarFallback}`}
                              >
                                {userInitial}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0 flex-1">
                              <p
                                className={`text-sm font-black truncate ${themeStyle.dropdownItemText}`}
                              >
                                {displayNickname}님
                              </p>
                              <p
                                className={`text-xs font-bold truncate ${themeStyle.dropdownItemSubtext}`}
                              >
                                {displayEmail}
                              </p>
                              <div className="mt-1">
                                {renderProviderBadge()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                    )}
                    {user?.role === "ADMIN" && (
                      <div className="lg:hidden mb-3">
                        <Sticker className="rounded-2xl px-3 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex flex-col">
                              <span
                                className={`text-xs font-black tracking-[0.18em] uppercase ${themeStyle.dropdownItemText}`}
                              >
                                ADMIN MODE
                              </span>
                              <span
                                className={`text-[11px] font-bold ${themeStyle.dropdownItemSubtext}`}
                              >
                                {isAdminMode ? "SUP" : "MGR"}
                              </span>
                            </div>
                            <Switch
                              id="admin-mode-dd"
                              checked={isAdminMode}
                              onCheckedChange={handleAdminSwitch}
                              className={`${
                                currentTheme === "dark"
                                  ? "data-[state=checked]:bg-[#635bff] data-[state=unchecked]:bg-gray-600"
                                  : currentTheme === "christmas"
                                  ? "data-[state=checked]:bg-[#c41e3a] data-[state=unchecked]:bg-gray-300"
                                  : "data-[state=checked]:bg-black data-[state=unchecked]:bg-slate-300"
                              }`}
                            />
                          </div>
                        </Sticker>
                      </div>
                    )}

                    {renderMobileNavItems()}

                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={logout}
                        className="cursor-pointer focus:bg-transparent p-0"
                      >
                        <div className="w-full">
                          <div
                            className={`w-full rounded-2xl px-4 py-3 transition-all duration-200 ${themeStyle.accentBg} border border-gray-200`}
                          >
                            <div
                              className={`flex items-center justify-between gap-2 font-black ${themeStyle.accentText}`}
                            >
                              <span className="flex items-center gap-2">
                                <LogOut className="w-5 h-5" />
                                로그아웃
                              </span>
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="p-0 border-0 bg-transparent hover:bg-transparent"
                    >
                      <Sticker className="w-12 h-12 rounded-2xl flex items-center justify-center">
                        <Menu className={`w-6 h-6 ${themeStyle.stickerText}`} />
                      </Sticker>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    usePortal={false}
                    className="w-72 sm:w-80 max-w-[calc(100vw-24px)] p-3 bg-white border border-gray-200 rounded-3xl shadow-[4px_4px_12px_rgba(0,0,0,0.08)] z-[150]"
                  >
                    {renderMobileNavItems(false)}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Link to="/signup" className="hidden sm:block">
                <Sticker className="px-4 py-2 rounded-2xl">
                  <span className={`font-black ${themeStyle.stickerText}`}>회원가입</span>
                </Sticker>
              </Link>

              <Link to="/login">
                <div
                  className={`${themeStyle.menuBg} ${themeStyle.menuBorder} ${
                    currentTheme === "pop" ? "" : "shadow-lg"
                  } px-5 py-2 rounded-2xl transition-all duration-200`}
                >
                  <span className={`font-black ${themeStyle.menuText}`}>
                    로그인
                  </span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
