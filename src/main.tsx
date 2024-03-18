import { useRoutesWith404 as useRoutes } from "@/lib/hooks/useRoutes";
import "@/styles/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import routes from "~react-pages";
import { ThemeProvider } from "./context/ThemeContext";

const queryClient = new QueryClient();

const App: React.FC = () => {
  const element = useRoutes(routes);
  return <>{element}</>;
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </Router>
  </React.StrictMode>
);
