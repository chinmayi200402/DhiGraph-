import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import ScribblePad from "@/components/features/ScribblePad";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DEPARTMENTS = [
  "Kayachikitsa",
  "Panchakarma",
  "Shalakya",
  "Shalya(MOT)",
  "Atyayika",
  "Swasthavrutta",
  "PTSR"
];

export default function PatientDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId") || "unmapped-patient";
  const patientName = searchParams.get("patientName") || "Unknown Patient";
  const doctorName = "Dr. Ayush Practitioner";

  const [department, setDepartment] = useState<string>("");

  return (
    <div className="flex flex-col w-full h-screen bg-slate-50 overflow-hidden relative">
      <div className="flex flex-col h-full w-full">
        {/* Header with Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 bg-white px-6 py-4 shadow-sm z-10 shrink-0"
        >
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Patient Details & Case History
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Active Session: {doctorName} | Patient: {decodeURIComponent(patientName)}
            </p>
          </div>
          
          <div className="ml-auto flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
            <span className="text-sm font-semibold text-slate-700 whitespace-nowrap px-2">Referred Department:</span>
            <div className="w-64">
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="border-2 border-primary/20 hover:border-primary focus:ring-primary w-full shadow-sm text-base py-6">
                  <SelectValue placeholder="-- Please Select Department --" />
                </SelectTrigger>
                <SelectContent className="z-[99999] bg-white border shadow-xl">
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept} className="font-medium hover:bg-slate-100 cursor-pointer text-base py-3">
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Edge-to-Edge Scribble Pad */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 w-full h-full overflow-hidden"
        >
          {department ? (
            <ScribblePad 
              patientId={patientId} 
              doctorId="dr_ayush_01" 
              fullScreenMode={true} 
              doctorName={doctorName}
              department={department}
            />
          ) : (
            <div className="flex-1 w-full h-full flex items-center justify-center bg-white/50">
              <div className="text-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-md">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ChevronLeft className="w-10 h-10 text-blue-500 rotate-180" />
                </div>
                <h2 className="text-2xl font-semibold mb-3 text-slate-800">Select a Department</h2>
                <p className="text-slate-500 leading-relaxed">
                  Please select a department from the top right dropdown menu to load the respective clinical case sheet and open the scribble pad.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
