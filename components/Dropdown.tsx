import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DropdownProps {
  label: string;
  options: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, selectedValue, onValueChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setOpen(!open)}
      >
        <Text style={styles.buttonText}>{selectedValue || label}</Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => {
                onValueChange(option);
                setOpen(false);
              }}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  button: {
    borderWidth: 1,
    borderColor: '#F2C94C',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#F2C94C',
    fontSize: 16,
  },
  optionsContainer: {
    borderWidth: 1,
    borderColor: '#F2C94C',
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: '#fff',
  },
  optionButton: {
    padding: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#F2C94C',
  },
});

export default Dropdown;