import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "@/pages/dashboard";
import Problem from "@/pages/problem";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import AuthCallback from "@/pages/auth-callback";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your learning platform...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/auth/callback" component={AuthCallback} />
      {isAuthenticated ? (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/problem/:id" component={Problem} />
        </>
      ) : (
        <Route path="/" component={Landing} />
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
