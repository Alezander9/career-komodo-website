import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  RouteObject,
} from "react-router-dom";
import { useConvexAuth } from "convex/react";
import { ComponentType } from "react";

// Page imports
import { MainLayout } from "@/components/layout";
import { HomePage } from "./pages/home-page";
import { LoadingScreen } from "./components/loading-screen";
import { MariemLandingPage } from "./pages/mariem-landing";
import { OpportunitiesPage } from "./pages/opportunities-page";
import { OpportunityDetailPage } from "./pages/opportunity-detail-page";
// import { TutorialPage } from "./pages/tutorial-page";
import { AllChatsPage } from "./pages/chat-test";
import { Chat } from "./pages/chat";
import { AboutUsPage } from "./pages/about-us";
import { FAQPage } from "./pages/faq";
// import { CuteScrapingPage } from "./pages/scraping";
import { CombinedStarMapPage } from "./pages/mergedstarmap";

// Types
interface FeatureRoute {
  path: string;
  name: string;
  component: ComponentType;
}

// Route Guards
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

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}

// Route factories
function createProtectedRoute(Component: ComponentType, withLayout = true): RouteObject["element"] {
  const element = withLayout ? (
    <MainLayout>
      <Component />
    </MainLayout>
  ) : (
    <Component />
  );

  return <ProtectedRoute>{element}</ProtectedRoute>;
}

function createPublicRoute(Component: ComponentType, withLayout = false): RouteObject["element"] {
  const element = withLayout ? (
    <MainLayout>
      <Component />
    </MainLayout>
  ) : (
    <Component />
  );

  return (
    <PublicRoute>
      {element}
    </PublicRoute>
  );
}

// Wrapper components for components that need props
// (None needed currently)

// Feature routes configuration
const featureRoutes: FeatureRoute[] = [
  { path: "/chats", name: "Chats", component: AllChatsPage },
  { path: "/opportunities", name: "Opportunities", component: OpportunitiesPage },
  { path: "/about-us", name: "About Us", component: AboutUsPage },
  { path: "/faq", name: "FAQ", component: FAQPage },
  { path: "/finalstar", name: "Final Star Map", component: CombinedStarMapPage },
];

// Main router configuration
const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: createPublicRoute(MariemLandingPage),
  },
  {
    path: "/faq",
    element: createPublicRoute(FAQPage, true),
  },

  // Protected main routes
  {
    path: "/home",
    element: createProtectedRoute(HomePage),
  },

  // Public informational routes
  {
    path: "/komodo-text",
    element: createPublicRoute(AllChatsPage),
  },
  {
    path: "/opportunities/:opportunityId",
    element: createPublicRoute(OpportunityDetailPage),
  },

  // Protected dynamic routes
  {
    path: "/chat/:chatId",
    element: createProtectedRoute(Chat),
  },
  {
    path: "/starmap/:chatId",
    element: createProtectedRoute(CombinedStarMapPage),
  },

  // Special routes (mixed protection)
  {
    path: "/mergedscrape",
    element: (
      <MainLayout>
        <CombinedStarMapPage />
      </MainLayout>
    ),
  },

  // Feature routes (generated from configuration)
  ...featureRoutes.map((route): RouteObject => {
    // Make certain routes public
    const isPublicRoute = ["/opportunities", "/faq", "/about-us"].includes(route.path);
    const shouldIncludeLayout = ["/faq", "/about-us", "/opportunities"].includes(route.path);
    return {
      path: route.path,
      element: isPublicRoute 
        ? createPublicRoute(route.component, shouldIncludeLayout) 
        : createProtectedRoute(route.component),
    };
  }),
]);

export function Router() {
  return <RouterProvider router={router} />;
}

// Export feature routes for use in other components
export { featureRoutes };
export type { FeatureRoute };
