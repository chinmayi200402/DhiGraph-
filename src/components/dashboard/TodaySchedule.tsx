import { motion } from "framer-motion";
import { Clock, MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export function TodaySchedule() {
  const navigate = useNavigate();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["today-appointments"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const res = await fetch(
        `http://localhost:5000/api/appointments?date=${encodeURIComponent(today)}`
      );
      if (!res.ok) {
        throw new Error("Failed to load today's appointments");
      }
      const data = await res.json();
      return (data || []).slice(0, 4);
    },
  });

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-card rounded-2xl border border-border p-4 md:p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="font-display text-base md:text-lg font-semibold">Today's Schedule</h3>
        </div>
        <div className="space-y-3 md:space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-muted/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-card rounded-2xl border border-border p-4 md:p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="font-display text-base md:text-lg font-semibold">Today's Schedule</h3>
        <span className="text-xs md:text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground mb-2">No appointments for today</p>
          <button
            onClick={() => navigate("/scheduler")}
            className="text-sm text-primary hover:underline"
          >
            Schedule a therapy
          </button>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {appointments.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="relative pl-5 md:pl-6 pb-3 md:pb-4 last:pb-0 border-l-2 border-border last:border-transparent cursor-pointer"
              onClick={() => navigate("/daily-schedule")}
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-0 -translate-x-1/2 w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-primary ring-4 ring-background" />

              <div className="bg-muted/30 rounded-xl p-3 md:p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground text-sm md:text-base truncate">
                      {item.therapy_id?.name || "Unknown Therapy"}
                    </p>
                    <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground mt-1">
                      <User className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">
                        {item.patient_id?.name || "Unknown Patient"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-medium text-primary text-sm">
                      {item.start_time?.slice(0, 5)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.therapy_id?.duration_minutes || 60} min
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Room {item.room_id?.room_number || "N/A"}
                  </span>
                  <span className="hidden sm:inline">
                    {item.therapist_id?.name || "Unassigned"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
