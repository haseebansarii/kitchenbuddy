/**
 * Constants for Kitchen Buddy app
 * Centralizes configuration values and options for better maintainability
 */

// Category options for ingredients
export const CATEGORY_OPTIONS = [
  "Fruit", 
  "Vegetable", 
  "Dairy", 
  "Fish", 
  "Meat", 
  "Liquid", 
  "Bakery", 
  "Spices", 
  "Grains", 
  "Other"
];

// Location options for ingredients
export const LOCATION_OPTIONS = [
  "Fridge", 
  "Freezer", 
  "Pantry", 
  "Cabinet", 
  "Counter"
];

// Confection type options for ingredients
export const CONFECTION_OPTIONS = [
  "Fresh", 
  "Canned", 
  "Frozen", 
  "Cured", 
  "Dried", 
  "Pickled", 
  "Other"
];

// Ripeness options for ingredients
export const RIPENESS_OPTIONS = [
  "Green", 
  "Ripe/Mature", 
  "Advanced", 
  "Too Ripe"
];

// Default days threshold for expiring soon
export const DEFAULT_EXPIRING_DAYS_THRESHOLD = 7;

// Default days threshold for ripeness check
export const DEFAULT_RIPENESS_CHECK_DAYS = 3;

// Theme colors
export const COLORS = {
  primary: '#F2C94C',
  secondary: '#4CAF50',
  background: '#FFFFFF',
  cardBackground: '#F8F9FA',
  text: {
    dark: '#333333',
    medium: '#555555',
    light: '#666666',
  },
  border: '#CCCCCC',
  danger: '#FF5252',
};

// Storage keys
export const STORAGE_KEYS = {
  ingredients: 'ingredients_data',
};

// API endpoints
export const API = {
  openFoodFacts: 'https://world.openfoodfacts.org/api/v0/product',
};
