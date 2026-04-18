import { motion } from "framer-motion";
import { Clock, User, MapPin, CheckCircle2, Circle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";

import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

interface ScheduleItem {
  _id: string;
  time: string;
  endTime: string;
  therapy: { name: string };
  patient: { name: string };
  room: { name: string };
  therapist: { name: string };
  status: "Completed" | "In Progress" | "Scheduled" | "Cancelled";
}

// Replaced with dynamic fetch

const statusStyles: Record<string, { bg: string, border: string, icon: any, iconColor: string, label: string, labelBg: string }> = {
  "Completed": {
    bg: "bg-primary/10",
    border: "border-primary/30",
    icon: CheckCircle2,
    iconColor: "text-primary",
    label: "Completed",
    labelBg: "bg-primary/20 text-primary",
  },
  "In Progress": {
    bg: "bg-highlight/10",
    border: "border-highlight/30",
    icon: Clock,
    iconColor: "text-highlight",
    label: "In Progress",
    labelBg: "bg-highlight/20 text-highlight",
  },
  "Scheduled": {
    bg: "bg-muted/50",
    border: "border-border",
    icon: Circle,
    iconColor: "text-muted-foreground",
    label: "Scheduled",
    labelBg: "bg-muted text-muted-foreground",
  },
  "Cancelled": {
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    icon: Circle,
    iconColor: "text-destructive",
    label: "Cancelled",
    labelBg: "bg-destructive/20 text-destructive",
  },
};

const rooms = ["Room 101", "Room 102", "Room 103"];

export default function DailySchedule() {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const { data: scheduleItems = [], isLoading } = useQuery({
    queryKey: ["appointments", "today"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/appointments");
      if (!res.ok) throw new Error("Failed to load appointments");
      
      const allAppts: any[] = await res.json();
      
      // Filter for today
      const _today = new Date();
      return allAppts.filter(appt => {
        const apptDate = new Date(appt.date);
        return apptDate.getDate() === _today.getDate() && apptDate.getMonth() === _today.getMonth();
      }).map(appt => ({
        ...appt,
        time: appt.start_time,
        endTime: appt.end_time,
        patient: appt.patient_id,
        therapy: appt.therapy_id,
        room: appt.room_id,
        therapist: appt.therapist_id,
      }));
    },
  });

  const activeRooms = Array.from(new Set(scheduleItems.map((i: any) => i.room?.name || 'Unassigned Room')));

  const groupedByRoom = activeRooms.reduce((acc, room) => {
    acc[room] = scheduleItems.filter((item: any) => (item.room?.name || 'Unassigned Room') === room);
    return acc;
  }, {} as Record<string, ScheduleItem[]>);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">
              Daily Schedule
            </h1>
            <p className="text-muted-foreground mt-1">{today}</p>
          </div>
          <div className="flex gap-2">
            {Object.entries(statusStyles).map(([key, style]) => (
              <span
                key={key}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${style.labelBg}`}
              >
                {style.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4"
        >
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <p className="text-3xl font-display font-bold text-primary">
              {scheduleItems.filter((i: any) => i.status === "Completed").length}
            </p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <p className="text-3xl font-display font-bold text-highlight">
              {scheduleItems.filter((i: any) => i.status === "In Progress").length}
            </p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <p className="text-3xl font-display font-bold text-muted-foreground">
              {scheduleItems.filter((i: any) => i.status === "Scheduled").length}
            </p>
            <p className="text-sm text-muted-foreground">Scheduled</p>
          </div>
        </motion.div>

        {/* Room-wise Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {isLoading && <p>Loading appointments for today...</p>}
          {!isLoading && activeRooms.length === 0 && <p className="col-span-full text-center text-muted-foreground">No appointments currently scheduled for today.</p>}
          {activeRooms.map((room, roomIndex) => (
            <motion.div
              key={room}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + roomIndex * 0.1 }}
              className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm"
            >
              <div className="p-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-foreground">{room}</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {groupedByRoom[room].length} appointments today
                </p>
              </div>

              <div className="p-3 space-y-3 max-h-[500px] overflow-y-auto">
                {groupedByRoom[room].length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 text-sm">
                    No appointments
                  </p>
                ) : (
                  groupedByRoom[room].map((item: any, index) => {
                    const style = statusStyles[(item.status as keyof typeof statusStyles)] || statusStyles["Scheduled"];
                    const Icon = style.icon;

                    return (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className={`p-4 rounded-xl ${style.bg} border ${style.border}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-foreground">{item.therapy?.name || 'Unknown Therapy'}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.time} - {item.endTime}
                            </p>
                          </div>
                          <Icon className={`w-5 h-5 ${style.iconColor}`} />
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3 h-3" />
                            {item.patient?.name || 'Unknown'}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {item.therapist?.name || 'Unknown'}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl border border-border p-6 shadow-sm"
        >
          <h3 className="font-display text-lg font-semibold mb-6">Timeline</h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-4">
              {scheduleItems.map((item: any, index: number) => {
                const style = statusStyles[item.status as keyof typeof statusStyles] || statusStyles["Scheduled"];
                const Icon = style.icon;

                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="relative flex gap-4 pl-12"
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-4 w-5 h-5 rounded-full ${style.bg} border-2 ${style.border} flex items-center justify-center`}>
                      <Icon className={`w-3 h-3 ${style.iconColor}`} />
                    </div>

                    <div className={`flex-1 p-4 rounded-xl ${style.bg} border ${style.border}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{item.therapy?.name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{item.patient?.name || 'Unknown'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{item.time}</p>
                          <p className="text-xs text-muted-foreground">{item.room?.name || 'No Room'}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
