import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setupApiMockInterceptor } from "@/config/api";

// Initialize the API mock interceptor as a fallback when the backend is unreachable
setupApiMockInterceptor();

createRoot(document.getElementById("root")!).render(<App />);
