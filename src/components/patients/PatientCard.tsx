import { motion } from "framer-motion";
import { Phone, Activity, Calendar, ChevronRight } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Patient = Tables<"patients"> & {
  prakriti?: string | null;
  status?: "In Treatment" | "Scheduled" | "Completed" | "New";
};

const statusColors = {
  "In Treatment": "bg-primary/20 text-primary border-primary/30",
  "Scheduled": "bg-highlight/20 text-highlight border-highlight/30",
  "Completed": "bg-accent/20 text-accent border-accent/30",
  "New": "bg-muted text-muted-foreground border-border",
};

interface PatientCardProps {
  patient: Patient;
  index: number;
  onClick?: () => void;
}

export function PatientCard({ patient, index, onClick }: PatientCardProps) {
  const avatar = patient.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const status = patient.status || "New";
  const registeredDate = new Date(patient.created_at).toLocaleDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.05 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold text-lg">
          {avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {patient.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {patient.age} yrs • {patient.gender}
              </p>
            </div>
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColors[status]}`}
            >
              {status}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="w-3.5 h-3.5" />
          {patient.contact}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="w-3.5 h-3.5" />
          {patient.prakriti || "Assessment pending"}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          Registered: {registeredDate}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
          {patient.blood_group || "—"}
        </span>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </motion.div>
  );
}
