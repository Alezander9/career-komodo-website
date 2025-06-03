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
import { StarMapBackgroundPage } from "./pages/star-map-background";
import { YourStarmapLoadingPage } from "./pages/your-starmap-loading";
import { AllChatsPage } from "./pages/chat-test";
import { Chat } from "./pages/chat";

// Feature routes (removed unnecessary routes)
const featureRoutes = [
  { path: "/chats", name: "Chats", component: AllChatsPage },
  { path: "/komodo-text", name: "Chat with Komodo", component: KomodoTextPage },
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
        <MariemLandingPage />
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
  {
    path: "/chat/:chatId",
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
  },
  ...featureRoutes.map((route) => ({
    path: route.path,
    element: route.path === "/tutorial" ? (
      <PublicRoute>
        <route.component />
      </PublicRoute>
    ) : (
      <ProtectedRoute>
        <route.component />
      </ProtectedRoute>
    ),
  })),
]);

export function Router() {
  return <RouterProvider router={router} />;
}
