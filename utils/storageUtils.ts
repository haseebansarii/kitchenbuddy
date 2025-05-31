/**
 * Storage utility functions for Kitchen Buddy app
 * These functions handle all AsyncStorage operations consistently across the app
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ingredient } from './ingredientUtils';

// Storage key for ingredients
export const INGREDIENTS_STORAGE_KEY = 'ingredients_data';

/**
 * Loads ingredients from AsyncStorage
 * @returns Promise resolving to an array of ingredients or empty array if none found
 */
export const loadIngredients = async (): Promise<Ingredient[]> => {
  try {
    const storedIngredients = await AsyncStorage.getItem(INGREDIENTS_STORAGE_KEY);
    if (storedIngredients) {
      return JSON.parse(storedIngredients);
    }
    return [];
  } catch (error) {
    console.error('Failed to load ingredients:', error);
    return [];
  }
};

/**
 * Saves ingredients to AsyncStorage
 * @param ingredients Array of ingredients to save
 * @returns Promise resolving to true if successful, false otherwise
 */
export const saveIngredients = async (ingredients: Ingredient[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(INGREDIENTS_STORAGE_KEY, JSON.stringify(ingredients));
    return true;
  } catch (error) {
    console.error('Failed to save ingredients:', error);
    return false;
  }
};

/**
 * Deletes a single ingredient from storage
 * @param id ID of the ingredient to delete
 * @param currentIngredients Current array of ingredients
 * @returns Promise resolving to the updated ingredients array
 */
export const deleteIngredientFromStorage = async (
  id: string, 
  currentIngredients: Ingredient[]
): Promise<Ingredient[]> => {
  try {
    const filteredIngredients = currentIngredients.filter((item) => item.id !== id);
    await saveIngredients(filteredIngredients);
    return filteredIngredients;
  } catch (error) {
    console.error('Failed to delete ingredient:', error);
    return currentIngredients;
  }
};

/**
 * Clears all ingredients from storage
 * @returns Promise resolving to true if successful, false otherwise
 */
export const clearAllIngredients = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(INGREDIENTS_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear ingredients:', error);
    return false;
  }
};
