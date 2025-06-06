import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  withText?: boolean;
}

export function Logo({ className, size = "md", withText = true }: LogoProps) {
  const navigate = useNavigate();
  
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-14 w-14",
  };

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div 
      className={cn("flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity", className)}
      onClick={handleClick}
    >
      <div className={cn("relative", sizeClasses[size])}>
        <img 
          src="/komodo_open.PNG" 
          alt="Career Komodo Logo"
          className={cn("w-full h-full object-contain", sizeClasses[size])}
        />
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
