import {
  ConvertFromGraphMLResult,
  NetworkGraphMLEdge,
  NetworkGraphMLKeys,
  NetworkGraphMLNode,
} from "@/schemas/schema";
import { parseString } from "xml2js";

const flattenElements = (graph: any[], type: "node" | "edge"): any[] => {
  return graph.flatMap((element: any) => {
    const elements = element[type] ?? [];
    const subGraphs = (element.node ?? []).flatMap(
      (node: any) => node.graph ?? []
    );
    const subGraphElements = flattenElements(subGraphs, type);
    return [...elements, ...subGraphElements];
  });
};

function parseKeys(keys: any[]): Record<
  string,
  {
    id: string;
    for: string;
    attrType?: string;
    attrName: string;
    uri?: string;
    default?: any;
  }
> {
  return keys.reduce((acc, key) => {
    const {
      id,
      ["for"]: forWhat,
      ["attr.type"]: attrType,
      ["attr.name"]: attrName,
      ["y:attr.uri"]: uri,
    } = key.$;
    const defaultValue = key.default?.[0];
    acc[id] = {
      id,
      for: forWhat,
      attrType,
      attrName,
      uri,
      default: defaultValue,
    };
    return acc;
  }, {});
}

export function convertFromNetworkGraph(
  content: string
): ConvertFromGraphMLResult {
  let result: any;
  let keyMap: Record<
    string,
    {
      id: string;
      for: string;
      attrType?: string;
      attrName: string;
      uri?: string;
      default?: any;
    }
  >;

  parseString(content, (err, res) => {
    if (err) {
      console.error(err);
      throw new Error("Error parsing XML");
    }

    result = res;
    keyMap = parseKeys(result.graphml.key);
  });

  const keys: NetworkGraphMLKeys[] = result.graphml.key.map((key: any) => {
    return {
      id: key.$.id,
      forElement: key.$.for,
      attrType: key["$"]["attr.type"],
      attrName: key["$"]["attr.name"],
      uri: key["$"]["y:attr.uri"],
      defaultValue:
        key.default?.[0]?.["x:Static"]?.[0]["$"]?.Member || key.default?.[0],
    };
  });

  // console.log(result.graphml.graph[0].node[0].data.find((d: any) => d.$.key === keyMap["d0"].id)?.[0]?._);

  const nodes: NetworkGraphMLNode[] = flattenElements(
    result.graphml.graph,
    "node"
  ).map((node: any) => ({
    id: node.$.id,
    label: node.data
      .find((d: any) => d.$.key === keyMap["d4"].id)
      ?.[
        "x:List"
      ]?.[0]?.["y:Label"]?.[0]?.["y:Label.Text"]?.[0]?.replace(/^<!\[CDATA\[(.*)]\]>$/gm, "$1"),
    x: parseFloat(
      node.data.find((d: any) => d.$.key === keyMap["d5"].id)?.["y:RectD"]?.[0]
        ?.$.X
    ),
    y: parseFloat(
      node.data.find((d: any) => d.$.key === keyMap["d5"].id)?.["y:RectD"]?.[0]
        ?.$.Y
    ),
    width: parseFloat(
      node.data.find((d: any) => d.$.key === keyMap["d5"].id)?.["y:RectD"]?.[0]
        ?.$.Width
    ),
    height: parseFloat(
      node.data.find((d: any) => d.$.key === keyMap["d5"].id)?.["y:RectD"]?.[0]
        ?.$.Height
    ),
    style: {
      asset: node.data.find((d: any) => d.$.key === keyMap["d7"].id)?.[
        "demostyle:AssetNodeStyle"
      ]?.[0]?.$.assetName,
      clipMode: node.data.find((d: any) => d.$.key === keyMap["d7"].id)?.[
        "demostyle:AssetNodeStyle"
      ]?.[0]?.$.clipMode,
    },
    expanded: node.data.find((d: any) => d.$.key === keyMap["d1"].id)?.[0]?._,
    url: node.data.find((d: any) => d.$.key === keyMap["d2"].id)?.[0]?._,
    description: node.data.find((d: any) => d.$.key === keyMap["d3"].id)?.[0]
      ?._,
    zOrder: parseInt(
      node.data.find((d: any) => d.$.key === keyMap["d0"].id)?._
    ),
    userTags: node.data.find((d: any) => d.$.key === keyMap["d6"].id)?.[0]?.[
      "y:Json"
    ]?.[0],
    viewState: node.data.find((d: any) => d.$.key === keyMap["d8"].id)?.[0]?._,
    ports: (node.port || []).map((port: any) => ({
      name: port.$.name,
      locationParameter: port.data?.find(
        (d: any) => d.$.key === keyMap["d16"].id
      )?.[0]?.["x:Static"]?.[0]?.["$"]?.Member,
      style: port.data?.find((d: any) => d.$.key === keyMap["d17"].id)?.[0]?.[
        "x:Static"
      ]?.[0]?.["$"]?.Member,
      viewState: port.data?.find(
        (d: any) => d.$.key === keyMap["d18"].id
      )?.[0]?.["y:PortViewState"]?.[0],
      labels: port.data?.find((d: any) => d.$.key === keyMap["d15"].id)?.[0]?.[
        "y:PortLabels"
      ]?.[0]?.["y:PortLabel"],
    })),
  }));

  console.log(
    result.graphml.graph[0].edge[0].data[0]?.["yjs:PolylineEdgeStyle"]?.[0]?.[
      "yjs:PolylineEdgeStyle.stroke"
    ][0]?.["yjs:Stroke"]?.[0]?.["$"]?.fill
  );

  const edges: NetworkGraphMLEdge[] = flattenElements(
    result.graphml.graph,
    "edge"
  ).map((edge: any) => {
    const styleData = edge?.data?.find(
      (d: any) => d?.$.key === keyMap["d13"].id
    );

    return {
      id: edge?.$.id,
      source: edge?.$.source,
      target: edge?.$.target,
      sourcePort: edge?.$.sourceport,
      targetPort: edge?.$.targetport,
      style: {
        stroke:
          styleData?.["yjs:PolylineEdgeStyle"]?.[0]?.[
            "yjs:PolylineEdgeStyle.stroke"
          ][0]?.["yjs:Stroke"]?.[0]?.["$"]?.fill,
        targetArrow:
          styleData?.["yjs:PolylineEdgeStyle"]?.[0]?.[
            "yjs:PolylineEdgeStyle.targetArrow"
          ]?.[0]?.["yjs:Arrow"]?.[0]?.["$"]?.fill,
        sourceArrow:
          styleData?.["yjs:PolylineEdgeStyle"]?.[0]?.[
            "yjs:PolylineEdgeStyle.sourceArrow"
          ]?.[0]?.["yjs:Arrow"]?.[0]?.["$"]?.type,
      },
      url: edge?.data.find((d: any) => d?.$.key === keyMap["d9"].id)?.[0]?._,
      description: edge?.data.find(
        (d: any) => d?.$.key === keyMap["d10"].id
      )?.[0]?._,
      labels: edge?.data
        .find((d: any) => d?.$.key === keyMap["d11"].id)?.[0]
        ?.["y:EdgeLabels"]?.[0]?.["y:EdgeLabel"]?.map((label: any) => ({
          text: label["y:EdgeLabel.Text"]?.[0],
          distance: parseFloat(label["y:EdgeLabel.Distance"]?.[0]),
          layoutParameter: label["y:EdgeLabel.LayoutParameter"]?.[0]?._,
          style: label["y:EdgeLabel.Style"]?.[0]?._,
        })),
      bends: edge?.data
        ?.find((d: any) => d?.$.key === keyMap["d12"].id)?.[0]
        ?.["x:List"]?.[0]?.["y:Bend"]?.map((bend: any) => {
          const [x, y] = bend?.$.Location?.split(",");
          return { x: parseFloat(x), y: parseFloat(y) };
        }),
      viewState: edge?.data.find((d: any) => d?.$.key === keyMap["d14"].id)?.[0]
        ?._,
      userTags: edge?.data.find(
        (d: any) => d?.$.key === keyMap["d6"].id
      )?.[0]?.["y:Json"]?.[0],
      zOrder: edge?.data.find((d: any) => d?.$.key === keyMap["d0"].id)?._,
      expanded:
        edge?.data.find((d: any) => d?.$.key === keyMap["d1"].id)?.[0]
          ?.default === "true",
      nodeUrl: edge?.data.find((d: any) => d?.$.key === keyMap["d2"].id)?.[0]
        ?._,
      nodeDescription: edge?.data.find(
        (d: any) => d?.$.key === keyMap["d3"].id
      )?.[0]?._,
      nodeLabels: edge?.data.find(
        (d: any) => d?.$.key === keyMap["d4"].id
      )?.[0]?.["y:NodeLabels"]?.[0]?.["y:NodeLabel"],
      nodeGeometry: edge?.data.find(
        (d: any) => d?.$.key === keyMap["d5"].id
      )?.[0]?.["y:NodeGeometry"],
      nodeStyle: edge?.data.find(
        (d: any) => d?.$.key === keyMap["d7"].id
      )?.[0]?.["y:NodeStyle"],
      nodeViewState: edge?.data.find(
        (d: any) => d?.$.key === keyMap["d8"].id
      )?.[0]?.["y:NodeViewState"],
    };
  });

  return { keys, nodes, edges };
}
