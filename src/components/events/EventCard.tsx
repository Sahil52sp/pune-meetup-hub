import { Calendar, MapPin, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Event, EventCategory } from "@/types/event";

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

const categoryVariantMap: Record<
  EventCategory,
  "tech" | "business" | "arts" | "sports" | "networking" | "workshop"
> = {
  Tech: "tech",
  Business: "business",
  Arts: "arts",
  Sports: "sports",
  Networking: "networking",
  Workshop: "workshop",
};

export function EventCard({ event, onClick }: EventCardProps) {
  const formatDate = (date: string) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Card
      className=" card mb-8 group overflow-visible transition-all duration-300 backdrop-blur-lg bg-white/60 cursor-pointer hover:bg-white/70 hover:scale-[1.01] relative"
      onClick={onClick}
    >
      {/* Date-Time Tag - Inside card but extending outside */}
      <Box
        className="datetime absolute flex font-ndot flex-row items-center justify-center transition-all duration-300 ease-out"
        style={{
          bottom: "-18px",
          left: "26px",
          zIndex: "100",
          fontSize: "13px",
          borderRadius: "10px",
          padding: "6px 10px",
          background:
            "linear-gradient(70deg,rgba(255, 255, 255, 0.54) 0%,rgba(255, 221, 198, 0.34) 33%,rgba(255, 221, 198, 0.54) 61%,rgba(255, 255, 255, 0.66) 91%)",
          backdropFilter: "blur(10px)",
          gap: "4px",
          boxShadow: " 4px 4px 10px 0px rgba(0, 0, 0, 0.10)",
          border: "2px solid rgb(255, 255, 255)",
        }}
      >
        <Box className=" font-medium text-foreground">
          {formatDate(event.date)}
        </Box>
        <Box
          className="mx-2"
          style={{
            width: "1px",
            height: "14px",
            opacity: "0.5",
            backgroundColor: "#6d6d6d", // Tailwind gray-200
            borderRadius: "1px",
          }}
        />
        <Box className="text-xs text-muted-foreground">
          {formatTime(event.time)}
        </Box>
      </Box>

      {/* Event Image */}
      <CardHeader className="p-0">
        <Box className="relative overflow-hidden rounded-lg">
          <Box className="aspect-video relative overflow-hidden">
            <Box
              className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center"
              style={{
                backgroundImage: `url(${event.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></Box>
            <Box className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </Box>
          {/* {event.isFeatured && (
            <Box className="absolute top-3 left-3">
              <Badge variant="default" className="bg-accent text-accent-foreground">
                Featured
              </Badge>
            </Box>
          )} */}
          {/* <Box className="absolute top-3 right-3">
            <Badge variant={categoryVariantMap[event.category]}>
              {event.category}
            </Badge>
          </Box> */}
        </Box>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3">
          {event.shortDescription}
        </p>
      </CardContent>

      <CardFooter className="p-6 pt-0 pb-2 flex justify-end items-center">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full plus-icon ease-out transition-all duration-300"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
