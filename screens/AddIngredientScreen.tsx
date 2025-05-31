
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Dropdown from '../components/Dropdown';

// Import utilities and constants
import { formatDateDisplay, adjustExpirationForFrozen, adjustExpirationForOpened } from '../utils/dateUtils';
import { Ingredient, createEmptyIngredient } from '../utils/ingredientUtils';
import { CATEGORY_OPTIONS, LOCATION_OPTIONS, CONFECTION_OPTIONS, RIPENESS_OPTIONS, COLORS } from '../utils/constants';

/**
 * Add/Edit Ingredient Screen
 * Allows users to add new ingredients or edit existing ones
 */
interface AddIngredientScreenProps {
  ingredients: Ingredient[];
  editingIngredient: Ingredient | null;
  onSaveIngredient: (ingredient: Ingredient) => void;
  navigation: any;
  onBlur: () => void;
}

const AddIngredientScreen: React.FC<AddIngredientScreenProps> = ({ 
  editingIngredient, 
  onSaveIngredient, 
  onBlur 
}) => {
  // Form state
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [ripeness, setRipeness] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [confection, setConfection] = useState('');
  const [expiration, setExpiration] = useState(''); 
  const [lastRipenessUpdate, setLastRipenessUpdate] = useState<string | null>(null);
  const [isFrozen, setIsFrozen] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Load editing ingredient data when available
  useEffect(() => {
    if (editingIngredient) {
      setName(editingIngredient.name || '');
      setBrand(editingIngredient.brand || '');
      setRipeness(editingIngredient.ripeness || '');
      setCategory(editingIngredient.category || '');
      setLocation(editingIngredient.location || '');
      setConfection(editingIngredient.confection || '');
      setExpiration(editingIngredient.expiration || '');
      setLastRipenessUpdate(editingIngredient.lastRipenessUpdate || null);
      setIsFrozen(editingIngredient.isFrozen || false);
      setIsOpened(editingIngredient.isOpened || false);
      if (editingIngredient.expiration) {
        setSelectedDate(new Date(editingIngredient.expiration));
      }
    }
  }, [editingIngredient]);

  // Call onBlur when component unmounts
  useEffect(() => {
    return () => {
      if (onBlur) onBlur();
    };
  }, [onBlur]);

  /**
   * Handles toggling the frozen status and updates expiration date accordingly
   */
  const handleFrozenToggle = () => {
    setIsFrozen((prev) => {
      const newState = !prev;
      if (expiration) {
        setExpiration(adjustExpirationForFrozen(expiration, newState));
      }
      return newState;
    });
  };

  /**
   * Handles toggling the opened status and updates expiration date accordingly
   */
  const handleOpenedToggle = () => {
    setIsOpened((prev) => {
      const newState = !prev;
      if (expiration) {
        setExpiration(adjustExpirationForOpened(expiration, newState));
      }
      return newState;
    });
  };

  /**
   * Validates and saves the ingredient
   */
  const handleSaveIngredient = () => {
    if (!name) {
      Alert.alert('Error', 'Ingredient name is required!');
      return;
    }
    
    // Create ingredient object with current form values
    const newIngredient: Ingredient = {
      id: editingIngredient ? editingIngredient.id : Date.now().toString(),
      name,
      brand,
      ripeness,
      category,
      location,
      confection,
      expiration,
      lastRipenessUpdate: lastRipenessUpdate || new Date().toISOString(),
      isFrozen,
      isOpened,
    };

    // Save ingredient using the provided callback
    onSaveIngredient(newIngredient);
    
    // Reset form
    resetForm();
  };
  
  /**
   * Resets the form to default values
   */
  const resetForm = () => {
    setName('');
    setBrand('');
    setRipeness('');
    setCategory('');
    setLocation('');
    setConfection('');
    setExpiration('');
    setLastRipenessUpdate(null);
    setIsFrozen(false);
    setIsOpened(false);
    setSelectedDate(new Date());
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.innerContainer}>
        {/* Screen Title */}
        <Text style={styles.title}>
          {editingIngredient ? 'Edit Ingredient' : 'Add Ingredient'}
        </Text>
        
        {/* Ingredient Name */}
        <Text style={styles.inputLabel}>Ingredient Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter ingredient name"
        />
        
        {/* Brand Name */}
        <Text style={styles.inputLabel}>Brand Name</Text>
        <TextInput
          style={styles.input}
          value={brand}
          onChangeText={setBrand}
          placeholder="Enter brand name"
        />
        
        {/* Ripeness Dropdown */}
        <Text style={styles.label}>Ripeness:</Text>
        <Dropdown
          label="Select ripeness"
          options={RIPENESS_OPTIONS}
          selectedValue={ripeness}
          onValueChange={(value) => {
            setRipeness(value);
            setLastRipenessUpdate(new Date().toISOString());
          }}
        />
        
        {/* Category Dropdown */}
        <Text style={styles.label}>Category:</Text>
        <Dropdown
          label="Select Category"
          options={CATEGORY_OPTIONS}
          selectedValue={category}
          onValueChange={setCategory}
        />
        
        {/* Location Dropdown */}
        <Text style={styles.label}>Location:</Text>
        <Dropdown
          label="Select Location"
          options={LOCATION_OPTIONS}
          selectedValue={location}
          onValueChange={setLocation}
        />
        
        {/* Confection Type Dropdown */}
        <Text style={styles.label}>Confection Type:</Text>
        <Dropdown
          label="Select Confection type"
          options={CONFECTION_OPTIONS}
          selectedValue={confection}
          onValueChange={setConfection}
        />
        
        {/* Expiration Date */}
        <Text style={styles.label}>Expiration Date:</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateButtonText}>
            {expiration ? formatDateDisplay(expiration) : 'Select Expiration Date'}
          </Text>
        </TouchableOpacity>

        {/* Frozen and Opened Toggles */}
        <View style={styles.toggleContainer}>
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>Frozen:</Text>
            <Switch
              value={isFrozen}
              onValueChange={handleFrozenToggle}
              trackColor={{ false: '#767577', true: COLORS.primary }}
              thumbColor={isFrozen ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>Opened:</Text>
            <Switch
              value={isOpened}
              onValueChange={handleOpenedToggle}
              trackColor={{ false: '#767577', true: COLORS.primary }}
              thumbColor={isOpened ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveIngredient}>
          <Text style={styles.saveButtonText}>
            {editingIngredient ? 'Update Ingredient' : 'Add Ingredient'}
          </Text>
        </TouchableOpacity>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <Modal
            transparent={true}
            visible={showDatePicker}
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    if (date) {
                      setSelectedDate(date);
                      setExpiration(date.toISOString().split('T')[0]);
                    }
                  }}
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.text.dark,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: COLORS.background,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.text.dark,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: COLORS.background,
  },
  dateButtonText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    marginRight: 10,
    color: COLORS.text.dark,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddIngredientScreen;
