import { SignInButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { SpaceBackground, PageContainer, MainContent } from "@/components/layout";
import { Logo } from "@/components/logo";
import { H1, Lead } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  return (
    <PageContainer>
      <header className="border-b border p-6 relative z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center max-w-7xl">
          <Logo className="scale-110" />
          <div className="flex items-center gap-6">
            {isSignedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/home")}
                className="px-6"
              >
                Back to Home
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button variant="outline" size="sm" className="px-6">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      <MainContent className="px-0">
        <SpaceBackground>
          <div className="flex flex-col items-center justify-center min-h-[85vh] py-16 px-4 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background/80 pointer-events-none" />
            
            <div className="max-w-4xl mx-auto relative z-10 space-y-12">
              <div className="animate-float mb-8">
                <Logo size="lg" className="scale-125" />
              </div>

              <div className="space-y-6">
                <H1 className="text-5xl font-bold tracking-tight">Welcome to Career Komodo</H1>

                <Lead className="max-w-2xl mx-auto text-lg leading-relaxed">
                  Explore career paths and alternatives to four-year college education
                  with our AI-powered guide.
                </Lead>
              </div>

              {!isSignedIn ? (
                <div className="relative z-50 pt-4">
                  <SignInButton mode="modal">
                    <Button size="lg" className="animate-pulse-slow px-8 py-6 text-lg">
                      Get Started
                    </Button>
                  </SignInButton>
                </div>
              ) : (
                <Button 
                  size="lg" 
                  className="animate-pulse-slow px-8 py-6 text-lg"
                  onClick={() => navigate("/home")}
                >
                  Return to Dashboard
                </Button>
              )}
            </div>
          </div>
        </SpaceBackground>
      </MainContent>
    </PageContainer>
  );
}
