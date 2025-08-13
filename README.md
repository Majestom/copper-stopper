# Copper Stopper

Copper Stopper is data visualisation platform for monitoring trends in police stop and search activities by the London Metropolitan Police.

## Overview

Copper Stopper provides interactive tools to analyse and visualise police stop and search data, helping researchers, journalists, and citizens understand patterns and trends in police activities across London. The application combines mapping, tabular data analysis, and statistical charts to provide multiple perspectives on the data.

## Features

### 🗺️ Interactive Map

- **Clustered View**: At lower zoom levels, data points are clustered for performance and clarity
- **Individual Points**: Zoom in (level 16+) to see individual stop and search locations
- **Interactive Popups**: Click on individual points to view detailed metadata including:
  - Date and time of incident
  - Demographics (age, gender, ethnicity)
  - Type of search and legislation used
  - Outcome and objects searched for
  - Location details
- **Bounding Box Filtering**: Only loads data for the visible map area for optimal performance

### 📊 Data Table

- **Comprehensive Records**: Browse all stop and search records in a paginated table
- **Advanced Filtering**: Filter by type, gender, age range, outcome, and date range
- **Sorting**: Sort by any column (date, location, demographics, outcomes)
- **Search**: Full-text search across record details
- **Export Ready**: View detailed data suitable for further analysis

### 📈 Analytics Dashboard

- **Monthly Trends**: Bar chart showing stop and search frequency over time
- **Summary Statistics**:
  - Total number of records
  - Average incidents per month
  - Number of months with available data
- **Interactive Charts**: Hover for detailed monthly counts
- **Time Series Analysis**: Identify seasonal patterns and long-term trends

## Technology Stack

- **Frontend**: Next.js 15+ with Pages Router, TypeScript, Vanilla Extract CSS
- **Backend**: Python data fetcher with SQLite database
- **Mapping**: OpenLayers with clustering and individual point display
- **Charts**: Chart.js with React wrapper
- **Data Management**: React Query for efficient caching and state management
- **Containerization**: Docker and Docker Compose for easy deployment

## Quick Start

### Prerequisites

- Docker and Docker Compose installed on your system
- Internet connection (required for initial data fetching from UK Police API)
- Approximately 1GB of free disk space for the database

### Setup and Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Majestom/copper-stopper.git
   cd copper-stopper
   ```

2. **Build the application**

   ```bash
   docker compose build
   ```

3. **Start the services**

   ```bash
   docker compose up
   ```

4. **Wait for data population**

   - The backend will automatically fetch and populate the SQLite database
   - This process takes approximately **3-5 minutes** on first run
   - Watch the console logs to see the data fetching progress

5. **Access the application**
   - Open your browser and navigate to: **http://localhost:3000**
   - The application will be ready once you see "Database connected successfully" in the logs

## Navigation

The application features three main sections accessible via the sidebar:

- **🗺️ Map**: Interactive geographical visualization
- **📊 Table**: Detailed tabular data with filtering and search
- **📈 Analytics**: Statistical charts and trend analysis

## Data Source

The application uses publicly available police stop and search data from the UK Police API, focusing on London Metropolitan Police activities. Data is automatically fetched and updated, covering incidents from 2023 onwards.

## Architecture

```
copper-stopper/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── components/  # React components (map, table, layout)
│   │   ├── hooks/       # Data fetching and state management
│   │   ├── pages/       # Next.js pages and API routes
│   │   └── styles/      # Vanilla Extract CSS-in-TypeScript
├── data-fetcher/      # Python backend service
│   ├── fetch_data.py    # Data collection and processing
│   ├── database.py      # SQLite database management
│   └── requirements.txt # Python dependencies
├── data/              # SQLite database storage
└── docker-compose.yml # Service orchestration
```

## Performance Features

- **Intelligent Data Loading**: Map switches between clustered and individual point APIs based on zoom level
- **Bounding Box Optimization**: Only loads data for visible map areas
- **Efficient Caching**: React Query provides smart caching and background updates
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: Full ARIA support and keyboard navigation

## Development

For local development without Docker:

1. **Backend Setup**

   ```bash
   cd data-fetcher
   pip install -r requirements.txt
   python fetch_data.py
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

**Note**: The initial database population may take several minutes. Please be patient while the system fetches and processes the latest police data.

## Accessibility & Performance

### 🌐 Web Accessibility (WCAG 2.1 AA Compliance)

Copper Stopper is built with accessibility as a core principle, implementing comprehensive WCAG 2.1 AA guidelines:

#### **Semantic HTML & ARIA**

