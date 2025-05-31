import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';

// Import utilities and constants
import { formatDateDisplay, getDaysUntilExpiration } from '../utils/dateUtils';
import { Ingredient, getExpiringSoonIngredients } from '../utils/ingredientUtils';
import { DEFAULT_EXPIRING_DAYS_THRESHOLD, COLORS } from '../utils/constants';

/**
 * Expiring Soon Screen
 * Shows ingredients that will expire within a user-defined timeframe
 */
interface ExpiringSoonScreenProps {
  ingredients: Ingredient[];
}

const ExpiringSoonScreen: React.FC<ExpiringSoonScreenProps> = ({ ingredients }) => {
  // State for days threshold (default from constants)
  const [daysThreshold, setDaysThreshold] = useState(DEFAULT_EXPIRING_DAYS_THRESHOLD);

  // Get ingredients that are expiring soon using the utility function
  const expiringSoon = getExpiringSoonIngredients(ingredients, daysThreshold);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expiring Soon</Text>
      
      {/* Days threshold input */}
      <Text style={styles.label}>Show ingredients expiring in the next:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(daysThreshold)}
        onChangeText={(value) => setDaysThreshold(Number(value) || 0)}
        placeholder="Enter days"
      />
      
      {/* List of expiring ingredients */}
      <FlatList
        data={expiringSoon}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.listItemHeader}>
              <Text style={styles.listTitle}>{item.name}</Text>
              {item.category && (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.listText}>
              Location: {item.location || 'Not specified'}
            </Text>
            
            {item.expiration ? (
              <Text style={[styles.listText, 
                getDaysUntilExpiration(item.expiration) <= 2 ? styles.urgentText : null]}>
                Expires in: {getDaysUntilExpiration(item.expiration)} days 
                ({formatDateDisplay(item.expiration)})
              </Text>
            ) : (
              <Text style={styles.listText}>No Expiration Date</Text>
            )}
            
            {item.isOpened && (
              <Text style={[styles.listText, styles.warningText]}>⚠️ Opened</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No ingredients expiring within the selected period.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
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
  listItem: {
    backgroundColor: COLORS.cardBackground,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.dark,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  categoryText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  listText: {
    fontSize: 14,
    color: COLORS.text.medium,
    marginBottom: 4,
  },
  urgentText: {
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  warningText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text.light,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ExpiringSoonScreen;