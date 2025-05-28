import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import React, { useState } from "react";

export function ScrapedPage() {
  const scrapeLinkedInJobs = useAction(api.nodejsactions.scrapeLinkedInJobs);

  const keywords = ["Python", "JavaScript", "TypeScript"];
  const location = "Las Vegas, Nevada, United States";

  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    setLoading(true);
    setResult(null);
    try {
      const jobs = await scrapeLinkedInJobs({ keywords, location });
      setResult(JSON.stringify(jobs, null, 2));
    } catch (err) {
      setResult("Error occurred");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>LinkedIn Job Scraper</h2>
      <div style={{ marginBottom: 16 }}>
        <div>
          <strong>Keywords:</strong> {keywords.join(", ")}
        </div>
        <div>
          <strong>Location:</strong> {location}
        </div>
        <button onClick={handleScrape} disabled={loading} style={{ width: "100%", padding: 12 }}>
          {loading ? "Scraping..." : "Run Scraping"}
        </button>
      </div>
      {result && (
        <pre
          style={{
            background: "#222",
            color: "#fff",
            padding: 16,
            borderRadius: 8,
            overflowX: "auto",
          }}
        >
          {result}
        </pre>
      )}
    </div>
  );
}