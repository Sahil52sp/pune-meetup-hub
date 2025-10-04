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
  const { user, isAuthenticated, login, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    handleLinkClick();
  };

  return (
    <Box
      as="header"
      className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b border-gray-100"
    >
      <Box className="flex items-center justify-between px-4 sm:px-8 md:px-16 lg:px-24 py-3 sm:py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center"
        >
          <img
            src={logo}
            alt="Meetup Network"
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
          
          {isAuthenticated && (
            <>
              <Link
                to="/profile"
                className={`text-sm poppins-reg ${
                  isActive("/profile") ? "nav-link-active" : "nav-link-inactive"
                }`}
              >
                My Profile
              </Link>
              <Link
                to="/browse"
                className={`text-sm poppins-reg ${
                  isActive("/browse") ? "nav-link-active" : "nav-link-inactive"
                }`}
              >
                Browse Connections
              </Link>
              <Link
                to="/connections"
                className={`text-sm poppins-reg ${
                  isActive("/connections") ? "nav-link-active" : "nav-link-inactive"
                }`}
              >
                My Connections
              </Link>
              <Link
                to="/messaging"
                className={`text-sm poppins-reg ${
                  isActive("/messaging") ? "nav-link-active" : "nav-link-inactive"
                }`}
              >
                Messages
              </Link>
            </>
          )}
        </Box>

        {/* Desktop Auth Section */}
        <Box className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.picture} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/connections" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    My Connections
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/messaging" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={login} size="sm">
              Sign In
            </Button>
          )}
        </Box>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors z-50"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5 text-foreground" />
          ) : (
            <Menu className="h-5 w-5 text-foreground" />
          )}
        </button>
      </Box>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <Box
          className="md:hidden fixed inset-0 top-[57px] bg-background/98 backdrop-blur-lg z-40"
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
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={handleLinkClick}
                  className={`text-lg poppins-reg ${
                    isActive("/profile") ? "nav-link-active" : "nav-link-inactive"
                  }`}
                >
                  My Profile
                </Link>
                <Link
                  to="/browse"
                  onClick={handleLinkClick}
                  className={`text-lg poppins-reg ${
                    isActive("/browse") ? "nav-link-active" : "nav-link-inactive"
                  }`}
                >
                  Browse Connections
                </Link>
                <Link
                  to="/connections"
                  onClick={handleLinkClick}
                  className={`text-lg poppins-reg ${
                    isActive("/connections") ? "nav-link-active" : "nav-link-inactive"
                  }`}
                >
                  My Connections
                </Link>
                <Link
                  to="/messaging"
                  onClick={handleLinkClick}
                  className={`text-lg poppins-reg ${
                    isActive("/messaging") ? "nav-link-active" : "nav-link-inactive"
                  }`}
                >
                  Messages
                </Link>
                
                <div className="pt-4 border-t border-gray-200 w-full text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.picture} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium">{user?.name}</p>
                    </div>
                  </div>
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <Button onClick={login} size="sm">
                Sign In
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
