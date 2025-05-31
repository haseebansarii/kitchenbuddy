/**
 * Date utility functions for Kitchen Buddy app
 * These functions handle all date-related operations consistently across the app
 */

/**
 * Formats a date string to DD-MM-YYYY format for display
 * @param dateString ISO date string (YYYY-MM-DD)
 * @returns Formatted date string (DD-MM-YYYY)
 */
export const formatDateDisplay = (dateString: string): string => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

/**
 * Calculates days until expiration from current date
 * @param expirationDate ISO date string (YYYY-MM-DD)
 * @returns Number of days until expiration (negative if expired)
 */
export const getDaysUntilExpiration = (expirationDate: string): number => {
  if (!expirationDate) return Infinity;
  
  const today = new Date();
  const expDate = new Date(expirationDate);
  
  // Reset time portion to ensure accurate day calculation
  today.setHours(0, 0, 0, 0);
  expDate.setHours(0, 0, 0, 0);
  
  const diffTime = expDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Checks if an item is expiring within a specified number of days
 * @param expirationDate ISO date string (YYYY-MM-DD)
 * @param daysThreshold Number of days to consider as "expiring soon"
 * @returns Boolean indicating if the item is expiring soon
 */
export const isExpiringSoon = (expirationDate: string, daysThreshold: number): boolean => {
  if (!expirationDate) return false;
  
  const daysUntil = getDaysUntilExpiration(expirationDate);
  return daysUntil >= 0 && daysUntil <= daysThreshold;
};

/**
 * Adjusts expiration date based on frozen status
 * @param expirationDate ISO date string (YYYY-MM-DD)
 * @param isFrozen Boolean indicating if the item is frozen
 * @returns New expiration date as ISO string
 */
export const adjustExpirationForFrozen = (expirationDate: string, isFrozen: boolean): string => {
  if (!expirationDate) return '';
  
  const expDate = new Date(expirationDate);
  
  if (isFrozen) {
    expDate.setMonth(expDate.getMonth() + 6); // Add 6 months
  }
  
  return expDate.toISOString().split('T')[0];
};

/**
 * Adjusts expiration date based on opened status
 * @param expirationDate ISO date string (YYYY-MM-DD)
 * @param isOpened Boolean indicating if the item is opened
 * @returns New expiration date as ISO string
 */
export const adjustExpirationForOpened = (expirationDate: string, isOpened: boolean): string => {
  if (!expirationDate) return '';
  
  const expDate = new Date(expirationDate);
  
  if (isOpened) {
    expDate.setDate(expDate.getDate() - 7); // Reduce by 7 days
  }
  
  return expDate.toISOString().split('T')[0];
};

/**
 * Checks if ripeness needs to be updated based on last update
 * @param lastRipenessUpdate ISO date string
 * @param daysThreshold Number of days after which ripeness should be checked
 * @returns Boolean indicating if ripeness needs to be checked
 */
export const needsRipenessCheck = (lastRipenessUpdate: string, daysThreshold = 3): boolean => {
  if (!lastRipenessUpdate) return false;
  
  const lastUpdate = new Date(lastRipenessUpdate);
  const today = new Date();
  
  // Reset time portion to ensure accurate day calculation
  today.setHours(0, 0, 0, 0);
  lastUpdate.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - lastUpdate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > daysThreshold;
};
