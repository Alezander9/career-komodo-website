import { SignInButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { SpaceBackground, PageContainer, MainContent } from "@/components/layout";
import { Logo } from "@/components/logo";
import { H1, Lead } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { StarBackground } from "../components/StarBackground";

export function LandingPage() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  return (
    <PageContainer>

      <MainContent>
        <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "100vh", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              zIndex: 0,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            <StarBackground />
          </div>

          <SpaceBackground>
            <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center relative z-10">
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
        </div>
      </MainContent>
    </PageContainer>
  );
}