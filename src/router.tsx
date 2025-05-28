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
import { OpportunityDetailPage } from "./pages/opportunity-detail-page";
import { AboutUsPage } from "./pages/about-us";
import { TutorialPage } from "./pages/tutorial-page";
import { StarMapBackgroundPage } from "./pages/star-map-background";
import { YourStarmapLoadingPage } from "./pages/your-starmap-loading";
import { AllChatsPage } from "./pages/chat-test";
import { Chat } from "./pages/chat";
import { FAQPage } from "./pages/faq";
import { MainLayout } from "@/components/layout";
import { CuteScrapingPage } from "./pages/scraping";
import { CombinedStarMapPage } from "./pages/mergedstarmap";

// Feature routes (removed unnecessary routes)
const featureRoutes = [
  { path: "/chats", name: "Chats", component: AllChatsPage },
  { path: "/komodo-text", name: "Chat with Komodo", component: KomodoTextPage },
  { path: "/opportunities", name: "Opportunities", component: OpportunitiesPage },
  { path: "/audio-recording", name: "Audio Recording", component: AudioRecordingPage },
  { path: "/claude-test", name: "Claude Test", component: ClaudeTest },
  { path: "/welcome", name: "Welcome Page", component: LandingPage },
  { path: "/mariem-landing", name: "Mariem's Landing", component: MariemLandingPage },
  { path: "/about-us", name: "About Us", component: AboutUsPage },
  { path: "/tutorial", name: "Tutorial", component: TutorialPage },
  { path: "/star-map-background", name: "Star Map Background", component: StarMapBackgroundPage },
  { path: "/your-starmap-loading", name: "Starmap Loading", component: YourStarmapLoadingPage },
  { path: "/faq", name: "FAQ", component: FAQPage },
  { path: "/old-home", name: "Old Home", component: () => <HomePage featureRoutes={featureRoutes} /> },
  // { path: "/star", name: "StarMap", component: StarMapPage },
  { path: "/scraping", name: "Scraper", component: CuteScrapingPage },
  { path: "/finalstar", name: "Final Star Map", component: CombinedStarMapPage },
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
        <MainLayout>
          <HomePage featureRoutes={featureRoutes} />
        </MainLayout>
        <MariemLandingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/test",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <TestPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat/:chatId",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Chat />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/opportunities/:opportunityId",
    element: (
      <ProtectedRoute>
        <OpportunityDetailPage />
      </ProtectedRoute>
    ),
  },
  {
  path: "/mergedscrape",
    element: (
      <MainLayout>
        <CombinedStarMapPage />
      </MainLayout>
    ),
  },
  ...featureRoutes.map((route) => ({
    path: route.path,
    element: (
      <ProtectedRoute>
        <MainLayout>
          <route.component />
        </MainLayout>
      </ProtectedRoute>
    ),
  })),
]);

export function Router() {
  return <RouterProvider router={router} />;
}
