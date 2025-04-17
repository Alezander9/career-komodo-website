//2D ONE
// import React, { useState, useRef } from "react";
// import ForceGraph2D from "react-force-graph-2d";

// const adjacencyMap = {
//   "A": ["B", "C"],
//   "B": ["A", "D"],
//   "C": ["A", "E", "F"],
//   "D": ["B"],
//   "E": ["C"],
//   "F": ["C"]
// };

// function mapToGraphData(adjacency: Record<string, string[]>) {
//   const nodes = Object.keys(adjacency).map(id => ({ id }));
//   const links: { source: string; target: string }[] = [];
//   for (const [source, targets] of Object.entries(adjacency)) {
//     for (const target of targets) {
//       if (!links.find(l => (l.source === target && l.target === source) || (l.source === source && l.target === target))) {
//         links.push({ source, target });
//       }
//     }
//   }
//   return { nodes, links };
// }

// const graphData = mapToGraphData(adjacencyMap);

// export function StarMapSection() {
//   const [selectedStar, setSelectedStar] = useState<any>(null);

//   return (
//     <div style={{ height: 400, background: "#000", position: "relative", borderRadius: 12, margin: "2rem 0" }}>
//       <ForceGraph2D
//         graphData={graphData}
//         nodeRelSize={8}
//         nodeColor={() => "#fff"}
//         linkColor={() => "#fff"}
//         backgroundColor="#000"
//         nodeCanvasObject={(node, ctx, globalScale) => {
//           // Draw a "star" with glow
//           const size = 8;
//           ctx.save();
//           ctx.beginPath();
//           ctx.arc(node.x!, node.y!, size, 0, 2 * Math.PI, false);
//           ctx.shadowColor = "#fff";
//           ctx.shadowBlur = 20;
//           ctx.fillStyle = "#fff";
//           ctx.fill();
//           ctx.restore();
//         }}
//         onNodeClick={setSelectedStar}
//         enableNodeDrag={false}
//         linkDirectionalParticles={0}
//       />
//       {selectedStar && (
//         <div
//           style={{
//             position: "absolute",
//             left: "50%",
//             top: "10%",
//             transform: "translate(-50%, 0)",
//             background: "rgba(0,0,0,0.85)",
//             color: "#fff",
//             border: "1px solid #fff",
//             borderRadius: 8,
//             padding: 16,
//             zIndex: 10,
//             minWidth: 200
//           }}
//         >
//           <strong>Star: {selectedStar.id}</strong>
//           <br />
//           <button
//             style={{ marginTop: 8, background: "#222", color: "#fff", border: "none", borderRadius: 4, padding: "4px 12px" }}
//             onClick={() => setSelectedStar(null)}
//           >
//             Close
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

//3D ONE
import React, { useState } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from 'three';

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

export function StarMapSection() {
  const [selectedStar, setSelectedStar] = useState<NodeType | null>(null);

  return (
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
  );
}