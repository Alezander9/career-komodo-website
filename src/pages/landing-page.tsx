import { SignInButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { SpaceBackground, PageContainer, MainContent } from "@/components/layout";
import { Logo } from "@/components/logo";
import { H1, Lead } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";

export function LandingPage() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  return (
    <PageContainer>
      <header className="border-b border p-4 relative z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Logo />
            <Navbar />
          </div>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/home")}
              >
                Back to Home
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      <MainContent>
        <SpaceBackground>
          <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
            <div className="animate-float mb-6">
              <Logo size="lg" />
            </div>

            <H1 className="mb-4">Welcome to Career Komodo</H1>

            <Lead className="max-w-2xl mb-8">
              Explore career paths and alternatives to four-year college education
              with our AI-powered guide.
            </Lead>

            {!isSignedIn ? (
              <div className="relative z-50">
                <SignInButton mode="modal">
                  <Button size="lg" className="animate-pulse-slow">
                    Get Started
                  </Button>
                </SignInButton>
              </div>
            ) : (
              <Button 
                size="lg" 
                className="animate-pulse-slow"
                onClick={() => navigate("/home")}
              >
                Return to Dashboard
              </Button>
            )}
          </div>
        </SpaceBackground>
      </MainContent>
    </PageContainer>
  );
}
