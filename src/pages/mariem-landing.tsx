import { useNavigate } from "react-router-dom";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { PageContainer, MainContent } from "@/components/layout";
import { Logo } from "@/components/logo";
import { H1, H2, H3, P, Lead } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export function MariemLandingPage() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  return (
    <PageContainer>
      <header className="p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm"
            onClick={() => navigate("/komodo-text")}>
              Komodo Text
            </Button>
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

      <MainContent>
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <H1 className="mb-6">Your Career Journey Starts Here</H1>
            <Lead className="mb-8 max-w-2xl mx-auto">
              Discover your path to success with personalized career guidance and expert mentorship
            </Lead>
            <div className="flex gap-4 justify-center">
              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <Button size="lg">Get Started</Button>
                  </SignInButton>
                  <Button size="lg" variant="outline" onClick={() => navigate("/tutorial#faq")}>
                    Learn More
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="w-8 h-8 text-primary animate-pulse"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                        fill="currentColor"
                      />
                      <path
                        d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z"
                        fill="currentColor"
                      />
                    </svg>
                    <Button 
                      size="lg" 
                      onClick={() => navigate("/komodo-text")}
                      className="animate-pulse-slow"
                    >
                      Chat with Komodo
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <H2 className="text-center mb-12">Why Choose CareerKomodo?</H2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 text-center">
                <div className="text-4xl mb-4">🎯</div>
                <H3 className="mb-4">Personalized Guidance</H3>
                <P>Get tailored career advice based on your unique goals and aspirations</P>
              </div>
              <div className="p-6 text-center">
                <div className="text-4xl mb-4">👥</div>
                <H3 className="mb-4">Expert Mentorship</H3>
                <P>Connect with industry professionals who've walked the path before you</P>
              </div>
              <div className="p-6 text-center">
                <div className="text-4xl mb-4">📈</div>
                <H3 className="mb-4">Career Growth</H3>
                <P>Access resources and tools to accelerate your professional development</P>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <H2 className="text-center mb-12">Success Stories</H2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6">
                <P className="mb-4 italic">
                  "CareerKomodo helped me navigate my career transition with confidence. The mentorship was invaluable!"
                </P>
                <div>
                  <P className="font-semibold">Sarah Johnson</P>
                  <P className="text-[hsl(var(--muted-foreground))]">Software Engineer</P>
                </div>
              </div>
              <div className="p-6">
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
        <section className="py-20 bg-[hsl(var(--accent))]">
          <div className="container mx-auto px-4 text-center">
            <H2 className="mb-6">Ready to Transform Your Career?</H2>
            <P className="mb-8">Join other professionals who have found their path with CareerKomodo</P>
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/10">
                  Start Your Journey
                </Button>
              </SignInButton>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <svg
                  className="w-8 h-8 text-white animate-pulse"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z"
                    fill="currentColor"
                  />
                </svg>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate("/komodo-text")}
                  className="bg-transparent border-white hover:bg-white/10 animate-pulse-slow"
                >
                  Chat with Komodo
                </Button>
              </div>
            )}
          </div>
        </section>
      </MainContent>
    </PageContainer>
  );
} 