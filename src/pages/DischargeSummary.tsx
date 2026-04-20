import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Printer, User, Calendar, Activity, Utensils, ArrowRight } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DischargePrintView } from "@/components/discharge/DischargePrintView";

interface PatientData {
  id: string | number;
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

export default function DischargeSummary() {
  const [patientsData, setPatientsData] = useState<PatientData[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:5000/api/patients");
        if (!res.ok) throw new Error("Failed to fetch patients");
        const data = await res.json();
        
        const transformed: PatientData[] = data.map((p: any) => ({
          id: p._id,
          name: p.name || 'Unknown Patient',
          age: p.age || 0,
          gender: p.gender || 'Not specified',
          contact: p.contact || 'Not specified',
          bloodGroup: p.blood_group || 'Unknown',
          admissionDate: p.createdAt || new Date().toISOString(),
          dischargeDate: new Date().toISOString(),
          diagnosis: p.chief_complaint || p.diagnosis || 'General Assessment',
          treatingDoctor: 'Dr. Principal Doctor',
          initialPrakriti: { vata: 33, pitta: 33, kapha: 34 },
          finalPrakriti: { vata: 34, pitta: 33, kapha: 33 },
          treatmentPlan: [
            { day: 1, therapy: "General Assessment", completed: true }
          ],
          dietAdvice: [
            "Follow prescribed balanced diet",
            "Drink plenty of warm water"
          ],
          followUp: "Follow-up consultation after 1 week."
        }));
        
        setPatientsData(transformed);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatients();
  }, []);

  const selectedPatient = patientsData.find(p => p.id.toString() === selectedPatientId);

  const generatePDF = async () => {
    if (!printRef.current || !selectedPatient) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;

      // Calculate how many pages we need
      const pageHeight = pdfHeight * (imgWidth / pdfWidth);
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", imgX, position * ratio, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", imgX, position * ratio, imgWidth * ratio, imgHeight * ratio);
        heightLeft -= pageHeight;
      }

      pdf.save(`Discharge_Summary_${selectedPatient.name.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Discharge Summary - ${selectedPatient?.name}</title>
            <style>
              body { font-family: 'Inter', sans-serif; padding: 20px; }
              .print-container { max-width: 800px; margin: 0 auto; }
            </style>
          </head>
          <body>
            <div class="print-container">${printContent}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
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
              Discharge Summary
            </h1>
            <p className="text-muted-foreground mt-1">
              Generate comprehensive discharge reports for patients
            </p>
          </div>
          <div className="w-full md:w-72">
            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {patientsData.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.name} ({p.treatmentPlan.length} days)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {!selectedPatient ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-2xl border border-border p-12 text-center"
          >
            <FileText className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-display text-xl font-semibold mb-2">Select a Patient</h3>
            <p className="text-muted-foreground">
              Choose a patient to generate their discharge summary
            </p>
          </motion.div>
        ) : (
          <>
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex gap-4"
            >
              <Button
                onClick={generatePDF}
                disabled={isGenerating}
                className="rounded-xl bg-primary text-primary-foreground"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Download PDF"}
              </Button>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="rounded-xl"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </motion.div>

            {/* Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Preview</span>
                <span className="text-xs text-muted-foreground">A4 Format</span>
              </div>
              <div className="p-6 bg-muted/10 overflow-auto max-h-[800px]">
                <div ref={printRef}>
                  <DischargePrintView patient={selectedPatient} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
