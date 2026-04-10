import { motion } from "framer-motion";
import { Users, Calendar, Heart, Package, Plus, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/ui/stat-card";
import { RecentPatients } from "@/components/dashboard/RecentPatients";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import { InventoryAlert } from "@/components/dashboard/InventoryAlert";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [patients, appointments, inventory] = await Promise.all([
        supabase.from("patients").select("id", { count: "exact" }),
        supabase.from("appointments").select("id, status").eq("date", new Date().toISOString().split("T")[0]),
        supabase.from("inventory").select("id, quantity, min_stock_level"),
      ]);

      const lowStockCount = (inventory.data || []).filter(
        item => item.quantity < item.min_stock_level
      ).length;

      const completedToday = (appointments.data || []).filter(
        a => a.status === "Completed"
      ).length;

      return {
        totalPatients: patients.count || 0,
        todayAppointments: appointments.data?.length || 0,
        completedToday,
        inventoryItems: inventory.data?.length || 0,
        lowStockAlerts: lowStockCount,
      };
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
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="font-display text-xl md:text-2xl font-bold text-foreground">
              AMC - PANCHAKARMA APP
            </h1>
          </div>
          <div className="mt-2">
            <p className="font-display text-lg md:text-xl font-semibold text-foreground">
              Welcome back, <span className="text-gradient">Dr. Admin</span>
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
            subtitle="Active patients"
            icon={Users}
            variant="primary"
            delay={0.1}
          />
          <StatCard
            title="Today's Appointments"
            value={stats?.todayAppointments || 0}
            subtitle={`${stats?.completedToday || 0} completed`}
            icon={Calendar}
            variant="accent"
            delay={0.15}
          />
          <StatCard
            title="Active Treatments"
            value={stats?.todayAppointments || 0}
            subtitle="Panchakarma in progress"
            icon={Heart}
            variant="highlight"
            delay={0.2}
          />
          <StatCard
            title="Inventory Items"
            value={stats?.inventoryItems || 0}
            subtitle={`${stats?.lowStockAlerts || 0} low stock alerts`}
            icon={Package}
            delay={0.25}
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
