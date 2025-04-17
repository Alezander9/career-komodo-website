import { Logo } from "./logo";
import { SpaceBackground } from "./layout";

export function LoadingScreen() {
  return (
    <SpaceBackground>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-float">
          <Logo size="lg" />
        </div>
        <div className="mt-8 flex space-x-3">
          <div
            className="w-3 h-3 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-3 h-3 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-3 h-3 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </SpaceBackground>
  );
}
