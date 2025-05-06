import { useNavigate } from "react-router-dom";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { PageContainer, MainContent, Card } from "@/components/layout";
import { Logo } from "@/components/logo";
import { H1, H2, H3, P, Lead } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { SpaceBackground } from "@/components/layout";
export function AboutUsPage() {
    const { isSignedIn } = useUser();
    const navigate = useNavigate();

    return (
        <PageContainer>
            <header className="border-b border p-4">
        <div className="container mx-auto flex justify-between items-center">
        <Logo />
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
                <div style = {{textAlign: "center"}}>
                <h1 className="text-5xl font-bold" style = {{marginTop: "20px"}}>About Us</h1>
                <p style = {{textAlign: "left", marginLeft: "10%", marginRight: "10%", marginTop: "20px"}}>Hey divas, diva down, diva is divaing. Twink nation! Twink death. Pattie gonia!</p>
                </div>
            </MainContent>
        </PageContainer>
    );
} 