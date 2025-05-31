/**
 * Custom hook for managing ingredients
 * Provides a consistent way to handle ingredient state and operations across the app
 */
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Ingredient } from '../utils/ingredientUtils';
import { loadIngredients, saveIngredients, clearAllIngredients } from '../utils/storageUtils';

/**
 * Hook for managing ingredients state and operations
 * @returns Object containing ingredients state and methods to manipulate it
 */
export const useIngredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load ingredients from storage on initial render
  useEffect(() => {
    const fetchIngredients = async () => {
      setIsLoading(true);
      const storedIngredients = await loadIngredients();
      setIngredients(storedIngredients);
      setIsLoading(false);
    };

    fetchIngredients();
  }, []);

  // Save ingredients to storage whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveIngredients(ingredients);
    }
  }, [ingredients, isLoading]);

  /**
   * Adds a new ingredient or updates an existing one
   * @param ingredient Ingredient to add or update
   */
  const saveIngredient = (ingredient: Ingredient) => {
    if (!ingredient.name) {
      Alert.alert('Error', 'Ingredient name is required!');
      return;
    }

    if (editingIngredient) {
      // Update existing ingredient
      setIngredients((prev) =>
        prev.map((item) => (item.id === ingredient.id ? ingredient : item))
      );
    } else {
      // Add new ingredient
      setIngredients((prev) => [...prev, ingredient]);
    }

    // Clear editing state
    setEditingIngredient(null);
  };

  /**
   * Deletes an ingredient by ID
   * @param id ID of the ingredient to delete
   */
  const deleteIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * Sets an ingredient for editing
   * @param ingredient Ingredient to edit
   */
  const startEditing = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
  };

  /**
   * Cancels the current editing operation
   */
  const cancelEditing = () => {
    setEditingIngredient(null);
  };

  /**
   * Resets all ingredients after confirmation
   */
  const resetIngredients = () => {
    Alert.alert(
      "Reset Ingredients",
      "Are you sure you want to delete all saved ingredients?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            const success = await clearAllIngredients();
            if (success) {
              setIngredients([]);
              Alert.alert("Success", "All ingredients have been deleted.");
            } else {
              Alert.alert("Error", "Failed to reset ingredients.");
            }
          },
        },
      ]
    );
  };

  return {
    ingredients,
    editingIngredient,
    isLoading,
    saveIngredient,
    deleteIngredient,
    startEditing,
    cancelEditing,
    resetIngredients,
  };
};
