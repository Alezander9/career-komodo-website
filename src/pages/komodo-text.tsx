import { useNavigate } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import { PageContainer, MainContent, Card, Section } from "@/components/layout";
import { Logo } from "@/components/logo";
import { H1, H2, P } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from 'react';
import { Input } from "../components/ui/input";
import { KomodoImage } from "../components/KomodoImage";
import { ChatMessageList, ChatMessageProps, KomodoTypingIndicator } from "../components/chat-message";


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
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<ChatMessageProps[]>([
    {
      content: "Hi there! I'm Komodo. How can I help you today?",
      sender: "komodo",
      timestamp: new Date(),
    }
  ]);
  const [currentKomodoResponse, setCurrentKomodoResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message to chat history
    const userMessage: ChatMessageProps = {
      content: userInput,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setCurrentKomodoResponse(''); // Clear current response when user sends new message

    // Simulate Komodo typing
    setIsTyping(true);

    // Simulate Komodo's response after a delay
    setTimeout(() => {
      setIsTyping(false);
      const response = "I'm processing your message..."; // This will be replaced with actual AI response later
      setCurrentKomodoResponse(response);
      
      // Add Komodo's response to chat history after typewriter effect
      setTimeout(() => {
        const komodoResponse: ChatMessageProps = {
          content: response,
          sender: "komodo",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, komodoResponse]);
        setCurrentKomodoResponse(''); // Clear current response after adding to history
      }, response.length * 50); // Wait for typewriter effect to complete
    }, 1000);
  };

  return (
    <PageContainer>
      <MainContent>
        <Section>
          <H1 className="mb-6">Chat with Komodo</H1>
          
          <div className="flex gap-8">
            {/* Left side - Komodo image and current response */}
            <div className="w-64 flex-shrink-0">
              <div className="sticky top-4">
                <div className="w-56 h-56 bg-black rounded-lg flex items-center justify-center mb-4">
                  <KomodoImage />
                </div>
                {/* Current Komodo response with typewriter effect */}
                {(currentKomodoResponse || isTyping) && (
                  <Card className="shadow-none border-none bg-muted/10 p-4">
                    {isTyping ? (
                      <KomodoTypingIndicator />
                    ) : (
                      <Typewriter text={currentKomodoResponse} speed={50} />
                    )}
                  </Card>
                )}
              </div>
            </div>

            {/* Right side - Chat history and input */}
            <div className="flex-1">
              <div className="flex flex-col">
                <H2 className="mb-4">Chat History</H2>
                
                {/* Chat history */}
                <div className="h-[400px] overflow-y-auto mb-4 border rounded-lg p-4 bg-muted/10">
                  <ChatMessageList messages={messages} />
                  <div ref={messagesEndRef} />
                </div>

                {/* User input section */}
                <form onSubmit={handleSubmit} className="flex gap-4">
                  <Input
                    type="text"
                    value={userInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!userInput.trim() || isTyping}>
                    Send
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </Section>
      </MainContent>
    </PageContainer>
  );
}


