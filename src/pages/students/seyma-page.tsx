import { useNavigate } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import { PageContainer, MainContent, Card, Section } from "@/components/layout";
import { Logo } from "@/components/logo";
import { H1, H2, P } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export function SeymaPage() {
  const navigate = useNavigate();

  const studentName = "Seyma";

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
          <H1 className="mb-6 text-center text-4xl font-bold">Your Record Store</H1>
          <div className="grid grid-cols-2 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-4">
                <div
                  className="w-48 h-48 bg-purple-500 rounded-lg shadow-lg hover:bg-purple-600 transition-colors duration-300 flex items-center justify-center text-white text-3xl cursor-pointer"
                  onClick={() => alert(`Clicked square ${index + 1}!`)}
                >
                  {index + 1}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-2">
                    {index === 0 ? "Rock" :
                     index === 1 ? "Pop" :
                     "Turkish"}
                  </h3>
                  <p className="text-gray-600">
                    {index === 0 ? "The Smiths • The Strokes • Fleetwood Mac" :
                     index === 1 ? "Sabrina Carpenter • Gracie Abrams • Taylor Swift" :
                     "Pinhani • Canozan • Dolu Kadehi Ters Tut"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </MainContent>
    </PageContainer>
  );
}
