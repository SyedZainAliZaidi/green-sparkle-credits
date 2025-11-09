import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { FloatingVoiceAssistant } from "@/components/FloatingVoiceAssistant";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Quiz from "./pages/Quiz";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if no input is focused
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Check if any modifier keys are pressed
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'u':
          navigate('/upload');
          break;
        case 'd':
          navigate('/dashboard');
          break;
        case 'c':
          navigate('/community');
          break;
        case 'h':
          navigate('/');
          break;
        case 's':
          navigate('/settings');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  return (
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
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <FloatingVoiceAssistant />
    </TooltipProvider>
  );
};

export default App;
