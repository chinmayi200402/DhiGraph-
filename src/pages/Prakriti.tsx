import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Activity, Check, RotateCcw, User, Save } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PrakritiChart } from "@/components/prakriti/PrakritiChart";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Option {
  id: string;
  text: string;
  sanskrit: string;
  dosha: "Vata" | "Pitta" | "Kapha";
}

interface Category {
  id: number;
  name: string;
  englishName: string;
  options: Option[];
}

const categories: Category[] = [
  {
    id: 1,
    name: "Sharir",
    englishName: "Physique",
    options: [
      { id: "v1", text: "Lean, thin, or tall frame", sanskrit: "Alpa / Krusha dirgha aakriti", dosha: "Vata" },
      { id: "v2", text: "Underdeveloped body mass", sanskrit: "Apachita", dosha: "Vata" },
      { id: "k1", text: "Pleasant appearance", sanskrit: "Prasanna darshan", dosha: "Kapha" },
      { id: "k2", text: "Compact and firm body", sanskrit: "Samhata", dosha: "Kapha" },
    ],
  },
  {
    id: 2,
    name: "Avayav",
    englishName: "Body Parts",
    options: [
      { id: "v3", text: "Unsteady joints, eyes, jaws, lips, tongue, or shoulders", sanskrit: "Anavasthita", dosha: "Vata" },
      { id: "v4", text: "Prominent network of veins and tendons", sanskrit: "Bahu kandara sira pratan", dosha: "Vata" },
      { id: "p1", text: "Coppery/Reddish color of palate, tongue, lips, palms, soles", sanskrit: "Tamra varna", dosha: "Pitta" },
      { id: "p2", text: "Excessive sweating", sanskrit: "Prabhut sveda", dosha: "Pitta" },
      { id: "p3", text: "Hot face", sanskrit: "Ushna mukh", dosha: "Pitta" },
      { id: "k3", text: "Broad, muscular chest", sanskrit: "Prithu peen vaksha", dosha: "Kapha" },
      { id: "k4", text: "Large forehead", sanskrit: "Mahalalata", dosha: "Kapha" },
      { id: "k5", text: "Long arms", sanskrit: "Pralamba bahu", dosha: "Kapha" },
      { id: "k6", text: "Smooth body parts", sanskrit: "Shlakshnanga", dosha: "Kapha" },
    ],
  },
  {
    id: 3,
    name: "Akshi",
    englishName: "Eyes",
    options: [
      { id: "v5", text: "Eyes stay partially open while sleeping", sanskrit: "Supte unmilita iva", dosha: "Vata" },
      { id: "v6", text: "Greyish, dusty, or dull eyes", sanskrit: "Dhusar netra", dosha: "Vata" },
      { id: "p4", text: "Scanty or thin eyelashes", sanskrit: "Tanu alpa pakshma", dosha: "Pitta" },
      { id: "p5", text: "Coppery or reddish eyes", sanskrit: "Tamra nayan", dosha: "Pitta" },
      { id: "k7", text: "Clear, well-defined eyes", sanskrit: "Suvyaktaksha", dosha: "Kapha" },
      { id: "k8", text: "White sclera", sanskrit: "Shukla aksha", dosha: "Kapha" },
    ],
  },
  {
    id: 4,
    name: "Danta",
    englishName: "Teeth",
    options: [
      { id: "v7", text: "Rough teeth", sanskrit: "Parush danta", dosha: "Vata" },
      { id: "v8", text: "Grinds teeth or brittle teeth", sanskrit: "Danta khadi", dosha: "Vata" },
    ],
  },
  {
    id: 5,
    name: "Tvaka",
    englishName: "Skin",
    options: [
      { id: "v9", text: "Cracked or rough skin", sanskrit: "Sphutit gatra", dosha: "Vata" },
      { id: "p6", text: "Fair complexion", sanskrit: "Gaur ang", dosha: "Pitta" },
      { id: "p7", text: "Hot body temperature", sanskrit: "Ushna ang", dosha: "Pitta" },
      { id: "p8", text: "Prone to moles, freckles, dark spots", sanskrit: "Piplu, vyanga, tila", dosha: "Pitta" },
      { id: "p9", text: "Early wrinkles", sanskrit: "Kshipra vali", dosha: "Pitta" },
      { id: "k9", text: "Little sweat", sanskrit: "Alpa sveda", dosha: "Kapha" },
    ],
  },
  {
    id: 6,
    name: "Kesha",
    englishName: "Hair",
    options: [
      { id: "v10", text: "Rough hair, beard, or body hair", sanskrit: "Parush kesha lom smashru", dosha: "Vata" },
      { id: "v11", text: "Scanty or thin hair", sanskrit: "Alpa kesha", dosha: "Vata" },
      { id: "v12", text: "Dry hair", sanskrit: "Ruksha kesha", dosha: "Vata" },
      { id: "p10", text: "Scanty hair", sanskrit: "Alpa kesha", dosha: "Pitta" },
      { id: "p11", text: "Soft hair", sanskrit: "Mridu kesha", dosha: "Pitta" },
      { id: "p12", text: "Early greying", sanskrit: "Kshipra palitya", dosha: "Pitta" },
      { id: "p13", text: "Early balding", sanskrit: "Kshipra khalitya", dosha: "Pitta" },
      { id: "p14", text: "Brown or reddish hair", sanskrit: "Kapila kesha", dosha: "Pitta" },
      { id: "k10", text: "Thick, dense hair", sanskrit: "Ghan kesha", dosha: "Kapha" },
      { id: "k11", text: "Curly hair", sanskrit: "Kutila kesha", dosha: "Kapha" },
      { id: "k12", text: "Firmly rooted, strong hair", sanskrit: "Sthira kesha", dosha: "Kapha" },
    ],
  },
  {
    id: 7,
    name: "Nakha",
    englishName: "Nails",
    options: [
      { id: "v13", text: "Rough nails", sanskrit: "Parush nakha", dosha: "Vata" },
      { id: "v14", text: "Small or scanty nails", sanskrit: "Alpa nakha", dosha: "Vata" },
      { id: "p15", text: "Coppery or reddish nails", sanskrit: "Tamra nakha", dosha: "Pitta" },
    ],
  },
  {
    id: 8,
    name: "Sandhi",
    englishName: "Joints",
    options: [
      { id: "v15", text: "Joints make noise constantly on movement", sanskrit: "Satat sandhi shabda gamin", dosha: "Vata" },
      { id: "p16", text: "Loose or soft joints", sanskrit: "Shithila mridu sandhi", dosha: "Pitta" },
      { id: "k13", text: "Unctuous, well-knit, hidden joints", sanskrit: "Snigdha shlishta gudha sandhi", dosha: "Kapha" },
    ],
  },
  {
    id: 9,
    name: "Kshudha/Agni",
    englishName: "Appetite & Digestion",
    options: [
      { id: "v16", text: "Irregular digestion", sanskrit: "Vishamagni", dosha: "Vata" },
      { id: "v17", text: "Gluttonous / Eats often", sanskrit: "Bahu bhuk", dosha: "Vata" },
      { id: "p17", text: "Abundant food intake", sanskrit: "Prabhut ashan", dosha: "Pitta" },
      { id: "p18", text: "Sharp / Intense digestion", sanskrit: "Tikshnagni", dosha: "Pitta" },
      { id: "k14", text: "Eats little", sanskrit: "Alpa ashan", dosha: "Kapha" },
      { id: "k15", text: "Slow digestion", sanskrit: "Mandagni", dosha: "Kapha" },
    ],
  },
  {
    id: 10,
    name: "Trishna",
    englishName: "Thirst",
    options: [
      { id: "p19", text: "Intense thirst", sanskrit: "Tikshna trishna", dosha: "Pitta" },
      { id: "k16", text: "Little thirst", sanskrit: "Alpa trishna", dosha: "Kapha" },
    ],
  },
  {
    id: 11,
    name: "Gati",
    englishName: "Gait/Movement",
    options: [
      { id: "v18", text: "Light, swift, unsteady gait/movement", sanskrit: "Laghu chapal gati cheshta", dosha: "Vata" },
      { id: "p20", text: "Excessive excretion/stool", sanskrit: "Bhuri uchchar", dosha: "Pitta" },
      { id: "k17", text: "Slow movement, actions, speech", sanskrit: "Manda gati cheshta", dosha: "Kapha" },
      { id: "k18", text: "Stable gait and actions", sanskrit: "Avasthita gati", dosha: "Kapha" },
    ],
  },
  {
    id: 12,
    name: "Svara",
    englishName: "Voice",
    options: [
      { id: "v19", text: "Rough, weak, broken, or hoarse voice", sanskrit: "Jarjara svara", dosha: "Vata" },
      { id: "k19", text: "Pleasant voice", sanskrit: "Prasanna svara", dosha: "Kapha" },
    ],
  },
  {
    id: 13,
    name: "Nidra",
    englishName: "Sleep",
    options: [
      { id: "v20", text: "Awake / Alert / Sleepless", sanskrit: "Jagarook", dosha: "Vata" },
      { id: "k20", text: "Sleepy / Heavy sleep", sanskrit: "Nidralu", dosha: "Kapha" },
    ],
  },
  {
    id: 14,
    name: "Svapna",
    englishName: "Dreams",
    options: [
      { id: "v21", text: "Walking in sky, mountains, trees", sanskrit: "Akash chari", dosha: "Vata" },
      { id: "p21", text: "Seeing lights, sun, fire, gold", sanskrit: "Jyotisham drishtva", dosha: "Pitta" },
      { id: "k21", text: "Seeing water bodies, clouds", sanskrit: "Jalashaya loki", dosha: "Kapha" },
    ],
  },
  {
    id: 15,
    name: "Bala",
    englishName: "Strength",
    options: [
      { id: "v22", text: "Low strength", sanskrit: "Alpa bal", dosha: "Vata" },
      { id: "p22", text: "Medium strength", sanskrit: "Madhyama bal", dosha: "Pitta" },
      { id: "k22", text: "Strong", sanskrit: "Balavan", dosha: "Kapha" },
    ],
  },
  {
    id: 16,
    name: "Rasa Aahar",
    englishName: "Taste & Preference",
    options: [
      { id: "v23", text: "Desires Sweet, Sour, Salty", sanskrit: "Madhura amla lavana", dosha: "Vata" },
      { id: "v24", text: "Desires Hot/Warm", sanskrit: "Ushna akanksha", dosha: "Vata" },
      { id: "p23", text: "Desires Sweet, Bitter, Astringent", sanskrit: "Madhura tikta kashaya", dosha: "Pitta" },
      { id: "p24", text: "Desires Cold", sanskrit: "Sheet akanksha", dosha: "Pitta" },
      { id: "k23", text: "Desires Pungent, Bitter, Astringent", sanskrit: "Katu tikta kashaya", dosha: "Kapha" },
      { id: "k24", text: "Desires Warm/Hot", sanskrit: "Ushna akanksha", dosha: "Kapha" },
    ],
  },
  {
    id: 17,
    name: "Manasa Bhava",
    englishName: "Mental State",
    options: [
      { id: "v25", text: "Atheist / Non-believer", sanskrit: "Nastik", dosha: "Vata" },
      { id: "v26", text: "Uncontrolled senses", sanskrit: "Najitendriya", dosha: "Vata" },
      { id: "v27", text: "Grasps by hearing but low memory", sanskrit: "Alpa smrutaya", dosha: "Vata" },
      { id: "v28", text: "Quickly agitated", sanskrit: "Sheeghra samaram kshobha", dosha: "Vata" },
      { id: "v29", text: "Jealous nature", sanskrit: "Matsara dhata", dosha: "Vata" },
      { id: "v30", text: "Ungrateful", sanskrit: "Krutaghna", dosha: "Vata" },
      { id: "v31", text: "Unstable friends & wealth", sanskrit: "Adhruva mitra dhan", dosha: "Vata" },
      { id: "v32", text: "Talkative", sanskrit: "Pralapi", dosha: "Vata" },
      { id: "p25", text: "Intelligent", sanskrit: "Medhavi", dosha: "Pitta" },
      { id: "p26", text: "Kind to dependents", sanskrit: "Aashrit vatsal", dosha: "Pitta" },
      { id: "p27", text: "Brave", sanskrit: "Shura", dosha: "Pitta" },
      { id: "p28", text: "Argumentative speaker", sanskrit: "Vigruha vakta", dosha: "Pitta" },
      { id: "p29", text: "Intolerant to hardship", sanskrit: "Klesh asishnu", dosha: "Pitta" },
      { id: "p30", text: "Quick to anger", sanskrit: "Kshipra kopi", dosha: "Pitta" },
      { id: "p31", text: "Unconquerable in debate", sanskrit: "Samitishu durnivarya", dosha: "Pitta" },
      { id: "p32", text: "Generous", sanskrit: "Dani", dosha: "Pitta" },
      { id: "k25", text: "Retains for long / Slow to grasp", sanskrit: "Chir grahi", dosha: "Kapha" },
      { id: "k26", text: "Patient / Determined", sanskrit: "Dhrutiman", dosha: "Kapha" },
      { id: "k27", text: "Forgiving", sanskrit: "Kshamavan", dosha: "Kapha" },
      { id: "k28", text: "Slow to start / Not easily agitated", sanskrit: "Ashighra samaram", dosha: "Kapha" },
      { id: "k29", text: "Tolerant to hardship", sanskrit: "Klesh ksham", dosha: "Kapha" },
      { id: "k30", text: "Grateful", sanskrit: "Krutagya", dosha: "Kapha" },
      { id: "k31", text: "Stable friends", sanskrit: "Sthira mitra", dosha: "Kapha" },
      { id: "k32", text: "Long-standing enmity", sanskrit: "Chir vair", dosha: "Kapha" },
    ],
  },
];

