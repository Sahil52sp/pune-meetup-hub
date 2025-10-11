/**
 * Utility functions for converting UTC timestamps to local time
 */

/**
 * Converts a UTC timestamp string to local Date object
 */
export const utcToLocal = (utcTimestamp: string): Date => {
  // If the timestamp doesn't end with 'Z' or timezone info, assume it's UTC
  if (!utcTimestamp.includes('Z') && !utcTimestamp.includes('+') && !utcTimestamp.includes('-', 10)) {
    // Add 'Z' to indicate UTC timezone
    return new Date(utcTimestamp + 'Z');
  }
  return new Date(utcTimestamp);
};

/**
 * Formats a UTC timestamp for message display (e.g., "2:30 PM", "Mar 15", "3/15/2024")
 */
export const formatMessageTime = (utcTimestamp: string): string => {
  const date = utcToLocal(utcTimestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    // Show time for messages from today
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  } else if (diffInHours < 168) { // 7 days
    // Show month and day for recent messages
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  } else {
    // Show full date for older messages
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  }
};

/**
 * Formats a UTC timestamp for conversation list display
 */
export const formatLastMessageTime = (utcTimestamp?: string): string => {
  if (!utcTimestamp) return '';
  
  const date = utcToLocal(utcTimestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    // Show time for today
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  } else {
    // Show date for older messages
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

/**
 * Formats a UTC timestamp for general date display (connections, profiles, etc.)
 */
export const formatDate = (utcTimestamp: string): string => {
  const date = utcToLocal(utcTimestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formats an event date string to local display format
 */
export const formatEventDate = (dateString: string): string => {
  const eventDate = new Date(dateString);
  return eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Formats an event time string to local display format
 */
export const formatEventTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
};