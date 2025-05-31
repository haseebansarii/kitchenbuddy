import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

// Import utilities and constants
import { formatDateDisplay, getDaysUntilExpiration, needsRipenessCheck } from '../utils/dateUtils';
import { 
  Ingredient, 
  getIngredientsWithMissingData, 
  getMostRecentIngredients,
  getIngredientsNeedingRipenessCheck 
} from '../utils/ingredientUtils';
import { DEFAULT_RIPENESS_CHECK_DAYS, COLORS } from '../utils/constants';

/**
 * Query Screen
 * Provides different views of ingredients based on query type
 */
interface QueryScreenProps {
  ingredients: Ingredient[];
  navigateToEdit: (ingredient: Ingredient) => void;
  deleteIngredient: (id: string) => void;
}

const QueryScreen: React.FC<QueryScreenProps> = ({ ingredients, navigateToEdit, deleteIngredient }) => {
  // State for current query type
  const [queryType, setQueryType] = useState('missingData');

  // Query functions using utility functions
  const queries = {
    missingData: () => getIngredientsWithMissingData(ingredients),
    mostRecent: () => getMostRecentIngredients(ingredients),
    needsRipenessCheck: () => getIngredientsNeedingRipenessCheck(ingredients, DEFAULT_RIPENESS_CHECK_DAYS),
  };

  /**
   * Renders an individual ingredient card
   */
  const renderItem = ({ item }: { item: Ingredient }) => (
    <View style={styles.card}>
      {/* Card Header with Category */}
      <View style={styles.header}>
        <Text style={styles.category}>{item.category || 'No Category'}</Text>
        {item.isFrozen && (
          <View style={styles.frozenBadge}>
            <Text style={styles.frozenText}>Frozen</Text>
          </View>
        )}
      </View>
      
      {/* Card Content */}
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Brand:</Text>
          <Text style={styles.detailValue}>{item.brand || 'Unknown'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>{item.location || 'Unknown'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Ripeness:</Text>
          <Text style={styles.detailValue}>{item.ripeness || 'Unknown'}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <Text style={styles.detailValue}>
            {item.isOpened ? 'Opened' : 'Unopened'}
            {needsRipenessCheck(item.lastRipenessUpdate) && ' • Check Ripeness'}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Expires:</Text>
          <Text style={[styles.detailValue, 
            item.expiration && getDaysUntilExpiration(item.expiration) <= 3 ? styles.urgentText : null]}>
            {item.expiration
              ? `${getDaysUntilExpiration(item.expiration)} days (${formatDateDisplay(item.expiration)})`
              : 'No Expiration Date'}
          </Text>
        </View>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigateToEdit(item)}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteIngredient(item.id)} 
        >
          <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingredients</Text>
      
      {/* Query Type Selection Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, queryType === 'missingData' && styles.activeButton]}
          onPress={() => setQueryType('missingData')}
        >
          <Text style={styles.buttonText}>Missing Data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, queryType === 'mostRecent' && styles.activeButton]}
          onPress={() => setQueryType('mostRecent')}
        >
          <Text style={styles.buttonText}>Most Recent</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, queryType === 'needsRipenessCheck' && styles.activeButton]}
          onPress={() => setQueryType('needsRipenessCheck')}
        >
          <Text style={styles.buttonText}>Needs Ripeness Check</Text>
        </TouchableOpacity>
      </View>
      
      {/* Results Count */}
      <Text style={styles.resultCount}>
        {queries[queryType]().length} ingredient{queries[queryType]().length !== 1 ? 's' : ''} found
      </Text>
      
      {/* Ingredients List */}
      <FlatList
        data={queries[queryType]()}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No ingredients found for this query.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    opacity: 0.7,
  },
  activeButton: {
    opacity: 1,
    elevation: 3,
  },
  buttonText: {
    color: COLORS.background,
    fontWeight: 'bold',
    fontSize: 12,
  },
  resultCount: {
    fontSize: 14,
    color: COLORS.text.medium,
    marginBottom: 10,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    flex: 1,
    margin: 5,
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  category: {
    backgroundColor: COLORS.secondary,
    color: COLORS.background,
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  frozenBadge: {
    backgroundColor: '#2196F3',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  frozenText: {
    color: COLORS.background,
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.text.dark,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.text.medium,
    fontWeight: 'bold',
    width: 70,
  },
  detailValue: {
    fontSize: 12,
    color: COLORS.text.medium,
    flex: 1,
  },
  urgentText: {
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: COLORS.background,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: COLORS.danger,
  },
  deleteText: {
    color: COLORS.background,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text.light,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default QueryScreen;