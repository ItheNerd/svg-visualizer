export interface NetworkGraphMLNode {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style: {
    asset: string;
    clipMode: string;
  };
  expanded: string;
  url: string;
  description: string;
  zOrder: number;
  userTags: any;
  viewState: string;
  ports: {
    name: string;
    labels: string;
    locationParameter: string;
    style: string;
    viewState: string;
  }[];
}

export interface NetworkGraphMLEdge {
  id: string;
  source: string;
  target: string;
  sourcePort: string;
  targetPort: string;
  style: {
    stroke: string;
    targetArrow: string;
    sourceArrow: string;
  };
  url: string;
  description: string;
  labels: {
    text: string;
    distance: number;
    layoutParameter: string;
    style: string;
  }[];
  bends: {
    x: number;
    y: number;
  }[];
  viewState: string;
  userTags: string;
  zOrder: number;
  expanded: boolean;
  nodeUrl: string;
  nodeDescription: string;
  nodeLabels: any[];
  nodeGeometry: any;
  nodeStyle: any;
  nodeViewState: any;
}

export interface NetworkGraphMLKeys {
  id: string;
  for: string;
  type: string;
  name: string;
  uri?: string;
  default?: string[];
}

export interface ConvertFromGraphMLResult {
  keys: NetworkGraphMLKeys[];
  nodes: NetworkGraphMLNode[];
  edges: NetworkGraphMLEdge[];
}
