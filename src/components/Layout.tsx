import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Modal } from "./Modal";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Home,
  ClipboardList,
  UserCircle,
  LogOut,
  Moon,
  Sun,
  Bell,
  Plus,
  Trophy,
} from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const navItems = [
    { path: "/dashboard", label: "Home", icon: Home },
    { path: "/tasks", label: "All Tasks", icon: ClipboardList },
    { path: "/my-tasks", label: "My Tasks", icon: UserCircle },
    { path: "/add-task", label: "Add Task", icon: Plus },
  ];

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-gray-900">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-[#1E3A8A] shadow-md">
        <div className="flex items-center justify-between px-4 py-3 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white font-sans tracking-wide">
                PHP Directory
              </h1>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-sans ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                        layoutId="navbar-indicator"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Leaderboard Button */}
            <Link
              to="/leaderboard"
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-medium font-sans"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-blue-700/80 transition-colors text-white"
              aria-label="Toggle theme"
              title={isDark ? "Light Mode" : "Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            <button
              className="p-2 rounded-lg hover:bg-blue-700/80 relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Logout */}
            <button
              onClick={() => setLogoutModalOpen(true)}
              className="p-2 rounded-lg hover:bg-blue-700/80 transition-colors"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-white/20">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-semibold">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
              <span className="hidden lg:block font-medium text-white font-sans">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-white/20 px-4 py-2">
          <nav className="flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors font-sans whitespace-nowrap ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main className="p-4 lg:p-6 bg-[#FAF9F6] dark:bg-gray-900 min-h-[calc(100vh-80px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
      {/* Logout confirmation modal */}
      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Confirm Logout"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to log out?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setLogoutModalOpen(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                setLogoutModalOpen(false);
                await handleLogout();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
