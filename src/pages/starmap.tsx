import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from 'three';
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

const adjacencyMap: Record<string, string[]> = {
  "A": ["B", "C"],
  "B": ["A", "D"],
  "C": ["A", "E", "F"],
  "D": ["B"],
  "E": ["C"],
  "F": ["C"]
};

function mapToGraphData(adjacency: Record<string, string[]>): { nodes: { id: string }[]; links: { source: string; target: string }[] } {
  const nodes = Object.keys(adjacency).map(id => ({ id }));
  const links: { source: string; target: string }[] = [];
  for (const [source, targets] of Object.entries(adjacency)) {
    for (const target of targets) {
      if (!links.find(l => (l.source === target && l.target === source) || (l.source === source && l.target === target))) {
        links.push({ source, target });
      }
    }
  }
  return { nodes, links };
}

const graphData: GraphData = mapToGraphData(adjacencyMap);

export function StarMapPage() {
  const [selectedStar, setSelectedStar] = useState<NodeType | null>(null);
  const navigate = useNavigate();

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
        <div style={{ height: 600, background: "#000", borderRadius: 12, margin: "2rem 0", position: "relative" }}>
          <ForceGraph3D
            graphData={graphData}
            backgroundColor="#000"
            nodeColor={() => "#fff"}
            linkColor={() => "#fff"}
            nodeThreeObject={(node: NodeType) => {
              const group = new THREE.Group();

              const geometry = new THREE.SphereGeometry(4, 16, 16);
              const material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.95
              });
              const sphere = new THREE.Mesh(geometry, material);

              const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0x88ccff,
                transparent: true,
                opacity: 0.25
              });
              const glow = new THREE.Mesh(
                new THREE.SphereGeometry(8, 16, 16),
                glowMaterial
              );

              group.add(glow);
              group.add(sphere);
              return group;
            }}
            onNodeClick={setSelectedStar}
            enableNodeDrag={false}
          />
          {selectedStar && (
            <div
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
                zIndex: 10,
                minWidth: 200
              }}
            >
              <strong>Star: {selectedStar.id}</strong>
              <br />
              <button
                style={{
                  marginTop: 8,
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
      </MainContent>
    </PageContainer>
  );
} 