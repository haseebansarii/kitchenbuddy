/**
 * Ingredient utility functions for Kitchen Buddy app
 * These functions handle ingredient data operations consistently across the app
 */
import { adjustExpirationForFrozen, adjustExpirationForOpened, isExpiringSoon, needsRipenessCheck } from './dateUtils';

// Define the Ingredient type for better type safety
export interface Ingredient {
  id: string;
  name: string;
  brand?: string;
  ripeness?: string;
  category?: string;
  location?: string;
  confection?: string;
  expiration?: string;
  lastRipenessUpdate?: string;
  isFrozen: boolean;
  isOpened: boolean;
}

/**
 * Creates a new ingredient with default values
 * @returns Empty ingredient object with default values
 */
export const createEmptyIngredient = (): Ingredient => ({
  id: Date.now().toString(),
  name: '',
  brand: '',
  ripeness: '',
  category: '',
  location: '',
  confection: '',
  expiration: '',
  lastRipenessUpdate: null,
  isFrozen: false,
  isOpened: false,
});

/**
 * Filters ingredients that are expiring soon
 * @param ingredients Array of ingredients
 * @param daysThreshold Number of days to consider as "expiring soon"
 * @returns Filtered array of ingredients
 */
export const getExpiringSoonIngredients = (ingredients: Ingredient[], daysThreshold: number): Ingredient[] => {
  return ingredients.filter((item) => {
    // An item is considered expiring soon if:
    // 1. It's ripe or opened (these need attention)
    const isRelevant = item.ripeness === 'Ripe/Mature' || item.isOpened;
    
    // 2. It's not frozen OR it's frozen but still expiring soon
    const isNotFrozen = !item.isFrozen || isExpiringSoon(item.expiration, daysThreshold);
    
    // 3. It has an expiration date that's within the threshold
    const isExpiring = item.expiration && isExpiringSoon(item.expiration, daysThreshold);
    
    return isRelevant || (isExpiring && isNotFrozen);
  });
};

/**
 * Filters ingredients with missing data
 * @param ingredients Array of ingredients
 * @returns Filtered array of ingredients
 */
export const getIngredientsWithMissingData = (ingredients: Ingredient[]): Ingredient[] => {
  return ingredients.filter(
    (item) => !item.category || !item.location || !item.confection || !item.expiration
  );
};

/**
 * Filters ingredients by most recent (based on ID which is a timestamp)
 * @param ingredients Array of ingredients
 * @returns Sorted array of ingredients
 */
export const getMostRecentIngredients = (ingredients: Ingredient[]): Ingredient[] => {
  return [...ingredients].sort((a, b) => parseInt(b.id) - parseInt(a.id));
};

/**
 * Filters ingredients that need ripeness check
 * @param ingredients Array of ingredients
 * @param daysThreshold Number of days after which ripeness should be checked
 * @returns Filtered array of ingredients
 */
export const getIngredientsNeedingRipenessCheck = (ingredients: Ingredient[], daysThreshold = 3): Ingredient[] => {
  return ingredients.filter((item) => needsRipenessCheck(item.lastRipenessUpdate, daysThreshold));
};

/**
 * Updates an ingredient in the ingredients array
 * @param ingredients Current ingredients array
 * @param updatedIngredient The ingredient with updated values
 * @returns New array with the updated ingredient
 */
export const updateIngredient = (ingredients: Ingredient[], updatedIngredient: Ingredient): Ingredient[] => {
  return ingredients.map((item) =>
    item.id === updatedIngredient.id ? updatedIngredient : item
  );
};

/**
 * Adds a new ingredient to the ingredients array
 * @param ingredients Current ingredients array
 * @param newIngredient The new ingredient to add
 * @returns New array with the added ingredient
 */
export const addIngredient = (ingredients: Ingredient[], newIngredient: Ingredient): Ingredient[] => {
  return [...ingredients, newIngredient];
};

/**
 * Deletes an ingredient from the ingredients array
 * @param ingredients Current ingredients array
 * @param id ID of the ingredient to delete
 * @returns New array without the deleted ingredient
 */
export const deleteIngredient = (ingredients: Ingredient[], id: string): Ingredient[] => {
  return ingredients.filter((item) => item.id !== id);
};
