import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Lightbulb, 
  Target, 
  Settings, 
  ChevronUp, 
  ChevronDown, 
  Sparkles,
  Copy,
  Bookmark,
  RotateCcw,
  Edit,
  Info
} from "lucide-react";
import { generatePost } from "@/lib/gemini";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const platforms = [
  { id: "twitter", name: "Twitter", icon: "fab fa-twitter", color: "text-blue-500" },
  { id: "linkedin", name: "LinkedIn", icon: "fab fa-linkedin", color: "text-blue-700" },
  { id: "facebook", name: "Facebook", icon: "fab fa-facebook", color: "text-blue-600" },
  { id: "instagram", name: "Instagram", icon: "fab fa-instagram", color: "text-pink-500" },
  { id: "threads", name: "Threads", icon: "fas fa-at", color: "text-gray-700" },
];

const tones = [
  { id: "friendly", name: "Friendly" },
  { id: "professional", name: "Professional" },
  { id: "funny", name: "Funny" },
  { id: "bold", name: "Bold" },
  { id: "inspiring", name: "Inspiring" },
  { id: "casual", name: "Casual" },
];

export default function PostGenerator() {
  const [idea, setIdea] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("twitter");
  const [selectedTone, setSelectedTone] = useState("friendly");
  const [addEmojis, setAddEmojis] = useState(true);
  const [addHashtags, setAddHashtags] = useState(true);
  const [suggestImages, setSuggestImages] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [showGenerated, setShowGenerated] = useState(false);
  const [ideaOpen, setIdeaOpen] = useState(true);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: generatePost,
    onSuccess: (data) => {
      setGeneratedContent(data.content);
      setShowGenerated(true);
      toast({
        title: "Post generated successfully!",
        description: "Your content is ready to share.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const savePostMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/posts", {
        content: generatedContent,
        platform: selectedPlatform,
        tone: selectedTone,
        idea: idea,
        hasEmojis: addEmojis,
        hasHashtags: addHashtags,
        hasSuggestedImages: suggestImages,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Post saved!",
        description: "Your post has been saved to your history.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Save failed",
        description: error.message || "Failed to save post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate({
      idea: idea.trim() || undefined,
      platform: selectedPlatform,
      tone: selectedTone,
      addEmojis,
      addHashtags,
      suggestImages,
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      toast({
        title: "Copied to clipboard!",
        description: "Your post content has been copied.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    savePostMutation.mutate();
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Welcome Card */}
      {!showGenerated && (
        <Card className="shadow-sm">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-2xl mb-4 sm:mb-6">
              <Edit className="text-purple-primary text-2xl sm:text-3xl" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Ready to Create?</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Share your ideas below or let our AI surprise you with amazing content for your social media.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Idea Input */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <Collapsible open={ideaOpen} onOpenChange={setIdeaOpen}>
            <CollapsibleTrigger className="flex items-center w-full mb-4">
              <Lightbulb className="text-yellow-500 text-lg mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Your Idea</h3>
              <div className="ml-auto text-gray-400 hover:text-gray-600 transition-colors">
                {ideaOpen ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="w-full h-32 px-4 py-3 rounded-xl resize-none focus:ring-purple-primary focus:border-purple-primary"
                placeholder="Share your thoughts, ideas, or let us surprise you..."
              />
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Platform & Tone Selection */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <Collapsible open={platformOpen} onOpenChange={setPlatformOpen}>
            <CollapsibleTrigger className="flex items-center w-full mb-4">
              <Target className="text-red-500 text-lg mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Platform & Tone</h3>
              <div className="ml-auto text-gray-400 hover:text-gray-600 transition-colors">
                {platformOpen ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Platform</h4>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {platforms.map((platform) => (
                    <Button
                      key={platform.id}
                      variant={selectedPlatform === platform.id ? "default" : "outline"}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl text-center transition-all text-xs sm:text-sm ${
                        selectedPlatform === platform.id
                          ? "border-purple-primary bg-purple-50 text-purple-primary"
                          : "border-gray-300 hover:border-purple-primary hover:bg-purple-50"
                      }`}
                    >
                      <span className="font-medium">{platform.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Tone</h4>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {tones.map((tone) => (
                    <Button
                      key={tone.id}
                      variant={selectedTone === tone.id ? "default" : "outline"}
                      onClick={() => setSelectedTone(tone.id)}
                      className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl text-center transition-all text-xs sm:text-sm ${
                        selectedTone === tone.id
                          ? "border-purple-primary bg-purple-50 text-purple-primary"
                          : "border-gray-300 hover:border-purple-primary hover:bg-purple-50"
                      }`}
                    >
                      {tone.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
            <CollapsibleTrigger className="flex items-center w-full mb-4">
              <Settings className="text-gray-500 text-lg mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
              <div className="ml-auto text-gray-400 hover:text-gray-600 transition-colors">
                {settingsOpen ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-medium text-gray-700">Add Emojis</span>
                <Switch checked={addEmojis} onCheckedChange={setAddEmojis} />
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-medium text-gray-700">Add Hashtags</span>
                <Switch checked={addHashtags} onCheckedChange={setAddHashtags} />
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-medium text-gray-700">Suggest Images</span>
                <Switch checked={suggestImages} onCheckedChange={setSuggestImages} />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="sticky bottom-4 sm:bottom-6">
        <Button
          onClick={handleGenerate}
          disabled={generateMutation.isPending}
          className="w-full bg-gradient-to-r from-purple-primary to-purple-secondary text-white py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
        >
          <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          {generateMutation.isPending ? "Generating..." : "Surprise Me"}
          {generateMutation.isPending && (
            <div className="ml-2 animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
          )}
        </Button>
      </div>

      {/* Generated Post */}
      {showGenerated && (
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generated Post</h3>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  disabled={savePostMutation.isPending}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-900 whitespace-pre-wrap">{generatedContent}</p>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Info className="mr-2 h-4 w-4" />
              <span>
                Generated for{" "}
                <span className="font-medium">
                  {platforms.find((p) => p.id === selectedPlatform)?.name}
                </span>{" "}
                in{" "}
                <span className="font-medium">
                  {tones.find((t) => t.id === selectedTone)?.name}
                </span>{" "}
                tone
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
