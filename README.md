# Australian Business Advisor Documentation

## Overview

The Australian Business Advisor is a web application that provides interactive visualization and analysis of Australian Bureau of Statistics (ABS) data. The application allows users to explore demographic data across different geographical levels (State, SA4, SA3, SA2) and generates business suggestions based on population ancestry data.

## Architecture

### Tech Stack

- **Frontend Framework**: Next.js (React)
- **Mapping**: ArcGIS API for JavaScript
- **Styling**: SCSS Modules
- **API**: Next.js API Routes
- **Data Source**: Australian Bureau of Statistics (ABS) API

### Core Components

#### 1. Map Component (`src/components/Map/`)

- **Provider.tsx**: Manages the ArcGIS map context and initialization
- **index.tsx**: Renders the map container and handles map interactions

#### 2. Form Component (`src/app/components/aside/form/`)

- Handles user input for region selection
- Implements a hierarchical selection system:
  - State → SA4 → SA3 → SA2
- Features:
  - Dynamic form validation
  - Region selection synchronization with map
  - Business suggestions generation

#### 3. API Routes (`src/app/api/`)

- **regions/**: Fetches geographical data from ABS
- **business-suggestions/**: Processes ancestry data and generates business recommendations

### Data Flow

1. **Region Selection**

   ```
   User Input → Form Component → Region API → Map Update
   ```

2. **Business Suggestions**
   ```
   Form Submission → ABS Data Fetch → Data Processing → Business Suggestions API → UI Update
   ```

### State Management

- Uses React Context for global state (RegionsContext)
- Implements reducers for complex state management (suggestionsReducer)
- Maintains map state through ArcGIS-specific context

## Key Features

### 1. Geographic Data Visualization

- Interactive map interface
- Multiple geographic levels (STE > SA4 > SA3 > SA2)
- Layer management for different data views

### 2. Data Analysis

- Population ancestry data analysis
- Business opportunity identification
- Dynamic data filtering

### 3. User Interface

- Responsive design
- Intuitive form controls
- Real-time map updates
- Business suggestions display

## API Integration

### ABS API Endpoints

- Maps API: `https://maps.abs.gov.au/`
- Geographic Services: `https://geo.abs.gov.au/arcgis/rest/services/ASGS2021`
- Data API: `https://data.api.abs.gov.au/rest/data/`

## SDMX (Statistical Data and Metadata eXchange)

SDMX is an international standard for exchanging statistical data and metadata, which is used by the Australian Bureau of Statistics (ABS) API. In this application, we use SDMX-JSON format to retrieve and process statistical data.

### Implementation

- Uses `sdmx-json-parser` library for parsing SDMX responses
- Handles data through structured JSON format
- Supports complex statistical queries and data aggregation

### Key Concepts

1. **Data Structure Definition (DSD)**

   - Defines the structure of statistical data
   - Includes dimensions, attributes, and measures
   - Example: Geographic areas (SA2, SA3, etc.) as dimensions

2. **Data Flow**

   - Named sets of data sharing the same structure
   - Example: Census data for different years

3. **Observations**
   - The actual statistical values
   - Organized by dimensions and attributes
   - Example: Population counts by ancestry

### Usage in the Application

```typescript
// Example of SDMX data retrieval
const parser = new SDMXParser();
await parser.getDatasets(datasetUrl);
const parsedData = parser.getData();
```

### Data Structures

- Geographic Hierarchy:
  ```
  State (STE) → Statistical Area Level 4 (SA4) → Statistical Area Level 3 (SA3) → Statistical Area Level 2 (SA2)
  ```

## Development Guidelines

### Project Structure

```
aus-chart-builder/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── components/     # Page-specific components
│   │   └── context/        # React context providers
│   ├── components/         # Shared components
│   ├── scss/              # Global styles
│   └── utils/             # Utility functions
```

### Best Practices

1. **Component Organization**

   - Keep components focused and single-responsibility
   - Use TypeScript interfaces for prop definitions
   - Implement proper error handling

2. **State Management**

   - Use context for global state
   - Implement reducers for complex state logic
   - Keep form state local when possible

3. **Styling**

   - Use SCSS modules for component-specific styles
   - Follow BEM naming convention
   - Maintain consistent variable naming

4. **Error Handling**
   - Implement proper error boundaries
   - Provide user-friendly error messages
   - Log errors appropriately

## Environment Setup

### Required Environment Variables

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Development Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and add your Gemini API key:

   ```
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Access the application:
   ```
   http://localhost:3000
   ```

## Deployment

The application is optimized for deployment on Vercel:

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy using Vercel's automated pipeline
