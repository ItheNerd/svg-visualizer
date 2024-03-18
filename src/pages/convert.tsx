import GraphViewer from "@/components/convertor/graphViewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/layouts/mainLayout";
import { convertFromNetworkGraph } from "@/lib/convertor";
import { ConvertFromGraphMLResult } from "@/schemas/schema";
import React, { useState } from "react";

const GraphMLConverter: React.FC = () => {
  const [graphMLFile, setGraphMLFile] = useState<File | null>(null);
  const [json, setJson] = useState<ConvertFromGraphMLResult>({
    nodes: [],
    edges: [],
    keys: [],
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGraphMLFile(file);
    }
  };

  const handleConvert = async () => {
    if (!graphMLFile) return;

    const content = await readFileAsText(graphMLFile);
    let convertedJson: ConvertFromGraphMLResult;

    try {
      convertedJson = convertFromNetworkGraph(content);
      setJson(convertedJson);
      console.log("yo");
    } catch (error) {
      console.error(error);
      alert(
        "Failed to convert the graph. Please check the file format and try again."
      );
    }
  };

  const readFileAsText = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const downloadJsonFile = () => {
    if (!json) return;

    const jsonData = JSON.stringify(json, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.json";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <MainLayout className=" ">
      <div className="bg-secondary p-4 rounded w-full">
        <Tabs defaultValue="Parser">
          <TabsList>
            <TabsTrigger value="Parser">Parser</TabsTrigger>
            <TabsTrigger value="Visualizer">Visualizer</TabsTrigger>
          </TabsList>
          <TabsContent
            value="Parser"
            className="flex gap-4 flex-col justify-center items-center">
            <Input type="file" onChange={handleFileChange} />
            <div className="space-y-4 space-x-4">
              <Button onClick={handleConvert}>Convert</Button>
              <Button onClick={downloadJsonFile} disabled={!json}>
                Download JSON
              </Button>
            </div>
            <pre className="font-sans mt-4">
              {JSON.stringify(json, null, 2)}
            </pre>
          </TabsContent>
          <TabsContent value="Visualizer" className="relative min-h-full rounded">
            <GraphViewer nodes={json?.nodes} edges={json?.edges} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default GraphMLConverter;
