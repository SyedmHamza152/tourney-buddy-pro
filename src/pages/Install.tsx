import { useState, useEffect } from "react";
import { Download, Share, CheckCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallPage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="font-display text-2xl text-foreground">App Installed!</h1>
          <p className="text-muted-foreground">Tourney Buddy Pro is on your home screen. Open it from there for the best experience.</p>
          <Button onClick={() => window.location.href = "/"} className="gradient-primary">
            Go to App
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <Smartphone className="w-16 h-16 text-primary mx-auto" />
        <h1 className="font-display text-3xl text-foreground">Install Tourney Buddy Pro</h1>
        <p className="text-muted-foreground">
          Add this app to your home screen for a full-screen, app-like experience — no app store needed!
        </p>

        {deferredPrompt ? (
          <Button onClick={handleInstall} size="lg" className="gradient-primary w-full text-lg gap-2">
            <Download className="w-5 h-5" /> Install App
          </Button>
        ) : isIOS ? (
          <div className="bg-card border border-border rounded-xl p-6 space-y-3 text-left">
            <p className="font-display text-foreground text-sm">On iPhone / iPad:</p>
            <ol className="text-muted-foreground text-sm space-y-2 list-decimal list-inside">
              <li>Tap the <Share className="inline w-4 h-4 text-primary" /> <strong>Share</strong> button in Safari</li>
              <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
              <li>Tap <strong>"Add"</strong> to confirm</li>
            </ol>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-6 space-y-3 text-left">
            <p className="font-display text-foreground text-sm">On Android:</p>
            <ol className="text-muted-foreground text-sm space-y-2 list-decimal list-inside">
              <li>Tap the <strong>⋮ menu</strong> in your browser</li>
              <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong></li>
              <li>Confirm the installation</li>
            </ol>
          </div>
        )}

        <Button variant="outline" onClick={() => window.location.href = "/"} className="w-full">
          Continue in Browser
        </Button>
      </div>
    </div>
  );
};

export default InstallPage;
