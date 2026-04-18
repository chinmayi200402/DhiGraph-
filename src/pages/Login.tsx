import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, User, Shield, Stethoscope, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function Login() {
    const navigate = useNavigate();
    const [role, setRole] = useState("admin");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login - direct to dashboard, passing role and name
        navigate("/dashboard", { state: { role, name } });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background aesthetics */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo & Hospital Name */}
                <div className="flex flex-col items-center mb-8 text-center gap-4">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-xl shadow-primary/20 overflow-hidden border border-slate-100"
                    >
                        <img src="/logo.png" alt="Adichunchanagiri AMC" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<span class=\"text-2xl font-bold text-slate-400\">AMC</span>'); }} />
                    </motion.div>
                    <div>
                        <div className="relative inline-flex items-center justify-center py-6 px-10 mt-1 mb-2">
                            <Brain className="absolute inset-0 w-full h-full text-primary/15" strokeWidth={1} />
                            <h1 className="font-display text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent relative z-10 flex items-center pb-3 leading-normal">
                                DhiGraph
                            </h1>
                        </div>
                        <div className="mt-3 px-4">
                            <p className="font-display text-lg md:text-xl font-bold text-foreground leading-tight uppercase tracking-wide">
                                Adichunchanagiri Ayurveda Medical College
                            </p>
                            <p className="text-sm md:text-md text-primary font-semibold mt-1">
                                Hospital and Research Centre
                            </p>
                        </div>
                    </div>
                </div>

                <Card className="p-6 md:p-8 backdrop-blur-xl bg-card/80 border-primary/20 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-foreground ml-1">Select Role</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: "admin", icon: Shield, label: "Admin" },
                                    { id: "doctor", icon: Stethoscope, label: "Doctor" },
                                    { id: "staff", icon: User, label: "Staff" }
                                ].map((r) => (
                                    <button
                                        key={r.id}
                                        type="button"
                                        onClick={() => setRole(r.id)}
                                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200 ${role === r.id
                                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                                            : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                            }`}
                                    >
                                        <r.icon className={`w-5 h-5 ${role === r.id ? "text-primary" : "opacity-70"}`} />
                                        <span className="text-xs font-semibold">{r.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-medium text-foreground ml-1">Name</label>
                            <Input
                                type="text"
                                placeholder={`Enter your ${role} name...`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-12 bg-background/50 border-primary/20 focus-visible:ring-primary shadow-sm"
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-medium text-foreground ml-1">Password</label>
                            <Input
                                type="password"
                                placeholder="Enter your password..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12 bg-background/50 border-primary/20 focus-visible:ring-primary shadow-sm"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full h-12 text-lg font-medium group transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
                            Secure Login
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-xs text-muted-foreground mt-8">
                    © {new Date().getFullYear()} DhiGraph Clinical System. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
}