- **Semantic Structure**: All components use proper HTML5 semantic elements (`<main>`, `<nav>`, `<section>`, `<article>`)
- **ARIA Labels**: Comprehensive aria-label, aria-describedby, and aria-live attributes for dynamic content
- **Screen Reader Support**: Hidden descriptions and live regions for status updates
- **Role Definitions**: Proper ARIA roles for complex components (tables, navigation, forms)

```typescript
// Example: DataTable with full accessibility
<table
  role="table"
  aria-label="Police stop and search records"
  aria-describedby="table-description"
>
  <caption className={styles.visuallyHidden}>
    Table showing police stop and search records with sortable columns.
  </caption>
```

#### **Keyboard Navigation**

- **Full Keyboard Access**: All interactive elements accessible via keyboard
- **Focus Management**: Visible focus indicators and logical tab order
- **Skip Links**: Screen reader navigation shortcuts
- **Button Semantics**: Proper button elements for interactive controls

### ⚡ Performance Optimization

#### **Data Loading Strategies**

- **Intelligent Map Clustering**: Switches between clustered (zoom < 16) and individual point APIs
- **Bounding Box Optimization**: Only loads data for visible map areas
- **Pagination**: Large datasets split into manageable chunks (100 records per page)
- **Debounced Search**: 300ms delay prevents excessive API calls during typing

```typescript
// Example: Debounced search implementation
useEffect(() => {
  const timeoutId = setTimeout(() => {
    if (searchInput !== currentFilters.search) {
      onFilter({ search: searchInput });
    }
  }, 300);
  return () => clearTimeout(timeoutId);
}, [searchInput, onFilter, currentFilters.search]);
```

#### **Caching & State Management**

- **React Query**: Intelligent caching with stale-while-revalidate strategy
- **Background Updates**: Data refreshes without blocking UI
- **Cache Invalidation**: Smart cache management for data consistency
- **Optimistic Updates**: Immediate UI feedback while API calls complete

#### **Bundle Optimization**

- **Code Splitting**: Pages and components loaded on demand
- **Tree Shaking**: Unused code eliminated from bundles
- **CSS-in-TypeScript**: Vanilla Extract for type-safe, optimized styling
- **Image Optimization**: Next.js automatic image optimization

## Error Handling & Data Validation

### 🛡️ Robust Error Handling

#### **API Error Management**

- **Graceful Degradation**: UI remains functional during API failures
- **User-Friendly Messages**: Clear error descriptions instead of technical details
- **Retry Logic**: Automatic retry for transient failures
- **Fallback States**: Loading and error states for all async operations

```typescript
// Example: Comprehensive error handling in API routes
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = analyticsDataSchema.parse(queryResult);
    res.status(200).json(result);
  } catch (error) {
    console.error("Analytics API error:", error);

    if (error instanceof z.ZodError) {
      return res.status(500).json({
        error: "Data validation failed",
        details: error.errors,
      });
    }

    return res.status(500).json({
      error: "Failed to fetch analytics data",
    });
  }
}
```

#### **Client-Side Error Boundaries**

- **React Error Boundaries**: Prevent crashes from propagating
- **Error Recovery**: Graceful handling of component failures
- **User Feedback**: Clear error messages with recovery actions
- **Logging**: Error tracking for debugging and monitoring

### 🔍 Data Validation & Type Safety

#### **Runtime Validation with Zod**

- **Schema Validation**: All API responses validated against Zod schemas
- **Type Generation**: TypeScript types automatically generated from schemas
- **Data Transformation**: Safe parsing with error handling
- **Null Safety**: Proper handling of missing or invalid data

```typescript
// Example: Zod schema for analytics data
export const analyticsDataSchema = z.object({
  monthlyTrends: z.array(
    z.object({
      month: z.string(),
      count: z.number(),
      year: z.number(),
      monthName: z.string(),
    })
  ),
  totalRecords: z.number(),
  averagePerMonth: z.number(),
  monthsWithData: z.number(),
});

export type AnalyticsData = z.infer<typeof analyticsDataSchema>;
```

#### **Database Layer Validation**

- **SQL Parameter Binding**: Prevents SQL injection attacks
- **Type Checking**: Database schema validation at runtime
- **Constraint Enforcement**: Foreign key and data integrity constraints
- **Error Recovery**: Graceful handling of database connection issues

#### **Input Sanitization**

- **XSS Prevention**: All user inputs properly escaped
- **Data Normalization**: Consistent data formats across the application
- **Boundary Validation**: Min/max limits on pagination and filters
- **Format Validation**: Date, numeric, and string format checking

### 🔧 Monitoring & Debugging

#### **Development Tools**

- **React Query Devtools**: Real-time cache and network inspection
- **TypeScript Strict Mode**: Comprehensive compile-time checking
- **ESLint & Prettier**: Code quality and consistency enforcement
- **Source Maps**: Detailed debugging information in development
