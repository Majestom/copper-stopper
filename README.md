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
