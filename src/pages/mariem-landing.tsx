import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { PageContainer, MainContent } from "@/components/layout";
import { Logo } from "@/components/logo";
import { H2, H3, P, Lead } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { StarBackground } from "../components/StarBackground";

export function MariemLandingPage() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <PageContainer>
      {/* Navbar/Header stays at the top */}
      <header className="p-4 relative z-20 bg-transparent">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/komodo-text")}
              >
                Chat with Komodo
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

      <MainContent className="relative">
        {/* StarBackground as a background layer for main content */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <StarBackground />
        </div>

        {/* Hero Section: fills the viewport and fades in */}
        <section
          className={`relative flex flex-col items-center justify-center min-h-screen w-full text-center transition-opacity duration-[2500ms] ${
            fadeIn ? "opacity-100" : "opacity-0"
          }`}
          style={{ zIndex: 10 }}
        >
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            {/* Grand, sparkly, animated headline */}
            <h1
              className="mb-8 font-extrabold tracking-tight"
              style={{
                fontSize: "clamp(3rem, 8vw, 6rem)",
                lineHeight: 1.05,
                letterSpacing: "0.04em",
                // background: "linear-gradient(90deg, #fff 40%, #ffe066 60%, #6dd5fa 80%, #fff 100%)",
                background: "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet, red)", //ONLY FOR JUNE
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "sparkle 3.5s linear infinite",
                filter: "drop-shadow(0 4px 32px #ffe06688) drop-shadow(0 2px 8px #00f8)",
                position: "relative",
              }}
            >
              <span className="sparkle-text">Your Career Journey Starts Here</span>
            </h1>
            <Lead className="mb-10 max-w-2xl mx-auto text-white/90 text-xl md:text-2xl">
              Discover your path to success with personalized career guidance and expert mentorship
            </Lead>
            <div className="flex gap-4 justify-center">
              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <Button size="lg" className="shadow-lg shadow-yellow-200/20">Get Started</Button>
                  </SignInButton>
                  <Button
                    size="lg"
                    variant="outline"
                    className="shadow-lg shadow-blue-200/20"
                    onClick={() => navigate("/faq")}
                  >
                    Learn More
                  </Button>
                </>
              ) : (
                <Button size="lg" onClick={() => navigate("/home")}>
                  Go to Dashboard
                </Button>
              )}
            </div>
          </div>
          {/* Optional: Scroll indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce text-white/80">
            <svg width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 10v10M10 15l5 5 5-5" />
            </svg>
          </div>
          {/* Sparkle keyframes */}
          <style>{`
            @keyframes sparkle {
              0% { background-position: 0% 50%; }
              100% { background-position: 100% 50%; }
            }
          `}</style>
        </section>

        {/* Features Section */}
        <section id="features-section" className="py-20 relative z-10 bg-transparent">
          <div className="container mx-auto px-4">
            <H2 className="text-center mb-16 text-4xl">Why Choose CareerKomodo?</H2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="p-8 text-center rounded-lg hover:bg-accent/5 transition-colors">
                <div className="text-4xl mb-4">🎯</div>
                <H3 className="mb-4">Personalized Guidance</H3>
                <P>Get tailored career advice based on your unique goals and aspirations</P>
              </div>
              <div className="p-8 text-center rounded-lg hover:bg-accent/5 transition-colors">
                <div className="text-4xl mb-4">👥</div>
                <H3 className="mb-4">Expert Mentorship</H3>
                <P>Connect with industry professionals who've walked the path before you</P>
              </div>
              <div className="p-8 text-center rounded-lg hover:bg-accent/5 transition-colors">
                <div className="text-4xl mb-4">📈</div>
                <H3 className="mb-4">Career Growth</H3>
                <P>Access resources and tools to accelerate your professional development</P>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 relative z-10">
          <div className="container mx-auto px-4">
            <H2 className="text-center mb-16 text-4xl">Success Stories</H2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="p-8 bg-background rounded-lg shadow-sm">
                <P className="mb-4 italic">
                  "CareerKomodo helped me navigate my career transition with confidence. The mentorship was invaluable!"
                </P>
                <div>
                  <P className="font-semibold">Sarah Johnson</P>
                  <P className="text-[hsl(var(--muted-foreground))]">Software Engineer</P>
                </div>
              </div>
              <div className="p-8 bg-background rounded-lg shadow-sm">
                <P className="mb-4 italic">
                  "The personalized guidance I received was exactly what I needed to take my career to the next level."
                </P>
                <div>
                  <P className="font-semibold">Michael Chen</P>
                  <P className="text-[hsl(var(--muted-foreground))]">Product Manager</P>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative z-10">
          <div className="container mx-auto px-4 text-center">
            <H2 className="mb-8 text-4xl text-white">Ready to Transform Your Career?</H2>
            <P className="mb-12 text-lg text-white/90">Join other professionals who have found their path with CareerKomodo</P>
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/10">Start Your Journey</Button>
              </SignInButton>
            ) : (
              <Button size="lg" variant="outline" onClick={() => navigate("/home")}
                className="bg-transparent border-white hover:bg-white/10">Go to Dashboard</Button>
            )}
          </div>
        </section>
      </MainContent>
    </PageContainer>
  );
}
