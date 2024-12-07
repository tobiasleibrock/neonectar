'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MessageCircle, User, Menu, Send, Link, Briefcase, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Separate component for the chat interface
function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: "Welcome to the AI documentation journey! Let me guide you through the basics..."
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(2);

  const tutorialSteps = [
    { step: 1, title: "Introduction to AI", completed: true },
    { step: 2, title: "Understanding Core Concepts", completed: false },
    { step: 3, title: "Practical Applications", completed: false },
    { step: 4, title: "Advanced Topics", completed: false },
    { step: 5, title: "Final Review", completed: false },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setMessages([...messages, { role: "user", content: inputMessage }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: "This is a simulated AI response to your message." 
      }]);
    }, 1000);

    setInputMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="border-b">
        <nav className="max-w-6xl w-full mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Menu className="h-6 w-6" />
              <h1 className="text-xl font-bold">AI Journey</h1>
            </div>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </nav>
      </header>

      <main className="flex-1 w-full">
        <div className="max-w-6xl w-full mx-auto px-4">
          {/* Progress Bar */}
          <div className="py-4 w-full">
            <div className="space-y-2 w-full">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Introduction to AI</span>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>Step {currentStep} of {tutorialSteps.length}</span>
                  <div className="flex items-center text-xs text-muted-foreground/80">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  </div>
                </div>
              </div>
              <TooltipProvider delayDuration={0}>
                <Tooltip defaultOpen={false}>
                  <TooltipTrigger asChild>
                    <div className="w-full cursor-pointer group">
                      <Progress 
                        value={40} 
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
                            currentStep === step.step ? 'text-primary font-medium' : 
                            step.completed ? 'text-muted-foreground' : 'text-muted-foreground/60'
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <div className={`h-4 w-4 rounded-full border ${
                              currentStep === step.step ? 'border-primary bg-primary/20' : 'border-muted-foreground/60'
                            }`} />
                          )}
                          <span>{step.title}</span>
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {/* Left Side - Chat */}
            <div className="w-full">
              <Card className="p-4 flex flex-col h-[calc(100vh-12rem)]">
                <div className="flex-1 overflow-y-auto space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Chat Transcript
                  </h2>
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
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
            <div className="space-y-4 w-full">
              {/* Video Section */}
              <Card className="aspect-video bg-muted flex items-center justify-center w-full">
                <p className="text-muted-foreground">Demo Video</p>
              </Card>

              {/* Avatar Section */}
              <Card className="p-4 h-[calc(50vh-8rem)] w-full">
                <div className="h-full flex flex-col items-center justify-center">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <p className="mt-4 text-center text-muted-foreground">
                    AI Assistant Speaking...
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [docLink, setDocLink] = useState('');
  const [position, setPosition] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [errors, setErrors] = useState({ docLink: '', position: '' });
  const [loadingMessage, setLoadingMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const loadingSteps = [
    { message: 'Analyzing documentation...', targetProgress: 25 },
    { message: 'Creating personalized tutorial...', targetProgress: 50 },
    { message: 'Generating video content...', targetProgress: 75 },
    { message: 'Finalizing your experience...', targetProgress: 100 }
  ];

  const validateInputs = () => {
    const newErrors = { docLink: '', position: '' };
    let isValid = true;

    if (!docLink.trim()) {
      newErrors.docLink = 'Please provide a documentation link';
      isValid = false;
    }

    if (!position.trim()) {
      newErrors.position = 'Please specify your position';
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

    const startTime = Date.now();
    const totalDuration = 5000; // 5 seconds total
    const stepDuration = totalDuration / loadingSteps.length;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / totalDuration) * 100, 100);
      
      // Update progress
      setProgress(Math.round(currentProgress));
      
      // Update message based on progress
      const currentStep = Math.min(Math.floor(elapsed / stepDuration), loadingSteps.length - 1);
      setLoadingMessage(loadingSteps[currentStep].message);

      if (currentProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          setShowChat(true);
        }, 100);
      }
    };

    requestAnimationFrame(animate);
  };

  if (showChat) {
    return <ChatInterface />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="border-b">
        <nav className="max-w-6xl w-full mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Menu className="h-6 w-6" />
              <h1 className="text-xl font-bold">AI Journey</h1>
            </div>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center">Start Your AI Journey</h2>
          
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
                  if (errors.docLink) setErrors(prev => ({ ...prev, docLink: '' }));
                }}
                className={errors.docLink ? 'border-red-500' : ''}
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
                  if (errors.position) setErrors(prev => ({ ...prev, position: '' }));
                }}
                className={errors.position ? 'border-red-500' : ''}
              />
              {errors.position && (
                <p className="text-sm text-red-500">{errors.position}</p>
              )}
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full transform transition-transform duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-lg"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                {isLoading ? loadingMessage : 'Create Tutorial'}
              </Button>
              
              {isLoading && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full h-2" />
                  <p className="text-sm text-center text-muted-foreground">{progress}% Complete</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}