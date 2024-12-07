import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MessageCircle, User, Menu } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Menu className="h-6 w-6" />
            <h1 className="text-xl font-bold">AI Journey</h1>
          </div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="container mx-auto py-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Introduction to AI</span>
            <span>Step 2 of 5</span>
          </div>
          <Progress value={40} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto flex-1 grid grid-cols-2 gap-4 p-4">
        {/* Left Side - Chat */}
        <div className="space-y-4">
          <Card className="p-4 h-[calc(100vh-12rem)] overflow-y-auto">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Chat Transcript
              </h2>
              <div className="space-y-4">
                {/* Mock chat messages */}
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm">
                    Welcome to the AI documentation journey! Let me guide you
                    through the basics...
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side - Video and Avatar */}
        <div className="space-y-4">
          {/* Video Section */}
          <Card className="aspect-video bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Demo Video</p>
          </Card>

          {/* Avatar Section */}
          <Card className="p-4 h-[calc(50vh-8rem)]">
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
  );
}
