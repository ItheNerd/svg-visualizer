import { GraphCanvas } from "reagraph";
const nodes_sample = [
  {
    id: "1",
    label: "1",
  },
  {
    id: "2",
    label: "2",
  },
];

const edges_sample = [
  {
    source: "1",
    target: "2",
    id: "1-2",
    label: "1-2",
  },
  {
    source: "2",
    target: "1",
    id: "2-1",
    label: "2-1",
  },
];

const GraphViewer = ({ nodes = nodes_sample, edges = edges_sample }: any) => {
  return (
    <div className="min-h-96 h-full w-full rounded">
      <GraphCanvas animated nodes={nodes} edges={edges} />
    </div>
  );
};

export default GraphViewer;
