import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Brain } from "lucide-react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Prakriti from "./pages/Prakriti";
import Scheduler from "./pages/Scheduler";
import DailySchedule from "./pages/DailySchedule";
import TreatmentJourney from "./pages/TreatmentJourney";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import DischargeSummary from "./pages/DischargeSummary";
import PatientDetails from "./pages/PatientDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/prakriti" element={<Prakriti />} />
          <Route path="/scheduler" element={<Scheduler />} />
          <Route path="/daily-schedule" element={<DailySchedule />} />
          <Route path="/treatment-journey" element={<TreatmentJourney />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/discharge-summary" element={<DischargeSummary />} />
          <Route path="/patient-details" element={<PatientDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
