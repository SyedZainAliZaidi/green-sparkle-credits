import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { FloatingVoiceAssistant } from "@/components/FloatingVoiceAssistant";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Quiz from "./pages/Quiz";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/results" element={<Results />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/community" element={<Community />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
    <FloatingVoiceAssistant />
  </TooltipProvider>
);

export default App;
