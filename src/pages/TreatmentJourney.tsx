import { useState } from "react";
import { motion } from "framer-motion";
import { User, Calendar, Check, ChevronDown, ChevronUp, Utensils, Heart } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ScribblePad from "@/components/features/ScribblePad";
import AiChatbot from "@/components/features/AiChatbot";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DayPlan {
  day: number;
  therapy: string;
  diet: string;
  vitals: {
    pulse: string;
    bp: string;
    appetite: string;
  };
  completed: boolean;
}

export default function TreatmentJourney() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/patients");
      if (!res.ok) throw new Error("Failed to load patients");
      return res.json();
    },
  });

  const { data: journey = [] } = useQuery({
    queryKey: ["treatment-journey", selectedPatientId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/api/treatment-journey?patient_id=${selectedPatientId}`);
      if (!res.ok) throw new Error("Failed to load journey");
      return res.json();
    },
    enabled: !!selectedPatientId,
  });

  const completeSessionMutation = useMutation({
    mutationFn: async ({ id, dayIndex }: { id: string; dayIndex: number }) => {
      // API normally
      const res = await fetch(`http://localhost:5000/api/treatment-journey/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_completed: true, completed_at: new Date() }),
      });
      if (!res.ok) throw new Error("Failed to update session");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatment-journey", selectedPatientId] });
      toast.success("Session completed tracking updated");
    },
  });

  const patient = patients.find((p: any) => p._id === selectedPatientId);
  const currentDay = journey.filter((d: any) => d.session_completed).length + 1;
  const progress = journey.length ? (journey.filter((d: any) => d.session_completed).length / journey.length) * 100 : 0;

  const handleCompleteSession = (journeyItem: any, dayIndex: number) => {
    // If it's a real journey ID, we process it. Otherwise skip gracefully
    if (journeyItem._id && journeyItem._id.length > 10) {
      completeSessionMutation.mutate({ id: journeyItem._id, dayIndex });
    } else {
      toast.info("Mock journey updated");
    }
  };

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
              Treatment Journey
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and manage patient treatment progress
            </p>
          </div>
          <div className="w-full md:w-72">
            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((p: any) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {!selectedPatientId ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-2xl border border-border p-12 text-center"
          >
            <User className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-display text-xl font-semibold mb-2">Select a Patient</h3>
            <p className="text-muted-foreground">
              Choose a patient to view their treatment journey
            </p>
          </motion.div>
        ) : (
          <>
            {/* Patient Info & Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-display text-xl font-semibold">
                    {patient?.name?.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-semibold">{patient?.name}</h2>
                    <p className="text-muted-foreground">Prakriti: {patient?.prakriti || "Not assessed"}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Treatment Progress</span>
                    <span className="font-medium">Day {currentDay} of {journey.length || "N/A"}</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {journey.filter((d: any) => d.session_completed).length} sessions completed
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-6">
                <h3 className="font-display text-lg font-semibold mb-4">Today's Session</h3>
                {journey[currentDay - 1] && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                       <Calendar className="w-4 h-4 text-primary" />
                       <span className="text-sm font-medium">Day {currentDay}</span>
                     </div>
                     <p className="font-semibold">{journey[currentDay - 1]?.therapy_id?.name || journey[currentDay - 1]?.notes}</p>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                       <Utensils className="w-4 h-4" />
                       <span>{journey[currentDay - 1]?.diet_plan || 'Custom Diet'}</span>
                     </div>
                  </div>
                )}
                {journey.length === 0 && (
                  <div className="text-sm text-muted-foreground">No active treatment plans scheduled for today.</div>
                )}
              </div>
            </motion.div>

            {/* Journey Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border p-6 shadow-sm"
            >
              <h3 className="font-display text-lg font-semibold mb-6">Treatment Timeline</h3>

              <div className="space-y-4">
                {journey.length === 0 && (
                   <p className="text-muted-foreground text-center py-4">No journey plans found.</p>
                )}
                {journey.map((day: any, index: number) => {
                  const isExpanded = expandedDay === index;
                  const isCurrent = index === currentDay - 1;

                  return (
                    <motion.div
                      key={day._id || day.day_number || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className={`rounded-xl border overflow-hidden transition-all ${
                        day.session_completed
                          ? "bg-primary/5 border-primary/20"
                          : isCurrent
                          ? "bg-highlight/5 border-highlight/30"
                          : "bg-muted/30 border-border"
                      }`}
                    >
                      <button
                        onClick={() => setExpandedDay(isExpanded ? null : index)}
                        className="w-full p-4 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                              day.session_completed
                                ? "bg-primary text-primary-foreground"
                                : isCurrent
                                ? "bg-highlight text-highlight-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {day.session_completed ? <Check className="w-5 h-5" /> : day.day_number || (index+1)}
                          </div>
                          <div>
                            <p className="font-semibold">
                              Day {day.day_number || (index+1)}: {day.therapy_id?.name || day.notes || 'Therapy'}
                            </p>
                            <p className="text-sm text-muted-foreground">{day.diet_plan || 'Custom Diet'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {isCurrent && !day.session_completed && (
                            <span className="px-2 py-1 bg-highlight/20 text-highlight text-xs font-medium rounded-lg">
                              Today
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 pb-4 border-t border-border/50"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="p-4 bg-background rounded-xl">
                              <p className="text-xs text-muted-foreground mb-1">Pulse Rate</p>
                              <p className="font-semibold">{day.vitals?.pulse || "—"} BPM</p>
                            </div>
                            <div className="p-4 bg-background rounded-xl">
                              <p className="text-xs text-muted-foreground mb-1">Blood Pressure</p>
                              <p className="font-semibold">{day.vitals?.bp || "—"}</p>
                            </div>
                            <div className="p-4 bg-background rounded-xl">
                              <p className="text-xs text-muted-foreground mb-1">Appetite</p>
                              <p className="font-semibold">{day.vitals?.appetite || "—"}</p>
                            </div>
                          </div>

                          {!day.session_completed && isCurrent && (
                            <Button
                              onClick={() => handleCompleteSession(day, index)}
                              className="w-full mt-4 rounded-xl bg-primary text-primary-foreground"
                              disabled={completeSessionMutation.isPending}
                            >
                              <Check className="w-4 h-4 mr-2" />
                              {completeSessionMutation.isPending ? "Completing..." : "Complete Session"}
                            </Button>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"
            >
              {/* Doctor's Scribble Note Pad */}
              <div>
                <ScribblePad 
                  patientId={patient?.id?.toString() || "mock_patient"} 
                  doctorId="mock_doctor_id" 
                  fullScreenMode={false}
                  doctorName="Dr. Ayush Practitioner"
                />
              </div>
              
              {/* AI Assistant */}
              <div>
                <AiChatbot patientId={patient?.id?.toString() || "mock_patient"} userId="mock_doctor_id" />
              </div>
            </motion.div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
