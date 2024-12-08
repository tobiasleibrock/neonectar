"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  MessageCircle,
  User,
  Menu,
  Send,
  Link,
  Briefcase,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createApiService } from "@/services/api";
import { Label } from "@/components/ui/label";

const tutorialSteps = [
  {
    step: 1,
    title: "Introduction",
    description:
      "Get started with an overview of the documentation and key concepts",
    completed: false,
  },
  {
    step: 2,
    title: "Core Concepts",
    description: "Deep dive into the fundamental principles and architecture",
    completed: false,
  },
  {
    step: 3,
    title: "Interactive Learning",
    description: "Practice with hands-on examples and real-world scenarios",
    completed: false,
  },
  {
    step: 4,
    title: "Knowledge Check",
    description: "Test your understanding with interactive quizzes",
    completed: false,
  },
];

// Overview component that shows the steps
function Overview({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar language="en" onLanguageChange={() => {}} />

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Your Learning Journey</h1>
            <p className="text-lg text-gray-600">
              Follow these steps to master your documentation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {tutorialSteps.map((step) => (
              <Card
                key={step.step}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="min-w-[2rem] h-8 aspect-square rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold border border-gray-200">
                    {step.step}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button
              onClick={onStart}
              className="px-8 py-6 text-lg group bg-black hover:bg-gray-900"
            >
              Start Learning
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Separate component for the chat interface
function ChatInterface({ docUrl }: { docUrl: string }) {
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([
    {
      role: "ai",
      content:
        "Hi there! 👋 I'm your interactive documentation guide. I'll help you understand this demo better. Feel free to ask me any questions about what you're seeing or if you need clarification about any part of the demonstration. What would you like to know more about?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [language, setLanguage] = useState<"en" | "ger">("en");
  const [isPaused, setIsPaused] = useState(false);
  const demoVideoRef = useRef<HTMLVideoElement>(null);
  const avatarVideoRef = useRef<HTMLVideoElement>(null);
  const api = createApiService(false);

  const handleNextStep = () => {
    if (currentStep < tutorialSteps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await api.sendChatMessage({
        messages: [...messages, userMessage],
        doc_url: docUrl,
      });

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: response.response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, I encountered an error processing your message.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle pause/resume
  const handlePauseResume = () => {
    if (!demoVideoRef.current || !avatarVideoRef.current) return;

    if (isPaused) {
      Promise.all([
        demoVideoRef.current.play(),
        avatarVideoRef.current.play(),
      ]).catch((error) => console.error("Error playing videos:", error));
    } else {
      demoVideoRef.current.pause();
      avatarVideoRef.current.pause();
    }
    setIsPaused(!isPaused);
  };

  // Start playing videos when step changes
  useEffect(() => {
    if (demoVideoRef.current && avatarVideoRef.current) {
      demoVideoRef.current.currentTime = 0;
      avatarVideoRef.current.currentTime = 0;
      Promise.all([
        demoVideoRef.current.play(),
        avatarVideoRef.current.play(),
      ]).catch((error) => console.error("Error playing videos:", error));
      setIsPaused(false);
    }
  }, [currentStep, language]);

  // Handle video ending
  const handleVideoEnd = () => {
    if (demoVideoRef.current) demoVideoRef.current.currentTime = 0;
    if (avatarVideoRef.current) avatarVideoRef.current.currentTime = 0;
    Promise.all([
      demoVideoRef.current?.play(),
      avatarVideoRef.current?.play(),
    ]).catch((error) => console.error("Error replaying videos:", error));
    setIsPaused(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar language={language} onLanguageChange={setLanguage} />

      <main className="flex-1 w-full">
        <div className="max-w-6xl w-full mx-auto px-4">
          {/* Progress Bar and Navigation Section */}
          <div className="py-4 w-full">
            <div className="space-y-2 w-full">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="font-medium">
                      {tutorialSteps[currentStep - 1].title}
                    </span>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>
                        Step {currentStep} of {tutorialSteps.length}
                      </span>
                    </div>
                  </div>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip defaultOpen={false}>
                      <TooltipTrigger asChild>
                        <div className="w-full cursor-pointer group">
                          <Progress
                            value={(currentStep / tutorialSteps.length) * 100}
                            className="w-full h-2.5 transition-all duration-200 group-hover:h-3"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        align="center"
                        className="p-4 w-[300px] bg-background border rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95 duration-200"
                      >
                        <div className="space-y-3">
                          {tutorialSteps.map((step, index) => (
                            <div
                              key={step.step}
                              className={`flex items-center gap-2 ${
                                currentStep === step.step
                                  ? "text-primary font-medium"
                                  : step.completed
                                  ? "text-muted-foreground"
                                  : "text-muted-foreground/60"
                              }`}
                            >
                              {step.completed ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <div
                                  className={`h-4 w-4 rounded-full border ${
                                    currentStep === step.step
                                      ? "border-primary bg-primary/20"
                                      : "border-muted-foreground/60"
                                  }`}
                                />
                              )}
                              <span>{step.title}</span>
                            </div>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    disabled={currentStep === tutorialSteps.length}
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-2 gap-4 w-full h-[calc(100vh-16rem)]">
            {/* Left Side - Chat */}
            <div className="w-full h-full">
              <Card className="p-4 flex flex-col h-full">
                <div className="flex-1 overflow-y-auto space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Chat Transcript
                  </h2>
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground ml-auto"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </Card>
            </div>

            {/* Right Side - Video and Avatar */}
            <div className="space-y-4 w-full h-full flex flex-col">
              {/* Video Section */}
              <Card className="flex-1 bg-muted w-full overflow-hidden">
                <video
                  ref={demoVideoRef}
                  className="w-full h-full object-cover"
                  src={`/demo-gumloop-${currentStep}.mp4`}
                  onEnded={handleVideoEnd}
                  autoPlay
                />
              </Card>

              {/* Avatar Section */}
              <Card className="flex-1 relative w-full overflow-hidden">
                <video
                  ref={avatarVideoRef}
                  className="w-full h-full object-cover"
                  src={`/${language}-avatar-gumloop-${currentStep}.mp4`}
                  onEnded={handleVideoEnd}
                  autoPlay
                />
                <Button
                  onClick={handlePauseResume}
                  variant="outline"
                  size="sm"
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 hover:bg-white"
                >
                  {isPaused ? "Resume" : "Pause"}
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavBar({
  language,
  onLanguageChange,
}: {
  language: "en" | "ger";
  onLanguageChange: (lang: "en" | "ger") => void;
}) {
  return (
    <header className="border-b">
      <nav className="max-w-6xl w-full mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Menu className="h-6 w-6" />
            <h1 className="text-xl font-bold">neonectar</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant={language === "en" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onLanguageChange("en")}
                  className={`${
                    language === "en"
                      ? "bg-black hover:bg-gray-900"
                      : "hover:bg-gray-100"
                  } text-sm flex items-center gap-2`}
                >
                  <span>🇬🇧</span>
                  EN
                </Button>
                <Button
                  variant={language === "ger" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onLanguageChange("ger")}
                  className={`${
                    language === "ger"
                      ? "bg-black hover:bg-gray-900"
                      : "hover:bg-gray-100"
                  } text-sm flex items-center gap-2`}
                >
                  <span>🇩🇪</span>
                  DE
                </Button>
              </div>
            </div>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [docLink, setDocLink] = useState("");
  const [position, setPosition] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [errors, setErrors] = useState({ docLink: "", position: "" });
  const [loadingMessage, setLoadingMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const [docUrl, setDocUrl] = useState("");
  const api = createApiService(false);

  const loadingSteps = [
    { message: "Analyzing documentation...", targetProgress: 25 },
    { message: "Creating personalized tutorial...", targetProgress: 50 },
    { message: "Generating video content...", targetProgress: 75 },
    { message: "Finalizing your experience...", targetProgress: 100 },
  ];

  const validateInputs = () => {
    const newErrors = { docLink: "", position: "" };
    let isValid = true;

    if (!docLink.trim()) {
      newErrors.docLink = "Please provide a documentation link";
      isValid = false;
    }

    if (!position.trim()) {
      newErrors.position = "Please specify your position";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleGenerate = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    setProgress(0);
    setLoadingMessage(loadingSteps[0].message);

    try {
      const response = await api.processDocumentation({
        url: docLink,
      });

      if (response.success) {
        setDocUrl(docLink);
        simulateProgress(() => {
          setIsLoading(false);
          setShowOverview(true);
        });
      }
    } catch (error) {
      console.error("Error processing documentation:", error);
      setErrors((prev) => ({
        ...prev,
        docLink: "Error processing documentation. Please try again.",
      }));
      setIsLoading(false);
    }
  };

  const simulateProgress = (onComplete: () => void) => {
    const startTime = Date.now();
    const totalDuration = 5000;
    const stepDuration = totalDuration / loadingSteps.length;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / totalDuration) * 100, 100);

      setProgress(Math.round(currentProgress));

      const currentStep = Math.min(
        Math.floor(elapsed / stepDuration),
        loadingSteps.length - 1
      );
      setLoadingMessage(loadingSteps[currentStep].message);

      if (currentProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    requestAnimationFrame(animate);
  };

  if (showChat) {
    return <ChatInterface docUrl={docUrl} />;
  }

  if (showOverview) {
    return <Overview onStart={() => setShowChat(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar language="en" onLanguageChange={() => {}} />

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-6 bg-gradient-to-b from-white to-gray-50">
          <h2 className="text-2xl font-bold text-center">
            welcome to neonectar
          </h2>

          <p className="text-center text-gray-600">
            Transform your documentation into an interactive learning experience
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Link className="h-4 w-4" />
                Documentation Link
              </label>
              <Input
                placeholder="Paste your documentation URL here"
                value={docLink}
                onChange={(e) => {
                  setDocLink(e.target.value);
                  if (errors.docLink)
                    setErrors((prev) => ({ ...prev, docLink: "" }));
                }}
                className={errors.docLink ? "border-red-500" : ""}
              />
              {errors.docLink && (
                <p className="text-sm text-red-500">{errors.docLink}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Your Position
              </label>
              <Input
                placeholder="e.g. Developer, Product Manager, Designer"
                value={position}
                onChange={(e) => {
                  setPosition(e.target.value);
                  if (errors.position)
                    setErrors((prev) => ({ ...prev, position: "" }));
                }}
                className={errors.position ? "border-red-500" : ""}
              />
              {errors.position && (
                <p className="text-sm text-red-500">{errors.position}</p>
              )}
            </div>

            <div className="space-y-3">
              <Button
                className="w-full transform transition-transform duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-lg bg-black hover:bg-gray-900 text-white"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                {isLoading ? loadingMessage : "Create Tutorial"}
              </Button>

              {isLoading && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full h-2" />
                  <p className="text-sm text-center text-muted-foreground">
                    {progress}% Complete
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
