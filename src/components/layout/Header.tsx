import { Link, useLocation } from "react-router-dom";
import { Box } from "@/components/ui/box";
import logo from "@/Logo.svg";

export function Header() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    const active = location.pathname === path;
    console.log(`Path: ${location.pathname}, Checking: ${path}, Active: ${active}`);
    return active;
  };

  return (
    <Box
      as="header"
      className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur "
    >
      <Box className="container flex items-center justify-between px-24 py-4">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Pune Meetup" width={180} />
        </Link>

        <Box as="nav" className="flex items-center space-x-6">
          <Link
            to="/"
            className={`text-sm poppins-reg ${
              isActive("/") ? "nav-link-active" : "nav-link-inactive"
            }`}
          >
            Home
          </Link>
          <Link
            to="/categories"
            className={`text-sm poppins-reg ${
              isActive("/categories") ? "nav-link-active" : "nav-link-inactive"
            }`}
          >
            Categories
          </Link>
          <Link
            to="/make-a-friend"
            className={`text-sm poppins-reg ${
              isActive("/make-a-friend") ? "nav-link-active" : "nav-link-inactive"
            }`}
          >
            Make a Friend
          </Link>
        </Box>

        {/*empty box*/}
        <Box style={{ width: "180px" }}>
        </Box>
      </Box>
    </Box>
  );
}
