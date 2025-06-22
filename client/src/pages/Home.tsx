import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Star, History, LogOut } from "lucide-react";
import PostGenerator from "@/components/PostGenerator";
import PostHistory from "@/components/PostHistory";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [currentView, setCurrentView] = useState<"generator" | "history">("generator");
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-purple-primary rounded-xl mr-2 sm:mr-3">
              <Star className="text-white text-base sm:text-lg" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">AI Post Generator</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView(currentView === "generator" ? "history" : "generator")}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              <History className="text-base sm:text-lg" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              <LogOut className="text-base sm:text-lg" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-4 sm:py-8">
        {currentView === "generator" ? (
          <PostGenerator />
        ) : (
          <PostHistory onCreateNew={() => setCurrentView("generator")} />
        )}
      </div>
    </div>
  );
}
