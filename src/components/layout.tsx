import React from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: LayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {children}
    </div>
  );
}

export function MainContent({ children, className }: LayoutProps) {
  return (
    <main className={cn("container mx-auto py-8 px-4", className)}>
      {children}
    </main>
  );
}

export function TwoColumnLayout({ children, className }: LayoutProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      {children}
    </div>
  );
}

export function Card({ children, className }: LayoutProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-6 shadow-sm", className)}>
      {children}
    </div>
  );
}

export function Section({ children, className }: LayoutProps) {
  return <section className={cn("py-8", className)}>{children}</section>;
}

export function SpaceBackground({ children, className }: LayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]",
        "from-accent/20 via-background to-background",
        className
      )}
    >
      {/* Stars effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/stars.svg')] bg-repeat opacity-30"></div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
