import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import { PageContainer, MainContent } from "@/components/layout";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

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

const mockAIJSON: StarMapJSON = {
  "adjacency": {
    "Bootcamp": ["Internship", "Self-Study"],
    "Internship": ["Bootcamp", "Junior Developer"],
    "Self-Study": ["Bootcamp", "Junior Developer"],
    "Junior Developer": ["Internship", "Self-Study", "Mid Developer"],
    "Mid Developer": ["Junior Developer", "Senior Developer", "Team Lead"],
    "Senior Developer": ["Mid Developer", "Tech Lead", "Architect"],
    "Tech Lead": ["Senior Developer", "Team Lead", "Architect"],
    "Team Lead": ["Mid Developer", "Tech Lead", "Engineering Manager"],
    "Architect": ["Senior Developer", "Tech Lead", "CTO"],
    "Engineering Manager": ["Team Lead", "CTO"],
    "CTO": ["Architect", "Engineering Manager"]
  },
  "starData": {
    "Bootcamp": {
      "label": "🚀 Bootcamp",
      "description": "An intensive launchpad for coding skills and real-world projects.",
      "links": [{ "text": "Find a Bootcamp", "url": "https://example.com/bootcamp" }]
    },
    "Internship": {
      "label": "🛠️ Internship",
      "description": "Hands-on experience in a real tech environment, learning from mentors.",
      "links": [{ "text": "Apply for Internships", "url": "https://example.com/internship" }]
    },
    "Self-Study": {
      "label": "📚 Self-Study",
      "description": "Learning independently through online resources, books, and personal projects.",
      "links": [{ "text": "Self-Study Resources", "url": "https://example.com/selfstudy" }]
    },
    "Junior Developer": {
      "label": "👶 Junior Developer",
      "description": "Building foundational skills and contributing to team projects.",
      "links": [{ "text": "Junior Dev Guide", "url": "https://example.com/juniordev" }]
    },
    "Mid Developer": {
      "label": "🧑‍💻 Mid Developer",
      "description": "Taking ownership of features, mentoring juniors, and growing technical depth.",
      "links": [{ "text": "Level Up", "url": "https://example.com/middev" }]
    },
    "Senior Developer": {
      "label": "🦾 Senior Developer",
      "description": "Solving complex problems, leading initiatives, and shaping codebase direction.",
      "links": [{ "text": "Senior Dev Insights", "url": "https://example.com/seniordev" }]
    },
    "Tech Lead": {
      "label": "🧭 Tech Lead",
      "description": "Guiding technical vision, supporting the team, and ensuring quality delivery.",
      "links": [{ "text": "Tech Lead Playbook", "url": "https://example.com/techlead" }]
    },
    "Team Lead": {
      "label": "🤝 Team Lead",
      "description": "Managing people, processes, and fostering a collaborative culture.",
      "links": [{ "text": "Team Lead Tips", "url": "https://example.com/teamlead" }]
    },
    "Architect": {
      "label": "🏗️ Architect",
      "description": "Designing scalable systems and making high-level technical decisions.",
      "links": [{ "text": "Architecture Patterns", "url": "https://example.com/architect" }]
    },
    "Engineering Manager": {
      "label": "📈 Engineering Manager",
      "description": "Balancing people management with project delivery and team growth.",
      "links": [{ "text": "Management 101", "url": "https://example.com/engmanager" }]
    },
    "CTO": {
      "label": "🦉 CTO",
      "description": "Setting technical strategy, building culture, and driving innovation at the highest level.",
      "links": [{ "text": "CTO Wisdom", "url": "https://example.com/cto" }]
    }
  },
  "nodeTypes": {
    "start": ["Bootcamp"],
    "end": ["CTO", "Engineering Manager"]
  }
};

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

export function StarMapPage() {
  const [selectedStar, setSelectedStar] = useState<NodeType | null>(null);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [starData, setStarData] = useState<StarData>({});
  const [spinning, setSpinning] = useState(true);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const navigate = useNavigate();
  const fgRef = useRef<any>(null);

  const startNodes = new Set(mockAIJSON.nodeTypes.start);
  const endNodes = new Set(mockAIJSON.nodeTypes.end);

  const angleRef = useRef(0);

  useEffect(() => {
    const json = mockAIJSON;
    setGraphData(mapToGraphData(json.adjacency));
    setStarData(json.starData);
  }, []);

  // Responsive: update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      // Adjust header height if different in your app!
      const headerHeight = 72;
      setDimensions({ width: window.innerWidth, height: window.innerHeight - headerHeight });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Spinning camera logic: keep spinning as long as spinning is true
  const handleEngineTick = useCallback(() => {
    if (!fgRef.current || !spinning) return;
    angleRef.current += 0.002; // keep incrementing forever
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

  // When spinning stops, reset camera to default position smoothly
  useEffect(() => {
    if (!spinning && fgRef.current) {
      fgRef.current.cameraPosition(
        { x: 0, y: 0, z: 120 },
        { x: 0, y: 0, z: 0 },
        1500
      );
    }
  }, [spinning]);

  // Stop spinning on any click in the map area (except popup)
  const mapAreaRef = useRef<HTMLDivElement>(null);
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

        {/* Overlay text for vibes */}
        {spinning && (
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