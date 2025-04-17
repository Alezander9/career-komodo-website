import { SignInButton } from "@clerk/clerk-react";
import { SpaceBackground } from "@/components/layout";
import { Logo } from "@/components/logo";
import { H1, Lead } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  return (
    <SpaceBackground>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="animate-float mb-6">
          <Logo size="lg" />
        </div>

        <H1 className="mb-4">Welcome to Career Komodo</H1>

        <Lead className="max-w-2xl mb-8">
          Explore career paths and alternatives to four-year college education
          with our AI-powered guide.
        </Lead>

        <SignInButton mode="modal">
          <Button size="lg" className="animate-pulse-slow">
            Get Started
          </Button>
        </SignInButton>
      </div>
    </SpaceBackground>
  );
}
