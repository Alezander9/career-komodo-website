import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/clerk-react";

export function Navbar() {
  const navigate = useNavigate();

  const navItems = [
    { label: "Chat", path: "/chats" },
    // { label: "Chat with Komodo", path: "/komodo-text" },
    { label: "Opportunities", path: "/opportunities" },
    // { label: "Star Map", path: "/finalstar" },
    // { label: "Audio Recording", path: "/audio-recording" },
    // { label: "Tutorial", path: "/tutorial" },
    // { label: "About Us", path: "/about-us" },
    { label: "FAQ", path: "/faq" },
  ];

  return (
    <nav className="flex w-full items-center gap-4">
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
      <SignOutButton>
        <Button variant="outline" size="sm" className="text-foreground hover:text-primary">
          Sign Out
        </Button>
      </SignOutButton>
    </nav>
  );
} 