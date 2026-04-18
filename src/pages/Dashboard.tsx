import { motion } from "framer-motion";
import { Users, Calendar, Heart, Package, Plus, Clock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/ui/stat-card";
import { RecentPatients } from "@/components/dashboard/RecentPatients";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import { InventoryAlert } from "@/components/dashboard/InventoryAlert";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.name || "User";
  const userRole = location.state?.role || "admin";

  const displayName = userRole === "doctor" ? `Dr. ${userName}` : userName;

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/dashboard/stats");
      if (!res.ok) {
        throw new Error("Failed to load dashboard stats");
      }
      return res.json() as Promise<{
        totalPatients: number;
        todayAppointments: number;
        completedToday: number;
        inventoryItems: number;
        lowStockAlerts: number;
      }>;
    },
  });

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "new-patient":
        navigate("/patients");
        break;
      case "schedule-therapy":
        navigate("/scheduler");
        break;
      case "prakriti-assessment":
        navigate("/prakriti");
        break;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-4 text-center mb-6"
        >
          <div className="flex flex-col items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="h-32 w-32 rounded-full overflow-hidden bg-white shadow-xl border-4 border-white/80 shrink-0"
            >
              <img 
                src="/logo.png" 
                alt="Adichunchanagiri Ayurvedic Medical College Logo" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <h1 className="font-display text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-highlight drop-shadow-sm px-4 max-w-4xl leading-tight">
              Adichunchanagiri Ayurvedic Medical College Hospital & Research Centre
            </h1>
          </div>
          <div className="mt-2">
            <p className="font-display text-lg md:text-xl font-semibold text-foreground">
              Welcome back, <span className="text-gradient">{displayName}</span>
            </p>
            <p className="text-sm md:text-base text-muted-foreground">
              Here's what's happening at your Ayurvedic center today
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <StatCard
            title="Total Patients"
            value={stats?.totalPatients || 0}
            subtitle="Active registered patients"
            icon={Users}
            variant="primary"
            delay={0.1}
            onClick={() => navigate("/patients")}
          />
          <StatCard
            title="Today's Appointments"
            value={stats?.todayAppointments || 0}
            subtitle={`${stats?.completedToday || 0} completed`}
            icon={Calendar}
            variant="accent"
            delay={0.15}
            onClick={() => navigate("/daily-schedule")}
          />
          <StatCard
            title="Active Treatments"
            value={Math.max(0, (stats?.todayAppointments || 0) - (stats?.completedToday || 0))}
            subtitle="Treatments remaining today"
            icon={Heart}
            variant="highlight"
            delay={0.2}
            onClick={() => navigate("/treatment-journey")}
          />
          <StatCard
            title="Inventory Items"
            value={stats?.inventoryItems || 0}
            subtitle={`${stats?.lowStockAlerts || 0} low stock alerts`}
            icon={Package}
            delay={0.25}
            onClick={() => navigate("/inventory")}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Recent Patients */}
          <div className="lg:col-span-1">
            <RecentPatients />
          </div>

          {/* Today's Schedule */}
          <div className="lg:col-span-1">
            <TodaySchedule />
          </div>

          {/* Inventory Alert */}
          <div className="lg:col-span-1">
            <InventoryAlert />
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-primary/10 via-accent/10 to-highlight/10 rounded-2xl p-4 md:p-6 border border-primary/20"
        >
          <h3 className="font-display text-base md:text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction("new-patient")}
              className="flex items-center gap-2 px-4 md:px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Patient</span>
              <span className="sm:hidden">Patient</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction("schedule-therapy")}
              className="flex items-center gap-2 px-4 md:px-5 py-2.5 bg-accent text-accent-foreground rounded-xl font-medium text-sm hover:bg-accent/90 transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Schedule Therapy</span>
              <span className="sm:hidden">Schedule</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
