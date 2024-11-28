export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  
  // Check if it's today
  if (date.toDateString() === today.toDateString()) {
    return `Today at ${date.toLocaleTimeString()}`;
  }
  
  // Check if it's yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${date.toLocaleTimeString()}`;
  }
  
  // Otherwise show full date and time
  return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
}