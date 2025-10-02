import { X, Calendar, MapPin, Clock, User } from "lucide-react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";
import { useEffect } from "react";

interface EventDetailPopupProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailPopup({
  event,
  isOpen,
  onClose,
}: EventDetailPopupProps) {
  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      // Store the current scroll position
      const scrollY = window.scrollY;
      // Prevent scrolling
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      // Restore scrolling
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    // Cleanup function
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  if (!isOpen || !event) return null;

  const formatDate = (date: string) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
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
    <Box className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <Box
        className="absolute inset-0 bg-white/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content */}
      <Box className="relative backdrop-blur-lg bg-white/60 border-2 border-primary-glow/50 rounded-lg shadow-lg max-w-6xl w-full mx-2 sm:mx-4 max-h-[92vh] sm:max-h-[90vh] overflow-visible">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute rounded-full bg-white/90 shadow-lg p-1 sm:p-2"
          style={{
            top: "-12px",
            right: "12px",
            zIndex: "100",
            height: "28px",
            width: "28px",
            border: "1px solid rgba(255, 107, 53, 0.52)",
          }}
          onClick={onClose}
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>

        <Box className="flex flex-col md:flex-row max-h-[88vh] sm:max-h-[90vh] overflow-y-auto md:overflow-hidden">
          {/* Left Side - Event Image and Basic Info - Fixed */}
          <Box
            style={{
              background:
                "linear-gradient(40deg,rgba(255, 182, 134, 0.1) 0%,rgba(255, 182, 134, 0.45) 60%,rgb(255, 255, 255) 100%) padding-box,linear-gradient(70deg,rgba(255, 255, 255, 0.54) 0%,rgba(255, 221, 198, 0.34) 33%,rgba(255, 221, 198, 0.54) 61%,rgba(255, 255, 255, 0.66) 91%) border-box",
              borderRadius: "10px 10px 0 10px",
            }}
            className="w-full md:w-2/5 bg-muted p-4 sm:p-6 md:p-8 flex-shrink-0"
          >
            <Box className="aspect-video bg-gradient-hero rounded-lg mb-4 sm:mb-6 flex items-center justify-center overflow-hidden">
              <Box
                className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center"
                style={{
                  backgroundImage: `url(${event.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></Box>
            </Box>

            <Box className="space-y-3 sm:space-y-4">
              <Box className="bg-background rounded-lg p-3 sm:p-4">
                <Box className="flex items-start text-xs sm:text-sm">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 mt-0.5 text-primary flex-shrink-0" />
                  <Box>
                    <Box className="mt-0.5 font-medium text-muted-foreground">
                      Date & Time
                    </Box>
                    <Box className="font-ndot text-xs sm:text-sm">
                      {formatDate(event.date)} | {formatTime(event.time)}
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box className="bg-background rounded-lg p-3 sm:p-4">
                <Box className="flex items-start text-xs sm:text-sm">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 mt-0.5 text-primary flex-shrink-0" />
                  <Box>
                    <Box className="mt-0.5 font-medium text-muted-foreground">
                      Organized by
                    </Box>
                    <Box className="font-ndot text-xs sm:text-sm">{event.organizer.name}</Box>
                  </Box>
                </Box>
              </Box>

              <Box className="bg-background rounded-lg p-3 sm:p-4">
                <Box className="flex items-start text-xs sm:text-sm">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 mt-0.5 text-primary flex-shrink-0" />
                  <Box>
                    <Box className="mt-1 font-medium text-muted-foreground">
                      Location
                    </Box>
                    <Box className="font-ndot text-xs sm:text-sm">{event.venue.name}</Box>
                    <Box className="font-ndot text-xs text-muted-foreground mt-1">
                      {event.venue.address}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right Side - Event Description - Not scrollable on mobile */}
          <Box className="w-full md:w-3/5 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-visible md:overflow-y-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">{event.title}</h2>

            <Box className="prose prose-sm max-w-none">
              <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                {event.shortDescription}
              </p>

              <h3 className="text-base sm:text-lg font-semibold mt-4 sm:mt-6 mb-2 sm:mb-3">
                About this event
              </h3>
              <p className="text-muted-foreground whitespace-pre-line text-sm sm:text-base">
                {event.description}
              </p>

              {event.tags && event.tags.length > 0 && (
                <Box className="mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Tags</h3>
                  <Box className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <Box
                        key={tag}
                        className="px-2 sm:px-3 py-1 bg-muted rounded-full text-xs sm:text-sm"
                      >
                        {tag}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* {event.externalLink && (
                <Box className="mt-6 sm:mt-8">
                  <Button asChild className="w-full md:w-auto text-sm sm:text-base">
                    <a
                      href={event.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Register for Event
                    </a>
                  </Button>
                </Box>
              )} */}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
