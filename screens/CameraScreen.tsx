import React from "react";
import { Text, View, StyleSheet, Button, ActivityIndicator } from "react-native";
import { CameraView } from "expo-camera";

// Import custom hooks and utilities
import { useCamera } from "../hooks/useCamera";
import { Ingredient } from "../utils/ingredientUtils";
import { COLORS } from "../utils/constants";

/**
 * Camera Screen
 * Allows users to scan product barcodes to add new ingredients
 */
interface CameraScreenProps {
  navigation: any;
  onAddIngredient: (ingredient: Ingredient) => void;
}

const CameraScreen: React.FC<CameraScreenProps> = ({ navigation, onAddIngredient }) => {
  // Use the custom camera hook for handling camera functionality
  const { hasPermission, isScanning, scanBarcode, resetScanning } = useCamera(onAddIngredient);
  
  // Handle permission states
  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>No access to camera. Please enable it in settings.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Loading indicator */}
      {isScanning && (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      )}
      
      {/* Camera view for barcode scanning */}
      <CameraView
        onBarcodeScanned={({ data }) => {
          if (!isScanning) {
            // When a barcode is scanned, process it and navigate to Ingredients screen on success
            scanBarcode(data).then(ingredient => {
              if (ingredient) {
                navigation.navigate("Ingredients");
              }
            });
          }
        }}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8"], 
        }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Scan controls */}
      <View style={styles.controls}>
        <Text style={styles.instructions}>
          Point camera at a barcode to scan product
        </Text>
        <Button
          title="Reset Scanner"
          color={COLORS.primary}
          onPress={resetScanning}
          disabled={isScanning}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.background,
  },
  permissionText: {
    fontSize: 16,
    color: COLORS.text.dark,
    textAlign: "center",
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -25,
    marginLeft: -25,
    zIndex: 10,
  },
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
    alignItems: "center",
  },
  instructions: {
    color: "white",
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
});

export default CameraScreen;