import { useNavigate } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import { PageContainer, MainContent, Card, Section } from "@/components/layout";
import { Logo } from "@/components/logo";
import { H1, H2, P } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from 'react';

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

  const studentName = "Komodo";

  return (


    
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
          <H1 className="mb-6">{studentName}'s Page</H1>
          <Card>
            <H2 className="mb-4">Welcome to {studentName}'s Page</H2>
            <Typewriter text="This is Working Fine !!" speed={50}/>
            <P className="mb-6">
              This is a placeholder page for {studentName}'s content. Each
              student will build their own unique features on this page.
            </P>
            <P>Students can experiment with:</P>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Custom UI components</li>
              <li>Interactive features</li>
              <li>Data visualization</li>
              <li>API integrations</li>
              <li>And more!</li>
            </ul>
          </Card>
        </Section>
      </MainContent>
    </PageContainer>
  );
}


