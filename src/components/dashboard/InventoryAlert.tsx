import { motion } from "framer-motion";
import { AlertTriangle, Package, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function InventoryAlert() {
  const navigate = useNavigate();

  const { data: lowStockItems = [], isLoading } = useQuery({
    queryKey: ["low-stock-inventory"],
    queryFn: async () => {
      const res = await fetch(
        "http://localhost:5000/api/inventory?low_stock=true"
      );
      if (!res.ok) {
        throw new Error("Failed to load inventory");
      }
      const data = await res.json();
      return (data || []).slice(0, 5);
    },
  });

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-muted/10 rounded-2xl border border-border p-4 md:p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <Package className="w-4 h-4 text-muted-foreground" />
          </div>
          <h3 className="font-display text-base md:text-lg font-semibold text-foreground">
            Inventory Status
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-background/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </motion.div>
    );
  }

  const isWellStocked = lowStockItems.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      onClick={() => navigate("/inventory")}
      className={`rounded-2xl border p-4 md:p-6 cursor-pointer transition-colors ${isWellStocked
          ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
          : "bg-destructive/5 border-destructive/20 hover:bg-destructive/10"
        }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isWellStocked ? "bg-primary/20" : "bg-destructive/20"
          }`}>
          {isWellStocked ? (
            <CheckCircle2 className="w-4 h-4 text-primary" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-destructive" />
          )}
        </div>
        <h3 className={`font-display text-base md:text-lg font-semibold flex-1 ${isWellStocked ? "text-primary" : "text-destructive"
          }`}>
          {isWellStocked ? "Inventory Status" : "Low Stock Alert"}
        </h3>
        <span className={`text-xs hover:underline ${isWellStocked ? "text-primary" : "text-destructive"
          }`}>
          View Inventory
        </span>
      </div>

      {isWellStocked ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          All essential items are currently well stocked!
        </p>
      ) : (
        <div className="space-y-3">
          {lowStockItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center justify-between p-3 bg-background rounded-xl"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Package className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{item.item_name}</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <span className="text-sm font-semibold text-destructive">
                  {item.quantity} {item.unit}
                </span>
                <p className="text-xs text-muted-foreground">
                  Min: {item.min_stock_level}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
