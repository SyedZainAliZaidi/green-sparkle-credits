import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Globe, 
  Moon, 
  Sun, 
  Trash2, 
  Database,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useHaptic } from "@/hooks/useHaptic";
import { supabase } from "@/integrations/supabase/client";

export default function Settings() {
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [storageStatus, setStorageStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const { triggerLight, triggerSuccess } = useHaptic();

  useEffect(() => {
    checkEnvironment();
    // Load saved preferences
    const savedLanguage = localStorage.getItem('language') as 'en' | 'ur' | null;
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const checkEnvironment = async () => {
    // Check Supabase connection
    try {
      const { error } = await supabase.from('submissions').select('id').limit(1);
      setSupabaseStatus(error ? 'error' : 'connected');
    } catch {
      setSupabaseStatus('error');
    }

    // Check Storage connection
    try {
      const { data, error } = await supabase.storage.getBucket('cookstove-images');
      setStorageStatus(error ? 'error' : 'connected');
    } catch {
      setStorageStatus('error');
    }
  };

  const handleLanguageToggle = () => {
    const newLanguage = language === 'en' ? 'ur' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    triggerLight();
    toast.success(
      newLanguage === 'en' 
        ? "Language changed to English" 
        : "زبان اردو میں تبدیل ہو گئی"
    );
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    triggerLight();
    toast.success(`Theme changed to ${newTheme} mode`);
  };

  const handleClearCache = () => {
    try {
      // Clear localStorage except preferences
      const language = localStorage.getItem('language');
      const theme = localStorage.getItem('theme');
      localStorage.clear();
      if (language) localStorage.setItem('language', language);
      if (theme) localStorage.setItem('theme', theme);
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      triggerSuccess();
      toast.success("Cache cleared successfully! ✓");
    } catch (error) {
      toast.error("Failed to clear cache");
    }
  };

  const getStatusIcon = (status: 'checking' | 'connected' | 'error') => {
    switch (status) {
      case 'checking':
        return <AlertCircle className="h-4 w-4 text-muted-foreground animate-pulse" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: 'checking' | 'connected' | 'error') => {
    switch (status) {
      case 'checking':
        return <Badge variant="outline">Checking...</Badge>;
      case 'connected':
        return <Badge className="bg-success text-success-foreground">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="px-4 py-6 max-w-screen-lg mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="p-3 rounded-full bg-primary/10">
            <SettingsIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {language === 'ur' ? "ترتیبات" : "Settings"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {language === 'ur' ? "اپنی ترجیحات منظم کریں" : "Manage your preferences"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Language Settings */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <Label className="text-base font-semibold">
                    {language === 'ur' ? "زبان" : "Language"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ur' ? "انگریزی / اردو" : "English / Urdu"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{language === 'en' ? '🇬🇧 EN' : '🇵🇰 اردو'}</span>
                <Switch
                  checked={language === 'ur'}
                  onCheckedChange={handleLanguageToggle}
                />
              </div>
            </div>
          </Card>

          {/* Theme Settings */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'light' ? (
                  <Sun className="h-5 w-5 text-primary" />
                ) : (
                  <Moon className="h-5 w-5 text-primary" />
                )}
                <div>
                  <Label className="text-base font-semibold">
                    {language === 'ur' ? "تھیم" : "Theme"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'light' 
                      ? (language === 'ur' ? "روشن موڈ" : "Light mode")
                      : (language === 'ur' ? "تاریک موڈ" : "Dark mode")
                    }
                  </p>
                </div>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={handleThemeToggle}
              />
            </div>
          </Card>

          {/* Environment Status */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Database className="h-5 w-5 text-primary" />
                <Label className="text-base font-semibold">
                  {language === 'ur' ? "ماحولیاتی حیثیت" : "Environment Status"}
                </Label>
              </div>

              {/* Supabase Status */}
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-2">
                  {getStatusIcon(supabaseStatus)}
                  <span className="text-sm font-medium">Database</span>
                </div>
                {getStatusBadge(supabaseStatus)}
              </div>

              {/* Storage Status */}
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-2">
                  {getStatusIcon(storageStatus)}
                  <span className="text-sm font-medium">Storage</span>
                </div>
                {getStatusBadge(storageStatus)}
              </div>

              {/* API Keys */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">NASA POWER API</span>
                </div>
                <Badge className="bg-success text-success-foreground">Active</Badge>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={checkEnvironment}
                className="w-full mt-2"
              >
                {language === 'ur' ? "دوبارہ جانچیں" : "Recheck Status"}
              </Button>
            </div>
          </Card>

          {/* Cache Management */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-destructive" />
                <div>
                  <Label className="text-base font-semibold">
                    {language === 'ur' ? "کیش صاف کریں" : "Clear Cache"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ur' 
                      ? "عارضی ڈیٹا حذف کریں" 
                      : "Delete temporary data"
                    }
                  </p>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearCache}
              >
                {language === 'ur' ? "صاف کریں" : "Clear"}
              </Button>
            </div>
          </Card>

          {/* App Info */}
          <Card className="p-6 bg-muted/50">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>{language === 'ur' ? "ورژن" : "Version"}</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'ur' ? "تعمیر" : "Build"}</span>
                <span className="font-medium">{import.meta.env.MODE}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{language === 'ur' ? "پاکستان کے لیے بنایا گیا" : "Built for Pakistan"}</span>
                <span>🇵🇰</span>
              </div>
            </div>
          </Card>

          {/* Debug Info (Dev Only) */}
          {import.meta.env.DEV && (
            <Card className="p-6 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <Label className="text-base font-semibold text-yellow-900 dark:text-yellow-100">
                    Debug Mode (Dev Only)
                  </Label>
                </div>
                <div className="space-y-1 text-xs font-mono text-yellow-800 dark:text-yellow-200">
                  <div>Supabase URL: {import.meta.env.VITE_SUPABASE_URL?.substring(0, 30)}...</div>
                  <div>Project ID: {import.meta.env.VITE_SUPABASE_PROJECT_ID}</div>
                  <div>Mode: {import.meta.env.MODE}</div>
                </div>
              </div>
            </Card>
          )}

          {/* Keyboard Shortcuts */}
          <Card className="p-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                {language === 'ur' ? "کی بورڈ شارٹ کٹس" : "Keyboard Shortcuts"}
              </Label>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Upload</span>
                  <kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded">U</kbd>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Dashboard</span>
                  <kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded">D</kbd>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Community</span>
                  <kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded">C</kbd>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Home</span>
                  <kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded">H</kbd>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
