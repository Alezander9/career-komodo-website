import { useNavigate } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import { PageContainer, MainContent, Card, Section } from "@/components/layout";
import { Logo } from "@/components/logo";
import { H1, H2, P } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from 'react';
import { Input } from "../components/ui/input";
import { StarBackground } from "../components/StarBackground";

const useTypewriter = (text: string, speed = 50) => {
  const [displayText, setDisplayText] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayText('');
    
    const typingInterval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayText(text.substring(0, indexRef.current + 1));
        indexRef.current += 1;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed]);

  return displayText;
};

const Typewriter = ({ text, speed }: { text: string, speed: number }) => {
  const displayText = useTypewriter(text, speed);
  return <p>{displayText}</p>;
};

export default Typewriter;

export function KomodoTextPage() {
    //for the blinking, add a random timer for the komodo dragon to blink
    //typewriter effect for the text? 

  const navigate = useNavigate();
  const [userInput, setUserInput] = useState('');
  const [komodoResponse, setKomodoResponse] = useState("Hi there! I'm Komodo. How can I help you today?");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you'll later add the logic to process the user input and generate Komodo's response
    setUserInput('');
  };

  return (
    <>
      <StarBackground />
      <PageContainer>
        <header className="border-b border p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Logo />
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/home")}
              >
                Back to Home
              </Button>
              <SignOutButton>
                <Button variant="outline" size="sm">
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          </div>
        </header>

        <MainContent>
          <Section>
            <H1 className="mb-6">Chat with Komodo</H1>
            
            {/* Komodo's response section with image */}
            <Card className="mb-8 shadow-none border-none">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">🦎</span>
                </div>
                <div className="flex-1">
                  <H2 className="mb-4">Komodo says:</H2>
                  <Typewriter text={komodoResponse} speed={50}/>
                </div>
              </div>
            </Card>

            {/* User input section */}
            <Card className="shadow-none border-none">
              <form onSubmit={handleSubmit} className="flex gap-4">
                <Input
                  type="text"
                  value={userInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1"
                />
                <Button type="submit">Send</Button>
              </form>
            </Card>
          </Section>
        </MainContent>
      </PageContainer>
    </>
  );
}


