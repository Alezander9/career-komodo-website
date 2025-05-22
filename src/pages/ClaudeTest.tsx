import { useState } from "react";
import { PageContainer, MainContent, Card } from "@/components/layout";
import { H1 } from "@/components/ui/typography";

export function ClaudeTest() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // ...API call logic...
    setLoading(false);
  };

  return (
    <PageContainer>
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
        </Card>
      </MainContent>
    </PageContainer>
  );
} 