import React from "react";
import { PageContainer, MainContent } from "@/components/layout";
import { H1, H2, H3, P } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export function TutorialPage() {
    const { isSignedIn } = useUser();
    const navigate = useNavigate();
    
    return (
        <PageContainer>
            <header className="border-b border p-4">
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
                <div id="faq" className="max-w-4xl mx-auto">
                    <H1 className="text-center mb-12">Frequently Asked Questions</H1>
                    
                    <div className="space-y-8">
                        <section>
                            <H2 className="mb-4">What is CareerKomodo?</H2>
                            <P className="mb-4">
                                CareerKomodo is an AI-powered career guidance platform that helps you explore career paths and alternatives to traditional education. We provide personalized guidance, expert mentorship, and tools to help you navigate your career journey.
                            </P>
                        </section>

                        <section>
                            <H2 className="mb-4">How does CareerKomodo work?</H2>
                            <P className="mb-4">
                                CareerKomodo uses advanced AI technology to understand your goals, interests, and background. Through interactive conversations and personalized tools, we help you discover career paths that match your aspirations and provide guidance on how to achieve them.
                            </P>
                        </section>

                        <section>
                            <H2 className="mb-4">What features are available?</H2>
                            <div className="space-y-4">
                                <div>
                                    <H3 className="mb-2">Chat with Komodo</H3>
                                    <P>Have personalized conversations with our AI mentor about your career goals and get tailored advice.</P>
                                </div>
                                <div>
                                    <H3 className="mb-2">Career Opportunities</H3>
                                    <P>Explore various career paths and learn about different roles, requirements, and growth opportunities.</P>
                                </div>
                                <div>
                                    <H3 className="mb-2">StarMap</H3>
                                    <P>Visualize your career journey and discover potential paths based on your interests and goals.</P>
                                </div>
                            </div>
                        </section>

                        <section>
                            <H2 className="mb-4">Is CareerKomodo free to use?</H2>
                            <P className="mb-4">
                                CareerKomodo offers both free and premium features. Basic access to chat with Komodo and explore career paths is free, while advanced features and personalized mentorship may require a subscription.
                            </P>
                        </section>

                        <section>
                            <H2 className="mb-4">How do I get started?</H2>
                            <P className="mb-4">
                                Getting started is easy! Simply sign up for an account, and you'll have immediate access to chat with Komodo and explore our basic features. You can then gradually explore more advanced features as you progress in your career journey.
                            </P>
                        </section>

                        <section className="text-center pt-8">
                            {!isSignedIn ? (
                                <SignInButton mode="modal">
                                    <Button size="lg">Get Started Now</Button>
                                </SignInButton>
                            ) : (
                                <Button size="lg" onClick={() => navigate("/komodo-text")}>
                                    Chat with Komodo
                                </Button>
                            )}
                        </section>
                    </div>
                </div>
            </MainContent>
        </PageContainer>
    );
}