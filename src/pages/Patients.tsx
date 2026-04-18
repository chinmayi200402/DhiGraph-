import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Filter, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { PatientRegistrationForm, PatientFormData } from "@/components/patients/PatientRegistrationForm";
import { PrakritiPromptModal } from "@/components/patients/PrakritiPromptModal";
import { PatientCard } from "@/components/patients/PatientCard";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import NfcScanner from "@/components/features/NfcScanner";

type Patient = Tables<"patients"> & {
  prakriti?: string | null;
  status?: "In Treatment" | "Scheduled" | "Completed" | "New";
};

export default function Patients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrakritiPrompt, setShowPrakritiPrompt] = useState(false);
  const [newPatientData, setNewPatientData] = useState<{ id: string; name: string } | null>(null);

  // Fetch patients with their prakriti assessment status
  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/patients");
      if (!res.ok) {
        throw new Error("Failed to load patients");
      }
      const data: Patient[] = await res.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to load patients");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(patient.contact ?? "").includes(searchQuery) ||
    (patient.blood_group && patient.blood_group.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddPatient = async (formData: PatientFormData) => {
    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          age: parseInt(formData.age),
          gender: formData.gender,
          contact: formData.contact,
          blood_group: formData.blood_group || null,
          address: formData.address || null,
          serial_no: formData.serial_no || null,
          abha_id: formData.abha_id || null,
          resident_status: formData.resident_status || null,
          socio_economic_status: formData.socio_economic_status || null,
          education: formData.education || null,
          occupation: formData.occupation || null,
          opd_no: formData.opd_no || null,
          ipd_no: formData.ipd_no || null,
          chief_complaint: formData.chief_complaint || null,
          registration_date: formData.registration_date.toISOString().split("T")[0],
        }),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || "Failed to create patient");
      }

      const data = await res.json();
      toast.success("Patient registered successfully!");
      setShowAddModal(false);
      setNewPatientData({ id: data.id, name: data.name });
      setShowPrakritiPrompt(true);
      fetchPatients();
    } catch (error: any) {
      console.error("Error adding patient:", error);
      if (error.message?.includes("duplicate key")) {
        toast.error("A patient with this ABHA ID already exists");
      } else {
        toast.error("Failed to register patient");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartPrakritiAssessment = () => {
    if (newPatientData) {
      setShowPrakritiPrompt(false);
      navigate(`/prakriti?patientId=${newPatientData.id}&patientName=${encodeURIComponent(newPatientData.name)}`);
    }
  };

  const handleSkipPrakriti = () => {
    setShowPrakritiPrompt(false);
    setNewPatientData(null);
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
              Patient Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all patients at your center
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Patient
          </motion.button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="w-full mb-6"
        >
          <NfcScanner onPatientFound={(patient) => navigate(`/patient-details?patientId=${patient._id}&patientName=${encodeURIComponent(patient.name)}`)} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, contact, or blood group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-11 rounded-xl border-border bg-card"
            />
          </div>
          <button
            onClick={fetchPatients}
            className="flex items-center gap-2 px-4 py-2.5 bg-muted text-muted-foreground rounded-xl font-medium text-sm hover:bg-muted/80 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-muted text-muted-foreground rounded-xl font-medium text-sm hover:bg-muted/80 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </motion.div>

        {/* Patient Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl border border-border p-5 animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPatients.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">
              {searchQuery ? "No patients found matching your search." : "No patients registered yet."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 text-primary hover:underline"
              >
                Add your first patient
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPatients.map((patient, index) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                index={index}
                onClick={() => navigate(`/patient-details?patientId=${patient.id}&patientName=${encodeURIComponent(patient.name)}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {showAddModal && (
          <PatientRegistrationForm
            onSubmit={handleAddPatient}
            onCancel={() => setShowAddModal(false)}
            isLoading={isSaving}
          />
        )}
      </AnimatePresence>

      {/* Prakriti Prompt Modal */}
      <AnimatePresence>
        {showPrakritiPrompt && newPatientData && (
          <PrakritiPromptModal
            patientName={newPatientData.name}
            onStartAssessment={handleStartPrakritiAssessment}
            onSkip={handleSkipPrakriti}
          />
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
