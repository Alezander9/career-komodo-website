import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  withText?: boolean;
}

export function Logo({ className, size = "md", withText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        {/* Komodo icon - simplified representation */}
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-slow"></div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("relative z-10", sizeClasses[size])}
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
            fill="currentColor"
            className="text-primary"
          />
          <path
            d="M15 8.5C15 9.88 13.88 11 12.5 11C11.12 11 10 9.88 10 8.5C10 7.12 11.12 6 12.5 6C13.88 6 15 7.12 15 8.5Z"
            fill="currentColor"
            className="text-primary"
          />
          <path
            d="M8.5 15C8.5 13.62 9.62 12.5 11 12.5C12.38 12.5 13.5 13.62 13.5 15C13.5 16.38 12.38 17.5 11 17.5C9.62 17.5 8.5 16.38 8.5 15Z"
            fill="currentColor"
            className="text-primary"
          />
          <path
            d="M15 15.5C15 14.12 16.12 13 17.5 13C18.88 13 20 14.12 20 15.5C20 16.88 18.88 18 17.5 18C16.12 18 15 16.88 15 15.5Z"
            fill="currentColor"
            className="text-primary"
          />
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-tight tracking-tight text-foreground">
            Career
          </span>
          <span className="text-lg font-bold leading-tight tracking-tight text-primary">
            Komodo
          </span>
        </div>
      )}
    </div>
  );
}