const VATA_TOTAL = 32;
const PITTA_TOTAL = 32;
const KAPHA_TOTAL = 32;

export default function Prakriti() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const patientId = searchParams.get("patientId");
  const patientName = searchParams.get("patientName");

  const [currentCategory, setCurrentCategory] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const progress = ((currentCategory + 1) / categories.length) * 100;

  const handleOptionToggle = (optionId: string) => {
    const newSelected = new Set(selectedOptions);
    if (newSelected.has(optionId)) {
      newSelected.delete(optionId);
    } else {
      newSelected.add(optionId);
    }
    setSelectedOptions(newSelected);
  };

  const handleNext = () => {
    if (currentCategory < categories.length - 1) {
      setCurrentCategory(currentCategory + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCategory > 0) {
      setCurrentCategory(currentCategory - 1);
    }
  };

  const scores = useMemo(() => {
    let vataCount = 0;
    let pittaCount = 0;
    let kaphaCount = 0;

    categories.forEach(category => {
      category.options.forEach(option => {
        if (selectedOptions.has(option.id)) {
          if (option.dosha === "Vata") vataCount++;
          else if (option.dosha === "Pitta") pittaCount++;
          else if (option.dosha === "Kapha") kaphaCount++;
        }
      });
    });

    const vataPercent = Math.round((vataCount / VATA_TOTAL) * 100);
    const pittaPercent = Math.round((pittaCount / PITTA_TOTAL) * 100);
    const kaphaPercent = Math.round((kaphaCount / KAPHA_TOTAL) * 100);

    return {
      vata: vataPercent,
      pitta: pittaPercent,
      kapha: kaphaPercent,
      vataCount,
      pittaCount,
      kaphaCount,
    };
  }, [selectedOptions]);

  const handleSubmit = () => {
    setShowResults(true);
  };

  const resetAssessment = () => {
    setCurrentCategory(0);
    setSelectedOptions(new Set());
    setShowResults(false);
    setIsSaved(false);
  };

  const getPrakritiResult = () => {
    const sortedScores = [
      { name: "Vata", percent: scores.vata },
      { name: "Pitta", percent: scores.pitta },
      { name: "Kapha", percent: scores.kapha },
    ].sort((a, b) => b.percent - a.percent);

    const primary = sortedScores[0];
    const secondary = sortedScores[1];
    const threshold = 10;

    if (primary.percent - secondary.percent < threshold) {
      return {
        type: `${primary.name}-${secondary.name} Prakriti`,
        description: `Your constitution shows a dual dominance of ${primary.name} and ${secondary.name} doshas.`,
      };
    }

    return {
      type: `Pure ${primary.name} Prakriti`,
      description: `Your constitution is predominantly governed by ${primary.name} dosha.`,
    };
  };

  const handleSaveToPatient = async () => {
    if (!patientId) {
      toast.error("No patient selected. Please select a patient first.");
      return;
    }

    setIsSaving(true);
    try {
      // Create responses object for storage
      const responses: Record<string, string[]> = {};
      categories.forEach(cat => {
        const selected = cat.options.filter(opt => selectedOptions.has(opt.id)).map(opt => opt.id);
        if (selected.length > 0) {
          responses[cat.name] = selected;
        }
      });

      const { error } = await supabase
        .from("prakriti_assessments")
        .insert({
          patient_id: patientId,
          vata_score: scores.vataCount,
          pitta_score: scores.pittaCount,
          kapha_score: scores.kaphaCount,
          responses: responses,
        });

      if (error) throw error;

      setIsSaved(true);
      toast.success("Prakriti assessment saved to patient profile!");
    } catch (error) {
      console.error("Error saving assessment:", error);
      toast.error("Failed to save assessment");
    } finally {
      setIsSaving(false);
    }
  };

  const currentCategoryData = categories[currentCategory];
  const categorySelections = currentCategoryData.options.filter(opt => 
    selectedOptions.has(opt.id)
  ).length;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
            Prakriti Assessment
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Clinical Constitution Analysis based on Vimana Sthana
          </p>
          
          {/* Patient Info Banner */}
          {patientName && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-xl"
            >
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Patient: <span className="text-primary">{decodeURIComponent(patientName)}</span>
              </span>
            </motion.div>
          )}
        </motion.div>

        {!showResults ? (
          <>
            {/* Progress */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Category {currentCategory + 1} of {categories.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </motion.div>

            {/* Category Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCategory}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {currentCategoryData.name}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {categorySelections} selected
                  </span>
                </div>

                <h2 className="font-display text-xl md:text-2xl font-semibold mb-2">
                  {currentCategoryData.englishName}
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Select all traits that apply to the patient
                </p>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {currentCategoryData.options.map((option) => {
                    const isSelected = selectedOptions.has(option.id);
                    const doshaColor = 
                      option.dosha === "Vata" ? "bg-accent" :
                      option.dosha === "Pitta" ? "bg-destructive" : "bg-primary";
                    
                    return (
                      <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleOptionToggle(option.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isSelected}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`w-2 h-2 rounded-full ${doshaColor}`} />
                              <span className="text-xs font-medium text-muted-foreground">
                                {option.dosha}
                              </span>
                            </div>
                            <p className="font-medium text-foreground">
                              {option.text}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 italic">
                              ({option.sanskrit})
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentCategory === 0}
                className="rounded-xl"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentCategory === categories.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  className="rounded-xl bg-primary text-primary-foreground"
                >
                  Complete Assessment
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="rounded-xl bg-primary text-primary-foreground"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </>
        ) : (
          /* Results */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Activity className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="font-display text-xl md:text-2xl font-semibold mb-2">
                Assessment Complete
              </h2>
              {patientName && (
                <p className="text-muted-foreground mb-2">
                  for <span className="font-medium text-foreground">{decodeURIComponent(patientName)}</span>
                </p>
              )}
              <p className="text-lg font-semibold text-primary mb-1">
                {getPrakritiResult().type}
              </p>
              <p className="text-sm text-muted-foreground">
                {getPrakritiResult().description}
              </p>
            </div>

            <PrakritiChart scores={scores} />

            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {[
                { name: "Vata", score: scores.vata, count: scores.vataCount, total: VATA_TOTAL, color: "bg-accent" },
                { name: "Pitta", score: scores.pitta, count: scores.pittaCount, total: PITTA_TOTAL, color: "bg-destructive" },
                { name: "Kapha", score: scores.kapha, count: scores.kaphaCount, total: KAPHA_TOTAL, color: "bg-primary" },
              ].map((dosha) => (
                <motion.div
                  key={dosha.name}
                  whileHover={{ y: -4 }}
                  className="bg-card rounded-2xl border border-border p-4 md:p-6 text-center"
                >
                  <div className={`w-4 h-4 rounded-full ${dosha.color} mx-auto mb-3`} />
                  <h3 className="font-display text-base md:text-lg font-semibold">{dosha.name}</h3>
                  <p className="text-2xl md:text-3xl font-bold text-foreground mt-2">{dosha.score}%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {dosha.count}/{dosha.total} traits
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="bg-muted/50 rounded-2xl p-4 md:p-6 border border-border">
              <h3 className="font-display font-semibold mb-3">Breakdown Summary</h3>
              <p className="text-sm text-muted-foreground">
                Vata: {scores.vata.toFixed(2)}% | Pitta: {scores.pitta.toFixed(2)}% | Kapha: {scores.kapha.toFixed(2)}%
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                variant="outline"
                onClick={resetAssessment}
                className="rounded-xl"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Assessment
              </Button>
              
              {patientId ? (
                <Button
                  onClick={handleSaveToPatient}
                  disabled={isSaving || isSaved}
                  className="rounded-xl bg-primary text-primary-foreground"
                >
                  {isSaved ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Saved to Profile
                    </>
                  ) : isSaving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save to Patient Profile
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/patients")}
                  className="rounded-xl bg-primary text-primary-foreground"
                >
                  <User className="w-4 h-4 mr-2" />
                  Go to Patients
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}
