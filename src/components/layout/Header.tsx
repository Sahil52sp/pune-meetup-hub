import { Link } from 'react-router-dom';
import { Box } from '@/components/ui/box';

export function Header() {
  return (
    <Box as="header" className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <Box className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <Box className="text-2xl font-bold">
            <Box as="span" className="text-primary">Pune</Box>
            <Box as="span" className="text-foreground"> Meetup</Box>
          </Box>
        </Link>

        <Box as="nav" className="flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link 
            to="/" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Categories
          </Link>
          <Link 
            to="/" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Make a Friend
          </Link>
        </Box>
      </Box>
    </Box>
  );
}