import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/404";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Terminal } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes, useRoutes } from "react-router-dom";

export function useRoutesWith404(routes: any) {
  const routeResult = useRoutes(routes);
  const RouteRender = () => {
    if (routeResult) {
      return routeResult;
    } else {
      return (
        <Routes>
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    }
  };

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <p className="animate-spin h-5 w-5 mr-3"></p>
        </div>
      }>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ error, resetErrorBoundary }) => (
              <div className="flex h-screen items-center justify-center">
                <Alert
                  variant="destructive"
                  className="flex max-w-lg items-center justify-between align-middle">
                  <Terminal className="h-4 w-4" />
                  <div>
                    <AlertTitle>There was an error!</AlertTitle>
                    <AlertDescription className="font-mono">
                      {error.message}
                    </AlertDescription>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => resetErrorBoundary()}>
                    Try again
                  </Button>
                </Alert>
              </div>
            )}>
            {RouteRender()}

            <Toaster />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </Suspense>
  );
}
