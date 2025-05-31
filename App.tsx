
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { View, Button, StyleSheet } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

// Import screens
import AddIngredientScreen from './screens/AddIngredientScreen';
import ExpiringSoonScreen from './screens/ExpiringSoonScreen';
import QueryScreen from './screens/QueryScreen';
import CameraScreen from './screens/CameraScreen';

// Import custom hooks and utilities
import { useIngredients } from './hooks/useIngredients';
import { Ingredient } from './utils/ingredientUtils';
import { COLORS } from './utils/constants';

// Create bottom tab navigator
const Tab = createBottomTabNavigator();

/**
 * Main App component
 * Uses custom hooks for state management and provides navigation structure
 */
const App = () => {
  // Use the custom ingredients hook for state management
  const {
    ingredients,
    editingIngredient,
    saveIngredient,
    deleteIngredient,
    startEditing,
    cancelEditing,
    resetIngredients,
  } = useIngredients();

  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              // Set icons for each tab
              switch (route.name) {
                case 'Add Ingredient':
                  return <FontAwesome name="shopping-cart" size={size} color={color} />;
                case 'Expiring Soon':
                  return <FontAwesome name="exclamation-circle" size={size} color={color} />;
                case 'Ingredients':
                  return <FontAwesome name="list-alt" size={size} color={color} />;
                case 'Camera Scanning':
                  return <MaterialIcons name="camera-alt" size={size} color={color} />;
                default:
                  return null;
              }
            },
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: 'gray',
          })}
        >
          {/* Add Ingredient Screen */}
          <Tab.Screen name="Add Ingredient">
            {({ navigation }) => (
              <AddIngredientScreen
                ingredients={ingredients}
                editingIngredient={editingIngredient}
                onSaveIngredient={saveIngredient}
                navigation={navigation}
                onBlur={cancelEditing}
              />
            )}
          </Tab.Screen>
          
          {/* Expiring Soon Screen */}
          <Tab.Screen name="Expiring Soon">
            {() => <ExpiringSoonScreen ingredients={ingredients} />}
          </Tab.Screen>
          
          {/* Ingredients Screen with Query functionality */}
          <Tab.Screen name="Ingredients">
            {({ navigation }) => (
              <View style={styles.container}>
                <QueryScreen
                  ingredients={ingredients}
                  deleteIngredient={deleteIngredient}
                  navigateToEdit={(ingredient) => {
                    startEditing(ingredient);
                    navigation.navigate('Add Ingredient');
                  }}
                />
                <View style={styles.resetContainer}>
                  <Button
                    title="Reset Ingredients"
                    color={COLORS.primary}
                    onPress={resetIngredients}
                  />
                </View>
              </View>
            )}
          </Tab.Screen>
          
          {/* Camera Scanning Screen */}
          <Tab.Screen name="Camera Scanning">
            {({ navigation }) => (
              <CameraScreen
                navigation={navigation}
                onAddIngredient={(ingredient: Ingredient) => saveIngredient(ingredient)}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resetContainer: {
    padding: 20,
    backgroundColor: COLORS.background,
  },
});

export default App;