/**
 * Date utility functions for consistent date formatting across the application
 */

/**
 * Format a date string or Date object to a consistent format: "D MMM YYYY"
 * Uses a fixed locale to ensure consistency between server and client rendering
 * 
 * @param dateInput Date string or Date object to format
 * @returns Formatted date string like "15 Jun 2024"
 */
export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '';
  
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  // Create date parts using standard JavaScript methods instead of locale-dependent formatting
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}

/**
 * Format a date with time: "D MMM YYYY, HH:MM"
 * 
 * @param dateInput Date string or Date object to format
 * @returns Formatted date and time string
 */
export function formatDateTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '';
  
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  
  // Format hours and minutes with leading zeros
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

/**
 * Format a date as relative time (e.g., "2 days ago")
 * For recent times, or a standard date for older items
 * 
 * @param dateInput Date string or Date object
 * @returns Relative time string or formatted date for older items
 */
export function formatRelativeTime(dateInput: string | Date): string {
  if (!dateInput) return '';
  
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return formatDate(date);
  }
} 