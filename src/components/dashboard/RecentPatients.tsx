import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

const statusColors = {
  "In Treatment": "bg-primary/20 text-primary",
  "Scheduled": "bg-highlight/20 text-highlight",
  "Completed": "bg-accent/20 text-accent",
};

function getPatientCreatedDate(patient: any): Date | null {

  const raw =
    patient?.created_at ??
    patient?.createdAt ??
    patient?.registration_date ??
    patient?.registrationDate;

  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function RecentPatients() {
  const navigate = useNavigate();

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ["recent-patients"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/patients");
      if (!res.ok) {
        throw new Error("Failed to load patients");
      }
      const allPatients = await res.json();
      return (allPatients || []).slice(0, 4);
    },
  });

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-card rounded-2xl border border-border p-4 md:p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="font-display text-base md:text-lg font-semibold">Recent Patients</h3>
        </div>
        <div className="space-y-3 md:space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card rounded-2xl border border-border p-4 md:p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h3 className="font-display text-base md:text-lg font-semibold">Recent Patients</h3>
        <Link
          to="/patients"
          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {patients.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No patients yet. Add your first patient!
        </p>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {patients.map((patient, index) => (
            (() => {
              const createdDate = getPatientCreatedDate(patient);
              const createdText = createdDate
                ? formatDistanceToNow(createdDate, { addSuffix: true })
                : "";

              return (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3 md:gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => navigate("/patients")}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-medium text-sm flex-shrink-0">
                    {patient.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {patient.name}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {patient.age} yrs • {patient.gender}
                    </p>
                  </div>
                  {createdText ? (
                    <span className="text-xs text-muted-foreground hidden sm:block">{createdText}</span>
                  ) : null}
                </motion.div>
              );
            })()
          ))}
        </div>
      )}
    </motion.div>
  );
}
