import { useNavigate } from "react-router-dom";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { PageContainer, MainContent, Card } from "@/components/layout";
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
            onClick={() => navigate("/opportunities")}>
              Opportunities
            </Button>
            <Button variant="outline" size="sm"
            onClick={() => navigate("/about-us")}>
              About Us
            </Button>
            <Button variant="outline" size="sm"
            onClick={() => navigate("/faq")}>
              FAQ
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
                  <Button size="lg" variant="outline" onClick={() => navigate("/home")}>Learn More</Button>
                </>
              ) : (
                <Button size="lg" onClick={() => navigate("/home")}>Return to Dashboard</Button>
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
                <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/10">Start Your Journey</Button>
              </SignInButton>
            ) : (
              <Button size="lg" variant="outline" onClick={() => navigate("/home")}
                className="bg-transparent border-white hover:bg-white/10">Return to Dashboard</Button>
            )}
          </div>
        </section>
      </MainContent>
    </PageContainer>
  );
} 