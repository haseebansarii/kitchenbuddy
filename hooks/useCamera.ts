/**
 * Custom hook for managing camera functionality
 * Provides a consistent way to handle camera permissions and barcode scanning
 */
import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Ingredient } from '../utils/ingredientUtils';

interface UseCameraResult {
  hasPermission: boolean | null;
  isScanning: boolean;
  scanBarcode: (data: string) => Promise<Ingredient | null>;
  resetScanning: () => void;
}

/**
 * Hook for managing camera permissions and barcode scanning
 * @param onAddIngredient Callback function to add a new ingredient
 * @returns Object containing camera state and methods
 */
export const useCamera = (onAddIngredient: (ingredient: Ingredient) => void): UseCameraResult => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Request camera permissions on mount
  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();

    // Clean up timeout on unmount
    return () => {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Handles barcode scanning and product data fetching
   * @param data Barcode data from scanner
   * @returns Promise resolving to the new ingredient or null if error
   */
  const scanBarcode = async (data: string): Promise<Ingredient | null> => {
    // Prevent multiple scans
    if (isScanning) return null;
    
    setIsScanning(true);
    
    try {
      // Fetch product data from OpenFoodFacts API
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status === 1) {
        const product = result.product;
        
        // Create new ingredient from product data
        const newIngredient: Ingredient = {
          id: Date.now().toString(),
          name: product.product_name || 'Unknown',
          brand: product.brands || 'Unknown',
          category: mapProductCategory(product.categories) || 'Other',
          confection: mapProductPackaging(product.packaging) || 'Other',
          location: 'Pantry', // Default location
          expiration: '', // No expiration date from API
          ripeness: '',
          lastRipenessUpdate: '',
          isFrozen: false,
          isOpened: false,
        };
        
        // Add the new ingredient via callback
        onAddIngredient(newIngredient);
        return newIngredient;
      } else {
        Alert.alert('Error', 'Product not found in OpenFoodFacts database.');
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Failed to fetch data: ${errorMessage}`);
      return null;
    } finally {
      // Reset scanning state after a delay to prevent multiple scans
      scanTimeoutRef.current = setTimeout(() => {
        setIsScanning(false);
      }, 1500);
    }
  };
  
  /**
   * Maps product category from API to app categories
   * @param apiCategory Category string from API
   * @returns Mapped category
   */
  const mapProductCategory = (apiCategory: string): string => {
    if (!apiCategory) return 'Other';
    
    const lowerCategory = apiCategory.toLowerCase();
    
    if (lowerCategory.includes('fruit')) return 'Fruit';
    if (lowerCategory.includes('vegetable')) return 'Vegetable';
    if (lowerCategory.includes('dairy') || lowerCategory.includes('milk') || lowerCategory.includes('cheese')) return 'Dairy';
    if (lowerCategory.includes('fish') || lowerCategory.includes('seafood')) return 'Fish';
    if (lowerCategory.includes('meat')) return 'Meat';
    if (lowerCategory.includes('beverage') || lowerCategory.includes('drink')) return 'Liquid';
    if (lowerCategory.includes('bread') || lowerCategory.includes('bakery')) return 'Bakery';
    if (lowerCategory.includes('spice') || lowerCategory.includes('herb')) return 'Spices';
    if (lowerCategory.includes('grain') || lowerCategory.includes('cereal') || lowerCategory.includes('rice')) return 'Grains';
    
    return 'Other';
  };
  
  /**
   * Maps product packaging from API to app confection types
   * @param apiPackaging Packaging string from API
   * @returns Mapped confection type
   */
  const mapProductPackaging = (apiPackaging: string): string => {
    if (!apiPackaging) return 'Other';
    
    const lowerPackaging = apiPackaging.toLowerCase();
    
    if (lowerPackaging.includes('fresh')) return 'Fresh';
    if (lowerPackaging.includes('can') || lowerPackaging.includes('tin')) return 'Canned';
    if (lowerPackaging.includes('frozen')) return 'Frozen';
    if (lowerPackaging.includes('cured')) return 'Cured';
    if (lowerPackaging.includes('dried')) return 'Dried';
    if (lowerPackaging.includes('pickle')) return 'Pickled';
    
    return 'Other';
  };
  
  /**
   * Resets the scanning state
   */
  const resetScanning = () => {
    setIsScanning(false);
  };
  
  return {
    hasPermission,
    isScanning,
    scanBarcode,
    resetScanning,
  };
};
