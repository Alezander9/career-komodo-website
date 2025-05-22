import { api } from "../../convex/_generated/api";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import { PageContainer, MainContent } from "@/components/layout";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useAction } from "convex/react";

interface NodeType {
  id: string;
  x?: number;
  y?: number;
  z?: number;
}

interface LinkType {
  source: string;
  target: string;
}

interface GraphData {
  nodes: NodeType[];
  links: LinkType[];
}

interface StarData {
  [key: string]: {
    label: string;
    description: string;
    links?: { text: string; url: string }[];
  };
}

interface StarMapJSON {
  adjacency: Record<string, string[]>;
  starData: StarData;
  nodeTypes: Record<string, string[]>;
}

function mapToGraphData(adjacency: Record<string, string[]>): GraphData {
  const nodes = Object.keys(adjacency).map(id => ({ id }));
  const links: LinkType[] = [];
  for (const [source, targets] of Object.entries(adjacency)) {
    for (const target of targets) {
      if (!links.find(l => (l.source === target && l.target === source) || (l.source === source && l.target === target))) {
        links.push({ source, target });
      }
    }
  }
  return { nodes, links };
}

const opportunitiesBlock = `
Name: Code in Place
Description: Code in Place is a free introductory coding course offered by Stanford University's Computer Science Department, led by Professor Chris Piech and Professor Mehran Sahami. It teaches the fundamentals of computer programming using the Python language, designed to be accessible to individuals of all backgrounds, including those without prior coding experience. The course is primarily delivered online, with a focus on creating a supportive learning community. This won't prepare you for the workforce, but if you've never coded before, it's a good introduction before you jump into bootcamp.

Name: Codesmith.io
Description: Codesmith.io is a software engineering boot camp offering immersive programs, including a full-time remote program and a part-time remote program, designed to help individuals launch or advance their software engineering careers. They focus on teaching full-stack JavaScript and computer science, using modern web technologies like React and Node.js.

Name: 100 Devs
Description: #100Devs is a completely free, 30-week remote software engineering bootcamp led by Leon Noel, designed to help people—especially those with no prior experience—break into tech. The program includes live classes twice a week, Sunday office hours, and over 20 hours of weekly commitment, focusing on hands-on learning through projects, labs, and client work. Last year, 72 participants landed jobs at top companies like Amazon and Twitter, with average salary increases of $53K. Although the bootcamp started in January, new learners can still join via the #catchup-crew on Discord. To participate, fill out the forms, join the Discord server, and follow the setup instructions in the #join-100Devs channel. Leon brings years of experience teaching at places like Harvard and MIT, and his mission is to provide accessible, high-impact coding education as a form of activism—no cost, no catch, just commitment. You can start with the playlist on YouTube. Just search "100devs" on YouTube.

Name: freeCodeCamp
Description: freeCodeCamp is a free, nonprofit coding bootcamp offering over 2,000 hours of self-paced, hands-on training in web development, data structures, APIs, and more. Learners earn certifications in areas like JavaScript, front-end libraries, and data visualization, and can gain real-world experience by contributing to open-source projects for nonprofits. It also provides a large supportive community and extensive free learning resources.

Name: The Odin Project
Description: The Odin Project is a free, open-source coding curriculum designed to teach full-stack web development through a hands-on, project-based approach. It offers two main learning paths: Full Stack JavaScript and Full Stack Ruby on Rails, both starting with a comprehensive Foundations course covering HTML, CSS, JavaScript, Git, and the command line.
The curriculum emphasizes self-directed learning by guiding students to consult external resources, encouraging the development of problem-solving and research skills. Learners build real-world projects, such as calculators and to-do apps, to reinforce their understanding and showcase their skills.
Supported by an active Discord community, The Odin Project provides a collaborative environment for learners to seek help and share knowledge. Many graduates have successfully transitioned into developer roles, attributing their success to the program's comprehensive and practical approach.

Name: App Academy
Description: App Academy is a top-rated coding bootcamp offering immersive full-time (24 weeks) and part-time (48 weeks) online programs in full-stack software engineering. The curriculum emphasizes hands-on learning with technologies like Python, JavaScript, React, SQL, and Git.
A standout feature is its deferred tuition model, allowing students to pay after securing a job. For those preferring self-paced study, App Academy Open provides free access to over 500 hours of the bootcamp curriculum. Additionally, the GenAI for Software Developers course equips learners with AI development skills.
Graduates have successfully transitioned into software engineering roles at various tech companies.

Name: C0d3.com
Description: C0D3.com is a free, project-based coding platform that teaches full-stack web development with a focus on JavaScript, Node.js, and industry practices. Students work through real-world coding challenges and receive personalized feedback from a community of mentors and peers. The program is structured to help learners build practical skills that align with professional software engineering standards, making it ideal for self-driven learners who value community interaction and mentorship.

Name: Full Stack Open
Description: Full Stack Open is a free, advanced web development course offered by the University of Helsinki. It covers modern technologies like React, Redux, Node.js, TypeScript, GraphQL, Docker, and CI/CD practices. The course is comprehensive, hands-on, and academically rigorous, aiming at learners who already have basic programming knowledge and want to dive deeper into full-stack JavaScript development. It is recognized for its strong focus on real-world application and professional software engineering practices.

Name: boot.dev
Description: boot.dev is a paid, gamified learning platform focused on back-end development, offering interactive coding lessons in Go, Python, and JavaScript. It emphasizes hands-on experience through small, progressive challenges designed for beginners and intermediate learners aiming to become back-end developers. boot.dev is ideal for those who prefer a structured, step-by-step curriculum without video lectures, and it focuses heavily on building technical skills relevant to real software engineering jobs.

Name: Udemy
Description: Free Udemy Courses with a Library Card are available through partnerships many public libraries have with platforms like Gale Presents: Udemy. With just a library card, users can access thousands of professional-grade courses across topics like coding, business, design, and personal development for free. It's a great resource for self-learners looking to build new skills without the high costs typically associated with online learning platforms.

Name: LinkedIn Learning
Description: Free LinkedIn Learning with a Library Card allows library members to access LinkedIn Learning's full course library covering tech, business, design, and personal development topics. It's completely free. This benefit, available through many public libraries, offers high-quality courses taught by industry experts, and can be a valuable addition for anyone looking to build professional skills or supplement a self-taught curriculum without paying for a subscription.
`

