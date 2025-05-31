# Kitchen Buddy App

A React Native mobile application designed to help users track food ingredients in their kitchen, with a focus on expiration dates and food freshness. The app aims to reduce food waste by providing timely information about ingredients that are expiring soon or need attention.

## Features

- **Add and Edit Ingredients**: Maintain a detailed inventory of kitchen ingredients
- **Track Expiration Dates**: Get alerts for ingredients that are expiring soon
- **Barcode Scanning**: Quickly add products by scanning barcodes
- **Smart Filtering**: View ingredients by different criteria (expiring soon, missing data, etc.)
- **Ripeness Tracking**: Monitor the ripeness of fruits and vegetables
- **Storage Management**: Track where items are stored (fridge, freezer, pantry, etc.)

## App Architecture

The app follows a modular, functional architecture with clear separation of concerns:

### Core Components

1. **Screens**: UI components that handle user interaction
   - `AddIngredientScreen`: Form for adding/editing ingredients
   - `ExpiringSoonScreen`: Shows ingredients expiring soon
   - `QueryScreen`: Provides different filtered views of ingredients
   - `CameraScreen`: Handles barcode scanning functionality

2. **Custom Hooks**: Encapsulate and manage state and logic
   - `useIngredients`: Manages ingredient data and operations
   - `useCamera`: Handles camera permissions and barcode scanning

3. **Utilities**: Reusable functions for common operations
   - `dateUtils`: Functions for date formatting and calculations
   - `ingredientUtils`: Functions for ingredient filtering and manipulation
   - `storageUtils`: Functions for AsyncStorage operations
   - `constants`: Centralized configuration values

### Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│     Screens     │◄────┤  Custom Hooks   │◄────┤    Utilities    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        ▲                       ▲                       ▲
        │                       │                       │
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                      ┌─────────────────┐
                      │                 │
                      │   AsyncStorage  │
                      │                 │
                      └─────────────────┘
```

## Key Features Explained

### Expiration Date Logic

The app uses several utility functions to handle expiration dates:

- `getDaysUntilExpiration`: Calculates days remaining until an item expires
- `isExpiringSoon`: Determines if an item will expire within a specified timeframe
- `adjustExpirationForFrozen`: Extends expiration date by 6 months when an item is frozen
- `adjustExpirationForOpened`: Reduces expiration date by 7 days when an item is opened

### Ripeness Tracking

The app tracks ripeness of produce with these features:

- Four ripeness levels: Green, Ripe/Mature, Advanced, Too Ripe
- Automatic timestamp when ripeness is updated
- Reminders to check ripeness after 3 days (customizable)

### Filtering System

The app provides multiple ways to view ingredients:

- **Expiring Soon**: Items that will expire within a user-defined timeframe
- **Missing Data**: Items with incomplete information
- **Most Recent**: Recently added items
- **Needs Ripeness Check**: Items that need ripeness verification

### Barcode Scanning

The app integrates with the OpenFoodFacts API to fetch product data:

- Scans EAN-13 and EAN-8 barcodes
- Automatically creates new ingredient entries with data from the API
- Maps API categories to app categories

## Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Code Structure

```
├── App.tsx              # Main application component
├── assets/              # Images and other static assets
├── components/          # Reusable UI components
│   └── Dropdown.tsx     # Custom dropdown component
├── hooks/               # Custom React hooks
│   ├── useCamera.ts     # Camera and barcode scanning logic
│   └── useIngredients.ts # Ingredient state management
├── screens/             # App screens
│   ├── AddIngredientScreen.tsx    # Add/edit ingredients
│   ├── CameraScreen.tsx           # Barcode scanning
│   ├── ExpiringSoonScreen.tsx     # Expiring soon view
│   └── QueryScreen.tsx            # Filtered ingredient views
└── utils/               # Utility functions
    ├── constants.ts     # App constants and configuration
    ├── dateUtils.ts     # Date-related utilities
    ├── ingredientUtils.ts # Ingredient-related utilities
    └── storageUtils.ts  # AsyncStorage operations
```

## Development Guidelines

- **Modularity**: Keep components and functions small and focused
- **Separation of Concerns**: UI components should not contain business logic
- **Consistent Naming**: Follow established naming conventions
- **Documentation**: Add comments for complex logic
- **Type Safety**: Use TypeScript interfaces for better type checking
