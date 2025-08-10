"""Database operations for storing police stop and search data."""

import sqlite3
import json
from typing import Dict, List, Any, Optional
from config import DB_PATH


def create_database():
    """Create the SQLite database and tables."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create the main stop_search table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stop_search (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            
            -- Basic info
            datetime TEXT NOT NULL,
            type TEXT,
            
            -- Person details
            age_range TEXT,
            gender TEXT,
            self_defined_ethnicity TEXT,
            officer_defined_ethnicity TEXT,
            
            -- Search details
            legislation TEXT,
            object_of_search TEXT,
            outcome TEXT,
            outcome_linked_to_object_of_search BOOLEAN,
            removal_of_more_than_outer_clothing BOOLEAN,
            
            -- Location (can be null)
            latitude REAL,
            longitude REAL,
            street_id INTEGER,
            street_name TEXT,
            
            -- Operational details
            involved_person BOOLEAN,
            operation BOOLEAN,
            operation_name TEXT,
            
            -- Metadata
            force TEXT NOT NULL,
            source_date TEXT NOT NULL,  -- YYYY-MM format from API
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            
            -- Store raw JSON for debugging
            raw_data TEXT
        )
    ''')
    
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_datetime ON stop_search(datetime)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_force ON stop_search(force)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_location ON stop_search(latitude, longitude)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_outcome ON stop_search(outcome)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_source_date ON stop_search(source_date)')
    
    # Create a metadata table to track what we've fetched
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS fetch_metadata (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            force TEXT NOT NULL,
            date TEXT NOT NULL,  -- YYYY-MM format
            record_count INTEGER NOT NULL,
            fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            success BOOLEAN NOT NULL,
            error_message TEXT,
            
            UNIQUE(force, date)
        )
    ''')
    
    conn.commit()
    conn.close()
    print(f"Database created at {DB_PATH}")


def insert_stop_search_records(records: List[Dict[str, Any]], force: str, source_date: str) -> int:
    """Insert stop and search records into the database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    inserted_count = 0
    
    for record in records:
        try:
            location = record.get('location')
            latitude = None
            longitude = None
            street_id = None
            street_name = None
            
            if location:
                latitude = float(location.get('latitude')) if location.get('latitude') else None
                longitude = float(location.get('longitude')) if location.get('longitude') else None
                street = location.get('street', {})
                if street:
                    street_id = street.get('id')
                    street_name = street.get('name')
            
            outcome_object = record.get('outcome_object', {})
            outcome = outcome_object.get('name') if outcome_object else record.get('outcome')
            
            cursor.execute('''
                INSERT INTO stop_search (
                    datetime, type, age_range, gender, self_defined_ethnicity, 
                    officer_defined_ethnicity, legislation, object_of_search, outcome,
                    outcome_linked_to_object_of_search, removal_of_more_than_outer_clothing,
                    latitude, longitude, street_id, street_name, involved_person,
                    operation, operation_name, force, source_date, raw_data
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                record.get('datetime'),
                record.get('type'),
                record.get('age_range'),
                record.get('gender'),
                record.get('self_defined_ethnicity'),
                record.get('officer_defined_ethnicity'),
                record.get('legislation'),
                record.get('object_of_search'),
                outcome,
                record.get('outcome_linked_to_object_of_search'),
                record.get('removal_of_more_than_outer_clothing'),
                latitude,
                longitude,
                street_id,
                street_name,
                record.get('involved_person'),
                record.get('operation'),
                record.get('operation_name'),
                force,
                source_date,
                json.dumps(record)
            ))
            inserted_count += 1
            
        except Exception as e:
            print(f"Error inserting record: {e}")
            print(f"Record: {record}")
            continue
    
    conn.commit()
    conn.close()
    return inserted_count


def record_fetch_attempt(force: str, date: str, record_count: int, success: bool, error_message: Optional[str] = None):
    """Record metadata about a fetch attempt."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT OR REPLACE INTO fetch_metadata 
        (force, date, record_count, success, error_message)
        VALUES (?, ?, ?, ?, ?)
    ''', (force, date, record_count, success, error_message))
    
    conn.commit()
    conn.close()


def get_fetch_status() -> List[Dict[str, Any]]:
    """Get the status of all fetch attempts."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT force, date, record_count, success, error_message, fetched_at
        FROM fetch_metadata
        ORDER BY date DESC
    ''')
    
    results = []
    for row in cursor.fetchall():
        results.append({
            'force': row[0],
            'date': row[1],
            'record_count': row[2],
            'success': bool(row[3]),
            'error_message': row[4],
            'fetched_at': row[5]
        })
    
    conn.close()
    return results


def get_total_records() -> int:
    """Get the total number of records in the database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM stop_search')
    count = cursor.fetchone()[0]
    
    conn.close()
    return count


if __name__ == "__main__":
    create_database()
    print("Database setup complete!")