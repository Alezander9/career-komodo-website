import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useConvexAuth } from "convex/react";
import { LandingPage } from "./pages/landing-page";
import { HomePage } from "./pages/home-page";
// Import individual student pages
import { SabrinaPage } from "./pages/students/sabrina-page";
import { RyanPage } from "./pages/students/ryan-page";
import { MichellePage } from "./pages/students/michelle-page";
import { MariemPage } from "./pages/students/mariem-page";
import { SeymaPage } from "./pages/students/seyma-page";
import { KatPage } from "./pages/students/kat-page";
import { LoadingScreen } from "./components/loading-screen";

// Student routes - one for each student with their component
const studentRoutes = [
  { path: "/sabrina", name: "Sabrina", component: SabrinaPage },
  { path: "/ryan", name: "Ryan", component: RyanPage },
  { path: "/michelle", name: "Michelle", component: MichellePage },
  { path: "/mariem", name: "Mariem", component: MariemPage },
  { path: "/seyma", name: "Seyma", component: SeymaPage },
  { path: "/kat", name: "Kat", component: KatPage },
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
        <HomePage studentRoutes={studentRoutes} />
      </ProtectedRoute>
    ),
  },
  ...studentRoutes.map((route) => ({
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
