import { Box } from "@/components/ui/box";

interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "coming-soon" | "featured" | "new";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Tag({ 
  children, 
  variant = "default", 
  size = "sm", 
  className = "" 
}: TagProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full transition-colors";
  
  const variantClasses = {
    default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    "coming-soon": "bg-orange-50 text-orange-800 border border-orange-200",
    featured: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    new: "bg-green-100 text-green-800 hover:bg-green-200"
  };
  
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base"
  };
  
  return (
    <Box
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </Box>
  );
}
