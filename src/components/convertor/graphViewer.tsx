import { useTheme } from "@/context/ThemeContext";
import { useEffect, useRef, useState } from "react";
import {
  GraphCanvas,
  GraphCanvasRef,
  Theme,
  darkTheme as defaultDarkTheme,
  lightTheme,
} from "reagraph";

export const darkTheme = {
  ...defaultDarkTheme,
  canvas: {
    background: "hsl(222.2, 84%, 4.9%)",
  },
};

const GraphViewer = ({ nodes, edges }: any) => {
  const { theme } = useTheme();
  const [graphThemeState, setGraphThemeState] = useState<Theme>(lightTheme);
  const graphRef = useRef<GraphCanvasRef | null>(null);

  useEffect(() => {
    setGraphThemeState(getGraphThemeFromTheme(theme));
  }, [theme]);

  function getGraphThemeFromTheme(theme: string): Theme {
    if (theme === "light") {
      return lightTheme;
    }
    if (theme === "dark") {
      return darkTheme;
    }
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      return systemTheme === "light" ? lightTheme : darkTheme;
    }
    return lightTheme;
  }

  return (
    <div className="min-h-96 h-full w-full rounded">
      <GraphCanvas
        ref={graphRef}
        animated
        draggable
        theme={graphThemeState}
        nodes={nodes}
        edges={edges}
      />
    </div>
  );
};

export default GraphViewer;
