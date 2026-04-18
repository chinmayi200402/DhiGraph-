import { Check, Brain } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface PatientData {
  id: number;
  name: string;
  age: number;
  gender: string;
  contact: string;
  bloodGroup: string;
  admissionDate: string;
  dischargeDate: string;
  diagnosis: string;
  treatingDoctor: string;
  initialPrakriti: { vata: number; pitta: number; kapha: number };
  finalPrakriti: { vata: number; pitta: number; kapha: number };
  treatmentPlan: {
    day: number;
    therapy: string;
    completed: boolean;
  }[];
  dietAdvice: string[];
  followUp: string;
}

interface DischargePrintViewProps {
  patient: PatientData;
}

export function DischargePrintView({ patient }: DischargePrintViewProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const initialData = [
    { dosha: "Vata", value: patient.initialPrakriti.vata },
    { dosha: "Pitta", value: patient.initialPrakriti.pitta },
    { dosha: "Kapha", value: patient.initialPrakriti.kapha },
  ];

  const finalData = [
    { dosha: "Vata", value: patient.finalPrakriti.vata },
    { dosha: "Pitta", value: patient.finalPrakriti.pitta },
    { dosha: "Kapha", value: patient.finalPrakriti.kapha },
  ];

  const getDominantDosha = (prakriti: { vata: number; pitta: number; kapha: number }) => {
    const { vata, pitta, kapha } = prakriti;
    if (vata >= pitta && vata >= kapha) return "Vata";
    if (pitta >= vata && pitta >= kapha) return "Pitta";
    return "Kapha";
  };

  return (
    <div className="bg-white p-8 max-w-[800px] mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col items-center text-center border-b-2 border-[#2D5A27] pb-6 mb-6">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg overflow-hidden border border-[#2D5A27]/20 shrink-0 mb-4 mt-2">
          <img src="/logo.png" alt="AMC Logo" className="w-full h-full object-cover" />
        </div>
        
        <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-[#2D5A27] leading-tight">
          Adichunchanagiri Ayurveda Medical College
        </h1>
        <p className="text-md font-semibold text-[#8B5E3C] mt-1.5 mb-1">Hospital & Research Centre</p>
        
        <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-[#2D5A27]/20 w-64">
          <Brain className="w-5 h-5 text-[#2D5A27]" />
          <span className="text-[11px] uppercase font-extrabold tracking-widest text-[#2D5A27] drop-shadow-sm">Powered by DhiGraph</span>
        </div>
        
        <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-semibold text-[#2D5A27] mt-5 tracking-wide">
          DISCHARGE SUMMARY
        </h2>
      </div>

      {/* Patient Details */}
      <div className="mb-6">
        <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg font-semibold text-[#2D5A27] mb-3 border-b border-[#2D5A27]/30 pb-1">
          Patient Information
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p><span className="font-medium text-[#8B5E3C]">Name:</span> {patient.name}</p>
            <p><span className="font-medium text-[#8B5E3C]">Age/Gender:</span> {patient.age} years / {patient.gender}</p>
            <p><span className="font-medium text-[#8B5E3C]">Blood Group:</span> {patient.bloodGroup}</p>
            <p><span className="font-medium text-[#8B5E3C]">Contact:</span> {patient.contact}</p>
          </div>
          <div className="space-y-2">
            <p><span className="font-medium text-[#8B5E3C]">Admission Date:</span> {formatDate(patient.admissionDate)}</p>
            <p><span className="font-medium text-[#8B5E3C]">Discharge Date:</span> {formatDate(patient.dischargeDate)}</p>
            <p><span className="font-medium text-[#8B5E3C]">Duration:</span> {patient.treatmentPlan.length} days</p>
            <p><span className="font-medium text-[#8B5E3C]">Treating Doctor:</span> {patient.treatingDoctor}</p>
          </div>
        </div>
      </div>

      {/* Diagnosis */}
      <div className="mb-6">
        <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg font-semibold text-[#2D5A27] mb-3 border-b border-[#2D5A27]/30 pb-1">
          Diagnosis
        </h3>
        <p className="text-sm bg-[#F9FBF9] p-3 rounded-lg border border-[#2D5A27]/20">
          {patient.diagnosis}
        </p>
      </div>

      {/* Prakriti Assessment - Before & After */}
      <div className="mb-6">
        <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg font-semibold text-[#2D5A27] mb-3 border-b border-[#2D5A27]/30 pb-1">
          Prakriti Assessment (Before & After Treatment)
        </h3>
        <div className="grid grid-cols-2 gap-6">
          {/* Initial Prakriti */}
          <div className="bg-[#F9FBF9] rounded-xl p-4 border border-[#2D5A27]/20">
            <p className="text-center font-semibold text-sm text-[#8B5E3C] mb-2">
              Initial Assessment
            </p>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={initialData}>
                  <PolarGrid stroke="#2D5A27" strokeOpacity={0.3} />
                  <PolarAngleAxis
                    dataKey="dosha"
                    tick={{ fill: "#2D5A27", fontSize: 11, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar
                    name="Initial"
                    dataKey="value"
                    stroke="#B87333"
                    fill="#B87333"
                    fillOpacity={0.4}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs mt-2">
              <span className="text-[#B87333]">V: {patient.initialPrakriti.vata}%</span>
              <span className="text-[#B87333]">P: {patient.initialPrakriti.pitta}%</span>
              <span className="text-[#B87333]">K: {patient.initialPrakriti.kapha}%</span>
            </div>
            <p className="text-center text-xs text-[#8B5E3C] mt-1">
              Dominant: {getDominantDosha(patient.initialPrakriti)}
            </p>
          </div>

          {/* Final Prakriti */}
          <div className="bg-[#F9FBF9] rounded-xl p-4 border border-[#2D5A27]/20">
            <p className="text-center font-semibold text-sm text-[#8B5E3C] mb-2">
              Post-Treatment Assessment
            </p>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={finalData}>
                  <PolarGrid stroke="#2D5A27" strokeOpacity={0.3} />
                  <PolarAngleAxis
                    dataKey="dosha"
                    tick={{ fill: "#2D5A27", fontSize: 11, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar
                    name="Final"
                    dataKey="value"
                    stroke="#2D5A27"
                    fill="#2D5A27"
                    fillOpacity={0.4}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs mt-2">
              <span className="text-[#2D5A27]">V: {patient.finalPrakriti.vata}%</span>
              <span className="text-[#2D5A27]">P: {patient.finalPrakriti.pitta}%</span>
              <span className="text-[#2D5A27]">K: {patient.finalPrakriti.kapha}%</span>
            </div>
            <p className="text-center text-xs text-[#8B5E3C] mt-1">
              Balanced: {getDominantDosha(patient.finalPrakriti)}
            </p>
          </div>
        </div>
      </div>

      {/* Treatment Timeline */}
      <div className="mb-6">
        <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg font-semibold text-[#2D5A27] mb-3 border-b border-[#2D5A27]/30 pb-1">
          Treatment Timeline
        </h3>
        <div className="bg-[#F9FBF9] rounded-xl border border-[#2D5A27]/20 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#2D5A27]/10">
                <th className="text-left py-2 px-4 font-semibold text-[#2D5A27]">Day</th>
                <th className="text-left py-2 px-4 font-semibold text-[#2D5A27]">Therapy</th>
                <th className="text-center py-2 px-4 font-semibold text-[#2D5A27]">Status</th>
              </tr>
            </thead>
            <tbody>
              {patient.treatmentPlan.map((day, index) => (
                <tr key={day.day} className={index % 2 === 0 ? "bg-white" : "bg-[#F9FBF9]"}>
                  <td className="py-2 px-4 font-medium">Day {day.day}</td>
                  <td className="py-2 px-4">{day.therapy}</td>
                  <td className="py-2 px-4 text-center">
                    {day.completed ? (
                      <span className="inline-flex items-center gap-1 text-[#2D5A27]">
                        <Check className="w-4 h-4" />
                        Completed
                      </span>
                    ) : (
                      <span className="text-[#8B5E3C]">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post-Treatment Diet Advice */}
      <div className="mb-6">
        <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg font-semibold text-[#2D5A27] mb-3 border-b border-[#2D5A27]/30 pb-1">
          Post-Treatment Diet Advice (Pathya)
        </h3>
        <div className="bg-[#F9FBF9] rounded-xl p-4 border border-[#2D5A27]/20">
          <ul className="space-y-2 text-sm">
            {patient.dietAdvice.map((advice, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#D4AF37] mt-0.5">●</span>
                <span>{advice}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Follow-up */}
      <div className="mb-6">
        <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg font-semibold text-[#2D5A27] mb-3 border-b border-[#2D5A27]/30 pb-1">
          Follow-up Instructions
        </h3>
        <p className="text-sm bg-[#D4AF37]/10 p-4 rounded-xl border border-[#D4AF37]/30">
          {patient.followUp}
        </p>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 mt-12 pt-6 border-t border-[#2D5A27]/30">
        <div className="text-center">
          <div className="h-16 border-b border-[#8B5E3C]/50 mb-2"></div>
          <p className="text-sm font-medium">{patient.treatingDoctor}</p>
          <p className="text-xs text-[#8B5E3C]">Treating Physician</p>
        </div>
        <div className="text-center">
          <div className="h-16 border-b border-[#8B5E3C]/50 mb-2"></div>
          <p className="text-sm font-medium">Medical Superintendent</p>
          <p className="text-xs text-[#8B5E3C]">AAMCHRC</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-[#2D5A27]/20 text-center text-xs text-[#8B5E3C]">
        <p>This is a computer-generated discharge summary from DhiGraph Clinical System.</p>
        <p className="mt-1">For any queries, please contact: info@aamchrc.org | +91 1234 567890</p>
      </div>
    </div>
  );
}
