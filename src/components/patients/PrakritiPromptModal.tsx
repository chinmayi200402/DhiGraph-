import { motion } from "framer-motion";
import { Stethoscope, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrakritiPromptModalProps {
  patientName: string;
  onStartAssessment: () => void;
  onSkip: () => void;
}

export function PrakritiPromptModal({
  patientName,
  onStartAssessment,
  onSkip,
}: PrakritiPromptModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onSkip}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-2xl border border-border p-8 w-full max-w-md shadow-2xl text-center"
      >
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
          <Stethoscope className="w-10 h-10 text-primary-foreground" />
        </div>

        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
          Patient Registered Successfully!
        </h2>

        <p className="text-muted-foreground mb-6">
          <span className="font-medium text-foreground">{patientName}</span> has been
          added to your records. Would you like to conduct their Prakriti Assessment now?
        </p>

        <div className="space-y-3">
          <Button
            onClick={onStartAssessment}
            className="w-full rounded-xl h-12 bg-primary text-primary-foreground hover:bg-primary/90 group"
          >
            <span>Start Prakriti Assessment</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            variant="ghost"
            onClick={onSkip}
            className="w-full rounded-xl text-muted-foreground hover:text-foreground"
          >
            Skip for now
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          You can always conduct the assessment later from the patient's profile.
        </p>
      </motion.div>
    </motion.div>
  );
}
