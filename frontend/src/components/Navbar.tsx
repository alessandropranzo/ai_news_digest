import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-chloris-blue bg-clip-text text-transparent select-none cursor-pointer">
              Chloris
            </h1>
          </Link>
        </div>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-2">
          <Button
            asChild
            className={
              `rounded-full h-10 px-6 font-semibold shadow-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-2 ` +
              (location.pathname === "/"
                ? "bg-gradient-to-r from-emerald-600 to-chloris-blue text-white shadow-none hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-105"
                : "bg-transparent text-foreground/80 hover:text-foreground")
            }
          >
            <Link to="/">Feed</Link>
          </Button>
          <Button
            asChild
            className={
              `relative rounded-full h-10 px-6 font-semibold shadow-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-2 ` +
              (location.pathname === "/settings"
                ? "bg-gradient-to-r from-emerald-600 to-chloris-blue text-white shadow-none hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-105"
                : "bg-transparent text-foreground/80 hover:text-foreground")
            }
          >
            <Link to="/settings">Settings</Link>
          </Button>
        </div>
        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center">
          <button
            aria-label="Open menu"
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          {/* Mobile menu dropdown */}
          {menuOpen && (
            <div className="absolute top-16 right-4 bg-background border border-border/30 rounded-lg shadow-lg flex flex-col py-2 w-40 animate-fade-in z-50">
              <Button
                asChild
                className={
                  `w-full justify-start px-4 py-2 rounded-full font-semibold shadow-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-2 ` +
                  (location.pathname === "/"
                    ? "bg-gradient-to-r from-emerald-600 to-chloris-blue text-white shadow-none hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-105"
                    : "bg-transparent text-foreground/80 hover:text-foreground")
                }
                onClick={() => setMenuOpen(false)}
              >
                <Link to="/">Feed</Link>
              </Button>
              <Button
                asChild
                className={
                  `relative w-full justify-start px-4 py-2 rounded-full font-semibold shadow-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-2 mt-1 ` +
                  (location.pathname === "/settings"
                    ? "bg-gradient-to-r from-emerald-600 to-chloris-blue text-white shadow-none hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-105"
                    : "bg-transparent text-foreground/80 hover:text-foreground")
                }
                onClick={() => setMenuOpen(false)}
              >
                <Link to="/settings" className="relative flex items-center">
                  Settings
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
