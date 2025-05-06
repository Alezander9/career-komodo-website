import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useConvexAuth } from "convex/react";
import { LandingPage } from "./pages/landing-page";
import { HomePage } from "./pages/home-page";
import { TestPage } from "./pages/test-page";
import { AudioRecordingPage } from "./pages/audio-recording";
import { KomodoTextPage } from "./pages/komodo-text";
import { LoadingScreen } from "./components/loading-screen";
import { ClaudeTest } from "./pages/ClaudeTest";
import { StarMapPage } from "./pages/starmap";
import { MariemLandingPage } from "./pages/mariem-landing";
import { OpportunitiesPage } from "./pages/opportunities-page";
import { AboutUsPage } from "./pages/about-us";
import { TutorialPage } from "./pages/tutorial-page";
// Feature routes
const featureRoutes = [
  { path: "/audio-recording", name: "Audio Recording", component: AudioRecordingPage },
  { path: "/komodo-text", name: "Komodo Text", component: KomodoTextPage },
  { path: "/starmap", name: "Star Map", component: StarMapPage },
  { path: "/claude-test", name: "Claude Test", component: ClaudeTest },
  { path: "/welcome", name: "Welcome Page", component: LandingPage },
  { path: "/mariem-landing", name: "Mariem's Landing", component: MariemLandingPage },
  { path: "/opportunities-page", name: "Opportunities", component: OpportunitiesPage },
  { path: "/about-us", name: "About Us", component: AboutUsPage },
  { path: "/tutorial", name: "Tutorial", component: TutorialPage },
];

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Public route component (only accessible when not authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

// Create router
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <LandingPage />
      </PublicRoute>
    ),
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <HomePage featureRoutes={featureRoutes} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/test",
    element: (
      <ProtectedRoute>
        <TestPage />
      </ProtectedRoute>
    ),
  },
  ...featureRoutes.map((route) => ({
    path: route.path,
    element: (
      <ProtectedRoute>
        <route.component />
      </ProtectedRoute>
    ),
  })),
]);

export function Router() {
  return <RouterProvider router={router} />;
}
