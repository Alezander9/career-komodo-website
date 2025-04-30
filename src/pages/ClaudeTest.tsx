import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PageContainer, MainContent, Card } from "@/components/layout";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/typography";

export function ClaudeTest() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const generateResponse = useAction(api.nodejsactions.generateClaudeResponse);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const result = await generateResponse({ prompt });
      if (result.success) {
        setResponse(result.response || "");
      } else {
        setError(result.error || "Unknown error occurred");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

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
        <Card className="max-w-2xl mx-auto">
          <H1 className="mb-6">Claude API Test</H1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium mb-1">
                Enter your prompt:
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-2 border rounded-md bg-gray-900 text-white"
                rows={4}
                placeholder="Type your prompt here..."
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
            >
              {loading ? "Sending..." : "Send to Claude"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
              Error: {error}
            </div>
          )}

          {response && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Response:</h2>
              <div className="p-4 bg-gray-900 text-white rounded-md whitespace-pre-wrap">
                {response}
              </div>
            </div>
          )}
        </Card>
      </MainContent>
    </PageContainer>
  );
} 