const userProfile = "A young man named Ryan who is from Illinois. He likes coding, but doesn't have much experience. He loves komodo dragons. He is extroverted and loves league of legends and JJK."

export function StarMapPage() {

  const generateStarMap = useAction(api.nodejsactions.generateStarMapResponse);
  const [mockAIJSON, setMockAIJSON] = useState<StarMapJSON | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedStar, setSelectedStar] = useState<NodeType | null>(null);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [starData, setStarData] = useState<StarData>({});
  const [spinning, setSpinning] = useState(true);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const navigate = useNavigate();
  const fgRef = useRef<any>(null);
  const angleRef = useRef(0);
  const mapAreaRef = useRef<HTMLDivElement>(null);

  const fetchStarMap = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateStarMap({ userProfile, opportunitiesBlock });
      if (result.success) {
        setMockAIJSON(result.response);
        console.log("Fetched StarMap:", result.response);
      } else {
        setError(result.error || "An unknown error occurred");
        console.error("Error fetching StarMap:", result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Exception fetching StarMap:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mockAIJSON) return;
    setGraphData(mapToGraphData(mockAIJSON.adjacency));
    setStarData(mockAIJSON.starData);
  }, [mockAIJSON]);

  useEffect(() => {
    const handleResize = () => {
      const headerHeight = 72;
      setDimensions({ width: window.innerWidth, height: window.innerHeight - headerHeight });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleEngineTick = useCallback(() => {
    if (!fgRef.current || !spinning) return;
    angleRef.current += 0.002;
    const distance = 120;
    const angle = angleRef.current;
    fgRef.current.cameraPosition(
      {
        x: distance * Math.sin(angle),
        y: distance * 0.1 + 10 * Math.sin(angle * 0.7),
        z: distance * Math.cos(angle)
      },
      { x: 0, y: 0, z: 0 },
      0
    );
  }, [spinning]);

  useEffect(() => {
    if (!spinning && fgRef.current) {
      fgRef.current.cameraPosition(
        { x: 0, y: 0, z: 120 },
        { x: 0, y: 0, z: 0 },
        1500
      );
    }
  }, [spinning]);

  useEffect(() => {
    if (!spinning) return;
    const handleClick = (e: MouseEvent) => {
      if (
        mapAreaRef.current &&
        e.target instanceof Node &&
        mapAreaRef.current.contains(e.target) &&
        !(e.target as HTMLElement).closest(".star-info-popup")
      ) {
        setSpinning(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [spinning]);

  // Render the map or loading state
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-black text-white">
          <div className="text-2xl mb-4">Generating Your StarMap...</div>
          <div className="text-lg">This may take a minute...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-black text-white">
          <div className="text-2xl mb-4">Error Generating StarMap</div>
          <div className="text-lg mb-6">{error}</div>
          <Button onClick={fetchStarMap}>Try Again</Button>
        </div>
      );
    }

    if (!mockAIJSON) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-black text-white">
          <div className="text-3xl mb-6">Ready to Explore Career Paths?</div>
          <div className="text-xl mb-10 max-w-xl text-center">
            Click the button below to generate a personalized star map of career opportunities based on your profile.
          </div>
          <Button 
            size="lg"
            onClick={fetchStarMap}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 text-xl"
          >
            Generate StarMap
          </Button>
        </div>
      );
    }

    const startNodes = new Set(mockAIJSON.nodeTypes.start);
    const endNodes = new Set(mockAIJSON.nodeTypes.end);

    return (
      <ForceGraph3D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        backgroundColor="#000"
        nodeColor={node => {
          if (startNodes.has(node.id)) return "green";
          if (endNodes.has(node.id)) return "red";
          return "#fff";
        }}
        linkColor={() => "#88ccff"}
        nodeThreeObject={(node: NodeType) => {
          const group = new THREE.Group();

          let color = 0xffffff;
          if (startNodes.has(node.id)) color = 0x51d6ff; // green
          else if (endNodes.has(node.id)) color = 0xffd60a; // red

          const geometry = new THREE.SphereGeometry(4, 16, 16);
          const material = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.95
          });
          const sphere = new THREE.Mesh(geometry, material);

          const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.25
          });
          const glow = new THREE.Mesh(new THREE.SphereGeometry(8, 16, 16), glowMaterial);

          group.add(glow);
          group.add(sphere);
          return group;
        }}
        onNodeClick={setSelectedStar}
        enableNodeDrag={false}
        onEngineTick={handleEngineTick}
      />
    );
  };

  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div
        ref={mapAreaRef}
        style={{
          flexGrow: 1,
          minHeight: 0,
          position: "relative",
          width: "100vw",
          background: "#000",
          overflow: "hidden"
        }}
      >
        {renderContent()}

        {/* Show overlay text only when the map is loaded and spinning */}
        {spinning && mockAIJSON && (
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#fff",
              fontSize: "2rem",
              fontWeight: "bold",
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 20,
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              whiteSpace: "nowrap"
            }}
          >
            ✨ Spinning for vibes... ✨
          </div>
        )}

        {/* Selected star info */}
        {selectedStar && (
          <div
            className="star-info-popup"
            style={{
              position: "absolute",
              left: "50%",
              top: "10%",
              transform: "translate(-50%, 0)",
              background: "rgba(0,0,0,0.85)",
              color: "#fff",
              border: "1px solid #fff",
              borderRadius: 8,
              padding: 16,
              zIndex: 30,
              minWidth: 240
            }}
          >
            <div>
              <h2 style={{ fontSize: "1.2rem", marginBottom: 4 }}>
                {starData[selectedStar!.id]?.label ?? `⭐ ${selectedStar!.id}`}
              </h2>
              <p style={{ fontSize: "0.9rem" }}>{starData[selectedStar!.id]?.description ?? "No description available."}</p>
              {starData[selectedStar!.id]?.links && (
                <ul style={{ marginTop: 8 }}>
                  {starData[selectedStar!.id]!.links!.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#88ccff", fontSize: "0.85rem" }}
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              style={{
                marginTop: 12,
                background: "#222",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "4px 12px"
              }}
              onClick={() => setSelectedStar(null)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}