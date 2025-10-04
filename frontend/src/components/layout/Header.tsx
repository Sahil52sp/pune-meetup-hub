import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Settings, LogOut, MessageSquare, Users, Search } from "lucide-react";
import { Box } from "@/components/ui/box";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/Logo.svg";

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <Box
      as="header"
      className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b border-gray-100"
    >
      <Box className="flex items-center justify-between px-4 sm:px-8 md:px-16 lg:px-24 py-3 sm:py-4">
        {/* Logo - Centered on mobile */}
        <Link
          to="/"
          className="flex items-center flex-1 md:flex-none justify-center md:justify-start"
        >
          <img
            src={logo}
            alt="Pune Meetup"
            className="w-36 sm:w-40 md:w-44 lg:w-[180px]"
          />
        </Link>

        {/* Desktop Navigation */}
        <Box
          as="nav"
          className="hidden md:flex items-center space-x-4 lg:space-x-8"
        >
          <Link
            to="/"
            className={`text-sm poppins-reg ${
              isActive("/") ? "nav-link-active" : "nav-link-inactive"
            }`}
          >
            Home
          </Link>
          <Box className="flex items-center gap-2">
            <Link
              to="/categories"
              className={`text-sm poppins-reg ${
                isActive("/categories")
                  ? "nav-link-active"
                  : "nav-link-inactive"
              }`}
            >
              Categories
            </Link>
            <Tag variant="coming-soon" size="sm">
              👷🏽‍♂️WIP
            </Tag>
          </Box>
          <Box className="flex items-center gap-2">
            <Link
              to="/make-a-friend"
              className={`text-sm poppins-reg whitespace-nowrap ${
                isActive("/make-a-friend")
                  ? "nav-link-active"
                  : "nav-link-inactive"
              }`}
            >
              Find a Connect
            </Link>
            <Tag variant="coming-soon" size="sm">
              👷🏽‍♂️WIP
            </Tag>
          </Box>
        </Box>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 transition-colors z-50"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5 text-foreground" />
          ) : (
            <Menu className="h-5 w-5 text-foreground" />
          )}
        </button>

        {/* Empty box for desktop centering */}
        <Box className="hidden lg:block" style={{ width: "180px" }}></Box>
      </Box>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <Box
          className="md:hidden md:backdrop-blur-lg fixed inset-0 top-[57px] bg-background/98 backdrop-blur-lg z-40"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Box
            className="flex flex-col items-center bg-white pt-8 pb-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              to="/"
              onClick={handleLinkClick}
              className={`text-lg poppins-reg ${
                isActive("/") ? "nav-link-active" : "nav-link-inactive"
              }`}
            >
              Home
            </Link>
            <Box className="flex flex-col items-center">
              <Link
                to="/categories"
                onClick={handleLinkClick}
                className={`text-lg poppins-reg ${
                  isActive("/categories")
                    ? "nav-link-active"
                    : "nav-link-inactive"
                }`}
              >
                Categories
              </Link>
              <Tag variant="coming-soon" size="sm">
                👷🏽‍♂️WIP
              </Tag>
            </Box>
            <Box className="flex flex-col items-center">
              <Link
                to="/make-a-friend"
                onClick={handleLinkClick}
                className={`text-lg poppins-reg ${
                  isActive("/make-a-friend")
                    ? "nav-link-active"
                    : "nav-link-inactive"
                }`}
              >
                Find a Connect
              </Link>
              <Tag variant="coming-soon" size="sm">
                👷🏽‍♂️WIP
              </Tag>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
