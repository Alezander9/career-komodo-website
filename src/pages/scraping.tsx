import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { StarMapPage } from "./starmap";

export type JobOpportunity = {
  title: string;
  company: string;
  location: string;
  link: string;
};

const defaultOpportunities: JobOpportunity[] = [
  {
    title: "Code in Place",
    company: "Stanford University (Prof. Chris Piech & Prof. Mehran Sahami)",
    location: "Online",
    link: "https://codeinplace.stanford.edu/"
  },
  {
    title: "Codesmith.io",
    company: "Codesmith.io",
    location: "Remote",
    link: "https://codesmith.io/"
  },
  {
    title: "100 Devs",
    company: "#100Devs (Leon Noel)",
    location: "Remote",
    link: "https://leonnoel.com/100devs/"
  },
  {
    title: "freeCodeCamp",
    company: "freeCodeCamp.org",
    location: "Online",
    link: "https://www.freecodecamp.org/"
  },
  {
    title: "The Odin Project",
    company: "The Odin Project",
    location: "Online",
    link: "https://www.theodinproject.com/"
  },
  {
    title: "App Academy",
    company: "App Academy",
    location: "Remote",
    link: "https://www.appacademy.io/"
  },
  {
    title: "C0d3.com",
    company: "C0D3.com",
    location: "Online",
    link: "https://www.c0d3.com/"
  },
  {
    title: "Full Stack Open",
    company: "University of Helsinki",
    location: "Online",
    link: "https://fullstackopen.com/"
  },
  {
    title: "boot.dev",
    company: "boot.dev",
    location: "Online",
    link: "https://boot.dev/"
  },
  {
    title: "Udemy (via Library Card)",
    company: "Udemy / Gale Presents: Udemy",
    location: "Online (via Public Library)",
    link: "https://www.gale.com/udemy"
  },
  {
    title: "LinkedIn Learning (via Library Card)",
    company: "LinkedIn Learning",
    location: "Online (via Public Library)",
    link: "https://www.linkedin.com/learning-login/go/library-card"
  }
];

export function CuteScrapingPage() {
  const scrapeLinkedInJobs = useAction(api.nodejsactions.scrapeLinkedInJobs);

  const keywords = ["Python", "JavaScript", "TypeScript"];
  const location = "Chicago, Illinois, United States";

  const [opportunities, setOpportunities] = useState<JobOpportunity[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScrape = async () => {
    setLoading(true);
    setError(null);
    setOpportunities(null);
    try {
      const jobs = await scrapeLinkedInJobs({ keywords, location }) as JobOpportunity[];
      setOpportunities(jobs);
    } catch (err) {
      setError("Error occurred while scraping jobs.");
    }
    setLoading(false);
  };

  // Use scraped opportunities if available, otherwise use default
  const opportunitiesToShow = opportunities ?? defaultOpportunities;

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "2rem auto",
        background: "#f8f9fa",
        borderRadius: 16,
        padding: 32,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        fontFamily: "sans-serif"
      }}
    >
      <h2 style={{ textAlign: "center", color: "#5b21b6", fontFamily: "cursive" }}>
        🦄 LinkedIn Job Scraper
      </h2>
      <div style={{ marginBottom: 20, textAlign: "center" }}>
        <div>
          <strong>Keywords:</strong> {keywords.join(", ")}
        </div>
        <div>
          <strong>Location:</strong> {location}
        </div>
        <button
          onClick={handleScrape}
          disabled={loading}
          style={{
            marginTop: 16,
            padding: "12px 32px",
            background: "#a78bfa",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 18,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 2px 8px rgba(90,41,182,0.10)"
          }}
        >
          {loading ? "Scraping..." : "✨ Fetch Opportunities"}
        </button>
      </div>
      {error && (
        <div style={{ color: "red", marginBottom: 16 }}>{error}</div>
      )}
      {/* Only show the table if there are scraped opportunities */}
      {opportunities && opportunities.length > 0 && (
        <div style={{ overflowX: "auto", marginTop: 24 }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            borderRadius: 12,
            overflow: "hidden",
            fontFamily: "inherit"
          }}>
            <thead style={{ background: "#ede9fe" }}>
              <tr>
                <th style={{ padding: 12, borderBottom: "2px solid #a78bfa" }}>Title</th>
                <th style={{ padding: 12, borderBottom: "2px solid #a78bfa" }}>Company</th>
                <th style={{ padding: 12, borderBottom: "2px solid #a78bfa" }}>Location</th>
                <th style={{ padding: 12, borderBottom: "2px solid #a78bfa" }}>Link</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((job, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: 10 }}>{job.title || "—"}</td>
                  <td style={{ padding: 10 }}>{job.company || "—"}</td>
                  <td style={{ padding: 10 }}>{job.location || "—"}</td>
                  <td style={{ padding: 10 }}>
                    {job.link ? (
                      <a href={job.link} target="_blank" rel="noopener noreferrer" style={{ color: "#7c3aed" }}>
                        View
                      </a>
                    ) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {opportunities && opportunities.length === 0 && (
        <div style={{ textAlign: "center", marginTop: 24, color: "#666" }}>
          No opportunities found.
        </div>
      )}
      {/* Always show StarMapPage, using the correct list */}
      <StarMapPage opportunities={opportunitiesToShow} />
    </div>
  );
}