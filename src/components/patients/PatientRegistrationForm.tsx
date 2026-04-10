import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CalendarIcon, AlertTriangle, IdCard, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export interface PatientFormData {
  registration_date: Date;
  serial_no: string;
  abha_id: string;
  name: string;
  contact: string;
  blood_group: string;
  age: string;
  gender: string;
  address: string;
  resident_status: string;
  socio_economic_status: string;
  education: string;
  occupation: string;
  opd_no: string;
  ipd_no: string;
  chief_complaint: string;
}

interface PatientRegistrationFormProps {
  onSubmit: (data: PatientFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const RARE_BLOOD_GROUPS = ["O-", "A-", "B-", "AB-"];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const EDUCATION_OPTIONS = [
  "Illiterate",
  "Primary",
  "Secondary",
  "High School",
  "Graduate",
  "Post-Graduate",
];

const SOCIO_ECONOMIC_OPTIONS = ["Lower", "Middle", "Upper"];

export function PatientRegistrationForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: PatientRegistrationFormProps) {
  const [formData, setFormData] = useState<PatientFormData>({
    registration_date: new Date(),
    serial_no: "",
    abha_id: "",
    name: "",
    contact: "",
    blood_group: "",
    age: "",
    gender: "",
    address: "",
    resident_status: "",
    socio_economic_status: "",
    education: "",
    occupation: "",
    opd_no: "",
    ipd_no: "",
    chief_complaint: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PatientFormData, string>>>({});

  const isRareBloodGroup = RARE_BLOOD_GROUPS.includes(formData.blood_group);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PatientFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Patient name is required";
    }

    if (!formData.age || parseInt(formData.age) < 0 || parseInt(formData.age) > 150) {
      newErrors.age = "Valid age is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.contact || !/^\d{10}$/.test(formData.contact.replace(/\s/g, ""))) {
      newErrors.contact = "Valid 10-digit mobile number required";
    }

    if (formData.abha_id && !/^\d{14}$/.test(formData.abha_id.replace(/\s/g, ""))) {
      newErrors.abha_id = "ABHA ID must be 14 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updateField = (field: keyof PatientFormData, value: string | Date) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-2xl border border-border w-full max-w-4xl shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Patient Registration & Intake Form
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Complete all required fields marked with *
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Section 1: Patient Identification */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              1. Patient Identification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Date */}
              <div className="space-y-2">
                <Label>Registration Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-xl",
                        !formData.registration_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.registration_date
                        ? format(formData.registration_date, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.registration_date}
                      onSelect={(date) => date && updateField("registration_date", date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Serial No */}
              <div className="space-y-2">
                <Label htmlFor="serial_no">Serial No.</Label>
                <Input
                  id="serial_no"
                  value={formData.serial_no}
                  onChange={(e) => updateField("serial_no", e.target.value)}
                  className="rounded-xl"
                  placeholder="Enter serial number"
                />
              </div>

              {/* ABHA ID - Highlighted */}
              <div className="space-y-2">
                <Label htmlFor="abha_id" className="flex items-center gap-2">
                  <IdCard className="w-4 h-4 text-primary" />
                  ABHA ID
                </Label>
                <div className="relative">
                  <Input
                    id="abha_id"
                    value={formData.abha_id}
                    onChange={(e) => updateField("abha_id", e.target.value.replace(/\D/g, "").slice(0, 14))}
                    className={cn(
                      "rounded-xl border-2 border-primary/50 bg-primary/5 focus:border-primary",
                      errors.abha_id && "border-destructive"
                    )}
                    placeholder="14-digit ABHA ID"
                    maxLength={14}
                  />
                </div>
                {errors.abha_id && (
                  <p className="text-sm text-destructive">{errors.abha_id}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Ayushman Bharat Health Account ID (14 digits)
                </p>
              </div>

              {/* Patient Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Patient Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={cn("rounded-xl", errors.name && "border-destructive")}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Mobile No */}
              <div className="space-y-2">
                <Label htmlFor="contact">Mobile No. *</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => updateField("contact", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className={cn("rounded-xl", errors.contact && "border-destructive")}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                />
                {errors.contact && (
                  <p className="text-sm text-destructive">{errors.contact}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Critical Medical Alerts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              2. Critical Medical Alerts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Blood Group */}
              <div className="space-y-2">
                <Label htmlFor="blood_group">Blood Group</Label>
                <div className="relative">
                  <Select
                    value={formData.blood_group}
                    onValueChange={(value) => updateField("blood_group", value)}
                  >
                    <SelectTrigger
                      className={cn(
                        "rounded-xl",
                        isRareBloodGroup && "border-2 border-orange-500 bg-orange-50 dark:bg-orange-950/30"
                      )}
                    >
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg} {RARE_BLOOD_GROUPS.includes(bg) && "⚠️"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isRareBloodGroup && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-2 right-2"
                    >
                      <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full animate-pulse">
                        RARE
                      </span>
                    </motion.div>
                  )}
                </div>
                {isRareBloodGroup && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-start gap-2 p-3 bg-orange-100 dark:bg-orange-950/50 border border-orange-300 dark:border-orange-800 rounded-xl"
                  >
                    <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">
                        RARE BLOOD GROUP ALERT
                      </p>
                      <p className="text-xs text-orange-700 dark:text-orange-400">
                        Ensure prior arrangement for blood availability before any procedure.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Demographics & Social History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              3. Demographics & Social History
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateField("age", e.target.value)}
                  className={cn("rounded-xl", errors.age && "border-destructive")}
                  placeholder="Enter age"
                  min={0}
                  max={150}
                />
                {errors.age && (
                  <p className="text-sm text-destructive">{errors.age}</p>
                )}
              </div>

              {/* Sex */}
              <div className="space-y-2">
                <Label>Sex *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => updateField("gender", value)}
                >
                  <SelectTrigger className={cn("rounded-xl", errors.gender && "border-destructive")}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-destructive">{errors.gender}</p>
                )}
              </div>

              {/* Resident Status */}
              <div className="space-y-2">
                <Label>Resident Status</Label>
                <RadioGroup
                  value={formData.resident_status}
                  onValueChange={(value) => updateField("resident_status", value)}
                  className="flex gap-4 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Rural" id="rural" />
                    <Label htmlFor="rural" className="font-normal cursor-pointer">
                      Rural
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Urban" id="urban" />
                    <Label htmlFor="urban" className="font-normal cursor-pointer">
                      Urban
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Socio-Economic Status */}
              <div className="space-y-2">
                <Label>Socio-Economic Status</Label>
                <Select
                  value={formData.socio_economic_status}
                  onValueChange={(value) => updateField("socio_economic_status", value)}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIO_ECONOMIC_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Education */}
              <div className="space-y-2">
                <Label>Education</Label>
                <Select
                  value={formData.education}
                  onValueChange={(value) => updateField("education", value)}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Occupation */}
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => updateField("occupation", e.target.value)}
                  className="rounded-xl"
                  placeholder="Enter occupation"
                />
              </div>

              {/* Address - Full Width */}
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="rounded-xl min-h-[80px]"
                  placeholder="Enter full address"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Clinical Record Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
              4. Clinical Record Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* OPD No */}
              <div className="space-y-2">
                <Label htmlFor="opd_no">OPD No.</Label>
                <Input
                  id="opd_no"
                  value={formData.opd_no}
                  onChange={(e) => updateField("opd_no", e.target.value)}
                  className="rounded-xl"
                  placeholder="Outpatient Department Number"
                />
              </div>

              {/* IPD No */}
              <div className="space-y-2">
                <Label htmlFor="ipd_no">IPD No.</Label>
                <Input
                  id="ipd_no"
                  value={formData.ipd_no}
                  onChange={(e) => updateField("ipd_no", e.target.value)}
                  className="rounded-xl"
                  placeholder="Inpatient Department Number"
                />
              </div>

              {/* Chief Complaint - Full Width */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="chief_complaint">K/C/O (Known Case Of / Chief Complaint)</Label>
                <Textarea
                  id="chief_complaint"
                  value={formData.chief_complaint}
                  onChange={(e) => updateField("chief_complaint", e.target.value)}
                  className="rounded-xl min-h-[120px]"
                  placeholder="Enter medical notes, diagnosis, or chief complaint..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-6 rounded-b-2xl">
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="rounded-xl"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Patient Details"}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
