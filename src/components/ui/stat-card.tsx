import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: "default" | "primary" | "accent" | "highlight";
  delay?: number;
  onClick?: () => void;
}

const variants = {
  default: "bg-card border-border",
  primary: "bg-primary/10 border-primary/20",
  accent: "bg-accent/10 border-accent/20",
  highlight: "bg-highlight/10 border-highlight/20",
};

const iconVariants = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/20 text-primary",
  accent: "bg-accent/20 text-accent",
  highlight: "bg-highlight/20 text-highlight",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  delay = 0,
  onClick,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={cn(
        "relative p-4 md:p-6 rounded-2xl border backdrop-blur-sm shadow-sm hover:shadow-lg transition-shadow",
        onClick && "cursor-pointer",
        variants[variant]
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 md:space-y-2 min-w-0 flex-1">
          <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">{title}</p>
          <p className="text-2xl md:text-3xl font-display font-semibold text-foreground">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs md:text-sm text-muted-foreground truncate">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 flex-wrap">
              <span
                className={cn(
                  "text-xs md:text-sm font-medium",
                  trend.positive ? "text-primary" : "text-destructive"
                )}
              >
                {trend.positive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">vs last week</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0",
            iconVariants[variant]
          )}
        >
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </div>
    </motion.div>
  );
}
