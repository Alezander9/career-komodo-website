import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/clerk-react";
import { Logo } from "@/components/logo";

export function Navbar() {
  const navigate = useNavigate();

  const navItems = [
    { label: "Chat", path: "/chats" },
    // { label: "Chat with Komodo", path: "/komodo-text" },
    { label: "Opportunities", path: "/opportunities" },
    // { label: "Star Map", path: "/finalstar" },
    // { label: "Audio Recording", path: "/audio-recording" },
    // { label: "Tutorial", path: "/tutorial" },
    { label: "About Us", path: "/about-us" },
    { label: "FAQ", path: "/faq" },
  ];

  return (
    <nav className="flex w-full items-center justify-between">
      {/* Left side: Logo and navigation items */}
      <div className="flex items-center gap-6">
        <Logo size="lg" />
        <div className="flex items-center gap-4">
          {navItems.map((item, idx) => (
            <Button
              key={item.path}
              variant="outline"
              size="sm"
              onClick={() => navigate(item.path)}
              className="text-foreground hover:text-primary"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Right side: Sign out button */}
      <SignOutButton>
        <Button variant="outline" size="sm" className="text-foreground hover:text-primary">
          Sign Out
        </Button>
      </SignOutButton>
    </nav>
  );
} 