import React, { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { StarMapPage } from "./starmap";
import { StarBackground } from "../components/StarBackground";
import { useParams } from "react-router-dom";
import { Id } from "@convex/_generated/dataModel";
import { BriefcaseBusiness, Sparkles } from "lucide-react";
import { motion } from "motion/react";

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
    link: "https://codeinplace.stanford.edu/",
  },
  {
    title: "Codesmith.io",
    company: "Codesmith.io",
    location: "Remote",
    link: "https://codesmith.io/",
  },
  {
    title: "100 Devs",
    company: "#100Devs (Leon Noel)",
    location: "Remote",
    link: "https://leonnoel.com/100devs/",
  },
  {
    title: "freeCodeCamp",
    company: "freeCodeCamp.org",
    location: "Online",
    link: "https://www.freecodecamp.org/",
  },
  {
    title: "The Odin Project",
    company: "The Odin Project",
    location: "Online",
    link: "https://www.theodinproject.com/",
  },
  {
    title: "App Academy",
    company: "App Academy",
    location: "Remote",
    link: "https://www.appacademy.io/",
  },
  {
    title: "C0d3.com",
    company: "C0D3.com",
    location: "Online",
    link: "https://www.c0d3.com/",
  },
  {
    title: "Full Stack Open",
    company: "University of Helsinki",
    location: "Online",
    link: "https://fullstackopen.com/",
  },
  {
    title: "boot.dev",
    company: "boot.dev",
    location: "Online",
    link: "https://boot.dev/",
  },
  {
    title: "Udemy (via Library Card)",
    company: "Udemy / Gale Presents: Udemy",
    location: "Online (via Public Library)",
    link: "https://www.gale.com/udemy",
  },
  {
    title: "LinkedIn Learning (via Library Card)",
    company: "LinkedIn Learning",
    location: "Online (via Public Library)",
    link: "https://www.linkedin.com/learning-login/go/library-card",
  },
];

export function CombinedStarMapPage() {
  const scrapeLinkedInJobs = useAction(api.nodejsactions.scrapeLinkedInJobs);
  const { chatId } = useParams();

  const keywords = ["Python", "JavaScript", "TypeScript"];
  const location = "Chicago, Illinois, United States";

  const [step, setStep] = useState<"choose" | "scraping" | "show">("choose");
  const [opportunities, setOpportunities] = useState<JobOpportunity[] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleScrape = async () => {
    setStep("scraping");
    setError(null);
    setOpportunities(null);
    try {
      const jobs = (await scrapeLinkedInJobs({
        keywords,
        location,
      })) as JobOpportunity[];
      setOpportunities(jobs);
      setStep("show");
    } catch (err) {
      setError("Error occurred while scraping jobs.");
      setStep("choose");
    }
  };

  const handleUsePreset = () => {
    setOpportunities(defaultOpportunities);
    setStep("show");
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <StarBackground />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        {step === "choose" && (
          <>
            <h1
              style={{
                color: "white",
                fontSize: "2.4rem",
                textShadow: "0 2px 16px #000, 0 0 8px #00f",
                fontWeight: 700,
                letterSpacing: 2,
                marginBottom: 28,
              }}
            >
              Build Your Career Star Map
            </h1>
            <p
              style={{
                color: "#e0e0e0",
                fontSize: "1.15rem",
                marginBottom: 36,
                maxWidth: 420,
                textAlign: "center",
                textShadow: "0 2px 10px #000",
              }}
            >
              Would you like to scrape fresh job opportunities from LinkedIn, or
              continue with our preset learning and career paths?
            </p>
            <div style={{ display: "flex", gap: 24, marginBottom: 12 }}>
              <motion.button
                initial={{
                  scale: 1,
                  boxShadow: "0 10px 15px -3px rgb(255, 255, 255, 0.5)",
                  border: "2px solid rgb(255, 255, 255, 0.5)",
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 15px -3px rgb(255, 255, 255, 0.5)",
                  border: "2px solid rgb(255, 255, 255, 0.7)",
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-black border-white/50 hover:border-white/70 border-2 shadow-md shadow-white/30 text-white py-2 px-7 rounded-full disabled:opacity-50 flex items-center justify-center gap-2 font-bold"
                onClick={handleScrape}
              >
                Scrape LinkedIn Jobs
                <BriefcaseBusiness className="w-4 h-4" />
              </motion.button>
              <motion.button
                initial={{
                  scale: 1,
                  boxShadow: "0 10px 15px -3px rgb(255, 255, 255, 0.5)",
                  border: "2px solid rgb(255, 255, 255, 0.5)",
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 15px -3px rgb(255, 255, 255, 0.5)",
                  border: "2px solid rgb(255, 255, 255, 0.7)",
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-black border-white/50 hover:border-white/70 border-2 shadow-md shadow-white/30 text-white py-2 px-7 rounded-full disabled:opacity-50 flex items-center justify-center gap-2 font-bold"
                onClick={handleUsePreset}
              >
                Continue with Preset
                <BriefcaseBusiness className="w-4 h-4" />
              </motion.button>
            </div>
            {error && (
              <div style={{ color: "#ffe066", marginTop: 18, fontWeight: 600 }}>
                {error}
              </div>
            )}
          </>
        )}

        {step === "scraping" && (
          <>
            <h1
              style={{
                color: "white",
                fontSize: "2.2rem",
                textShadow: "0 2px 16px #000, 0 0 8px #00f",
                fontWeight: 700,
                letterSpacing: 2,
                marginBottom: 28,
              }}
            >
              Scraping LinkedIn Jobs...
            </h1>
            <div
              style={{ marginBottom: 16, color: "#ffe066", fontWeight: 500 }}
            >
              <span>Keywords:</span> {keywords.join(", ")}
            </div>
            <div style={{ color: "#ffe066", fontWeight: 500 }}>
              <span>Location:</span> {location}
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 36 }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#ffe066",
                    opacity: 0.85,
                    animation: `starmap-bounce 1.2s infinite cubic-bezier(.36,.07,.19,.97) both`,
                    animationDelay: `${i * 0.18}s`,
                  }}
                />
              ))}
            </div>
          </>
        )}

        {step === "show" && (
          <div
            style={{
              width: "100vw",
              height: "100vh",
              position: "fixed",
              left: 0,
              top: 0,
            }}
          >
            <StarMapPage
              opportunities={opportunities ?? defaultOpportunities}
              chatId={chatId as Id<"chats">}
            />
          </div>
        )}
      </div>
      <style>{`
        @keyframes starmap-bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.7; }
          40% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
