import React from "react";
import { PageContainer } from "@/components/layout";
import { H1 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export function TutorialPage() {
    const { isSignedIn } = useUser();
    const navigate = useNavigate();
    return (
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
    );
}