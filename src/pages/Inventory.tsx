import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Search, AlertTriangle, TrendingDown, Filter } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Minus, Plus, RefreshCw } from "lucide-react";

interface InventoryItem {
  _id: string;
  item_name: string;
  category: "Tailam" | "Churna" | "Kashayam" | "Gulika" | "Arishtam" | string;
  quantity: number;
  min_stock_level: number;
  unit: string;
  last_restocked_at: string;
  createdAt: string;
}

// Replaced with dynamic fetch using useQuery

const categoryColors = {
  Tailam: "bg-accent/20 text-accent border-accent/30",
  Churna: "bg-primary/20 text-primary border-primary/30",
  Kashayam: "bg-highlight/20 text-highlight border-highlight/30",
  Gulika: "bg-earth/20 text-earth border-earth/30",
  Arishtam: "bg-muted text-muted-foreground border-border",
};

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const queryClient = useQueryClient();

  const { data: inventoryItems = [], isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/inventory");
      if (!res.ok) throw new Error("Failed to load inventory");
      return res.json() as Promise<InventoryItem[]>;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string, quantity: number }) => {
      const res = await fetch(`http://localhost:5000/api/inventory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity })
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    }
  });

  const seedMutation = useMutation({
    mutationFn: async () => {
      // Seed some dynamic data for the DB if completely empty
      const items = [
        { item_name: "Dhanwantaram Tailam", category: "Tailam", quantity: 8, min_stock_level: 15, unit: "liters" },
        { item_name: "Ksheerabala Tailam", category: "Tailam", quantity: 45, min_stock_level: 15, unit: "liters" },
        { item_name: "Ashwagandha Churna", category: "Churna", quantity: 72, min_stock_level: 30, unit: "kg" }
      ];
      for (const item of items) {
        await fetch("http://localhost:5000/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item)
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] })
  });

  const categories = ["All", ...new Set(inventoryItems.map((item: any) => item.category))];

  const filteredItems = inventoryItems.filter((item: any) => {
    const itemName = item.item_name || item.name || '';
    const matchesSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventoryItems.filter((item: any) => item.quantity < item.min_stock_level);
  const totalItems = inventoryItems.length;
  // A healthy stock is double the min_stock_level for now
  const healthyStock = inventoryItems.filter((item: any) => item.quantity >= (item.min_stock_level * 2)).length;

  const getStockColor = (quantity: number, minStock: number) => {
    if (quantity <= minStock) return "bg-destructive";
    if (quantity <= minStock * 1.5) return "bg-highlight";
    if (quantity <= minStock * 2) return "bg-accent";
    return "bg-primary";
  };

  const getStockLabel = (quantity: number, minStock: number) => {
    if (quantity <= minStock) return "Critical";
    if (quantity <= minStock * 1.5) return "Low";
    if (quantity <= minStock * 2) return "Moderate";
    return "Good";
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">
              Inventory Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage Ayurvedic medicines and supplies
            </p>
          </div>
          {inventoryItems.length === 0 && !isLoading && (
            <Button onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending}>
              <RefreshCw className={`w-4 h-4 mr-2 ${seedMutation.isPending ? 'animate-spin' : ''}`} />
              Seed Database Data
            </Button>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{totalItems}</p>
                <p className="text-xs text-muted-foreground">Total Items</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{healthyStock}</p>
                <p className="text-xs text-muted-foreground">Healthy Stock</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-highlight/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-highlight" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{lowStockItems.length}</p>
                <p className="text-xs text-muted-foreground">Low Stock</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{lowStockItems.length}</p>
                <p className="text-xs text-muted-foreground">Critical</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-destructive/5 rounded-2xl border border-destructive/20 p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h3 className="font-semibold text-destructive">Low Stock Alert</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {lowStockItems.map((item: any) => (
                <div
                  key={item._id}
                  className="bg-background rounded-xl p-3 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.item_name || item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-destructive">{item.quantity}</span>
                    <p className="text-xs text-muted-foreground">min: {item.min_stock_level}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-11 rounded-xl"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {String(cat)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Inventory Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left p-4 font-semibold text-sm">Item Name</th>
                  <th className="text-left p-4 font-semibold text-sm">Category</th>
                  <th className="text-left p-4 font-semibold text-sm">Stock Level</th>
                  <th className="text-left p-4 font-semibold text-sm">Status</th>
                  <th className="text-left p-4 font-semibold text-sm">Last Restocked</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                      Loading inventory...
                    </td>
                  </tr>
                )}
                {!isLoading && filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                      No inventory items found
                    </td>
                  </tr>
                )}
                {filteredItems.map((item: any, index: number) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.03 }}
                    className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium">{item.item_name || item.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                          categoryColors[item.category as keyof typeof categoryColors] || "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 w-48">
                      <div className="space-y-1">
                        <Progress
                          value={Math.min(100, (item.quantity / (item.min_stock_level * 3)) * 100)}
                          className={`h-2 [&>div]:${getStockColor(item.quantity, item.min_stock_level)}`}
                        />
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex-1 text-center ${
                            item.quantity <= item.min_stock_level
                              ? "bg-destructive/20 text-destructive"
                              : item.quantity <= item.min_stock_level * 1.5
                              ? "bg-highlight/20 text-highlight"
                              : item.quantity <= item.min_stock_level * 2
                              ? "bg-accent/20 text-accent"
                              : "bg-primary/20 text-primary"
                          }`}
                        >
                          {getStockLabel(item.quantity, item.min_stock_level)}
                        </span>
                        
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="w-7 h-7"
                            onClick={() => updateMutation.mutate({ id: item._id, quantity: Math.max(0, item.quantity - 1) })}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="w-7 h-7"
                            onClick={() => updateMutation.mutate({ id: item._id, quantity: item.quantity + 1 })}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(item.last_restocked_at || item.createdAt || new Date()).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
