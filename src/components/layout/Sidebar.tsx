import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Activity,
  Calendar,
  Clock,
  Route,
  Package,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Leaf,
  FileText,
  Menu,
  X,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Patients", path: "/patients" },
  { icon: Activity, label: "Prakriti Assessment", path: "/prakriti" },
  { icon: Calendar, label: "Therapy Scheduler", path: "/scheduler" },
  { icon: Clock, label: "Daily Schedule", path: "/daily-schedule" },
  { icon: Route, label: "Treatment Journey", path: "/treatment-journey" },
  { icon: Package, label: "Inventory", path: "/inventory" },
  { icon: BarChart3, label: "Reports", path: "/reports" },
  { icon: FileText, label: "Discharge Summary", path: "/discharge-summary" },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleNavClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const sidebarContent = (
    <>
      <div className="flex flex-col gap-2 p-4 md:p-6 border-b border-sidebar-border relative">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden border border-slate-100"
          >
            <img src="/logo.png" alt="Adichunchanagiri AMC" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<span class=\"text-xs font-bold text-slate-400\">AMC</span>'); }} />
          </motion.div>
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <h1 className="font-display text-lg font-bold text-white leading-tight drop-shadow-md">
                  Adichunchanagiri
                </h1>
                <p className="text-[11px] font-bold text-[#e1b15c] tracking-widest mt-0.5">AAMCHRC</p>
              </motion.div>
            )}
          </AnimatePresence>
          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <AnimatePresence>
          {(!collapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-2"
            >
              <p className="text-[11px] uppercase tracking-wider text-white/95 leading-normal font-bold text-center border-t border-sidebar-border/50 pt-3 mt-2 drop-shadow-sm">
                Adichunchanagiri Ayurveda Medical College Hospital & Research Centre
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 md:py-6 px-2 md:px-3 space-y-1 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={item.path}
                onClick={handleNavClick}
                className={cn(
                  "flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sidebar-primary rounded-r-full"
                  />
                )}
                <Icon className={cn(
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  isActive ? "text-sidebar-primary" : "group-hover:text-sidebar-primary"
                )} />
                <AnimatePresence>
                  {(!collapsed || isMobile) && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-medium text-sm whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* DhiGraph Branding Footer */}
      <div className="p-4 border-t border-sidebar-border">
          <AnimatePresence>
            {(!collapsed || isMobile) ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 mb-4"
              >
                <Brain className="w-5 h-5 text-sidebar-primary" />
                <span className="font-bold text-white tracking-wide text-sm font-display">DhiGraph</span>
              </motion.div>
            ) : (
               <div className="flex justify-center mb-4">
                 <Brain className="w-5 h-5 text-sidebar-primary" />
               </div>
            )}
          </AnimatePresence>

          {/* Collapse Toggle - Desktop only */}
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm">Collapse</span>
                </>
              )}
            </button>
          )}
      </div>
    </>
  );

  // Mobile sidebar with overlay
  if (isMobile) {
    return (
      <>
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-primary text-primary-foreground shadow-lg md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed left-0 top-0 h-screen w-[280px] bg-sidebar z-50 flex flex-col shadow-2xl md:hidden"
              >
                {sidebarContent}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop sidebar
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-sidebar z-50 flex-col shadow-2xl hidden md:flex"
    >
      {sidebarContent}
    </motion.aside>
  );
}
