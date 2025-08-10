"""Main script to fetch all historical police stop and search data."""

import requests
import time
from datetime import datetime, date
from dateutil.relativedelta import relativedelta
from tqdm import tqdm
from typing import List, Dict, Any, Optional

from config import API_BASE_URL, FORCE_ID, REQUEST_DELAY, MAX_RETRIES
from database import (
    create_database, 
    insert_stop_search_records, 
    record_fetch_attempt, 
    get_fetch_status,
    get_total_records
)


class PoliceDataFetcher:
    """Fetches police stop and search data from the UK Police Data API."""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Police Data Analysis Tool - Academic Research'
        })
    
    def discover_available_dates(self, force: str) -> List[str]:
        """Generate a reasonable date range since API discovery is unreliable."""
        print("Generating date range from 2020 to present...")
        
        # Let's test with a known good date first
        test_date = "2024-01"
        print(f"Testing API with {test_date}...")
        
        test_data = self.fetch_month_data(force, test_date)
        if test_data is None:
            print("API test failed - may be having issues")
            return []
        
        print(f"✓ API test successful - got {len(test_data) if test_data else 0} records")
        
        # Generate reasonable date range
        return self._generate_date_range_fallback()
    
    def _generate_date_range_fallback(self) -> List[str]:
        """Generate a fallback date range if API discovery fails."""
        dates = []
        start_date = date(2023, 1, 1)  # Start from 2023
        end_date = date.today().replace(day=1)  # First of current month
        
        current = start_date
        while current <= end_date:
            dates.append(current.strftime("%Y-%m"))
            current += relativedelta(months=1)
        
        return dates
    
    def fetch_month_data(self, force: str, date_str: str, retry_count: int = 0) -> Optional[List[Dict[str, Any]]]:
        """Fetch data for a specific month."""
        url = f"{API_BASE_URL}/stops-force"
        params = {
            'force': force,
            'date': date_str
        }
        
        try:
            print(f"Fetching {force} data for {date_str}...")
            response = self.session.get(url, params=params, timeout=30)
            
            if response.status_code == 404:
                print(f"No data available for {date_str}")
                return []
            elif response.status_code == 502:
                print(f"Server error (502) for {date_str} - API may be overloaded")
                if retry_count < MAX_RETRIES:
                    wait_time = (retry_count + 1) * 10  # Longer wait for server errors
                    print(f"Waiting {wait_time}s before retry...")
                    time.sleep(wait_time)
                    return self.fetch_month_data(force, date_str, retry_count + 1)
                else:
                    print(f"Giving up on {date_str} after {MAX_RETRIES} retries")
                    return None
            elif response.status_code == 503:
                print(f"Service unavailable (503) for {date_str} - API may be down")
                return None
            
            response.raise_for_status()
            data = response.json()
            
            if not isinstance(data, list):
                print(f"Unexpected response format for {date_str}: {type(data)}")
                return []
            
            print(f"✓ Retrieved {len(data)} records for {date_str}")
            return data
            
        except requests.exceptions.Timeout:
            print(f"Timeout for {date_str}")
            if retry_count < MAX_RETRIES:
                time.sleep(5)
                return self.fetch_month_data(force, date_str, retry_count + 1)
            return None
            
        except requests.exceptions.RequestException as e:
            if retry_count < MAX_RETRIES:
                wait_time = (retry_count + 1) * 5
                print(f"Request failed for {date_str}, retrying in {wait_time}s... (attempt {retry_count + 1})")
                time.sleep(wait_time)
                return self.fetch_month_data(force, date_str, retry_count + 1)
            else:
                print(f"Failed to fetch data for {date_str} after {MAX_RETRIES} retries: {e}")
                return None
        
        except Exception as e:
            print(f"Unexpected error fetching {date_str}: {e}")
            return None
    
    def fetch_all_data(self, force: str):
        """Fetch all available data for a force."""
        print(f"Starting data fetch for {force}")
        print("=" * 50)
        
        create_database()
        
        print("Discovering available dates...")
        available_dates = self.discover_available_dates(force)
        
        if not available_dates:
            print("No dates found. Exiting.")
            return
        
        print(f"Will attempt to fetch {len(available_dates)} months of data")
        print(f"Date range: {available_dates[0]} to {available_dates[-1]}")
        print()
        
        total_records = 0
        successful_months = 0
        failed_months = 0
        
        for date_str in tqdm(available_dates, desc="Fetching months"):
            try:
                # Add delay to be respectful to the API
                time.sleep(REQUEST_DELAY)
                
                month_data = self.fetch_month_data(force, date_str)
                
                if month_data is None:
                    record_fetch_attempt(force, date_str, 0, False, "Failed to fetch data")
                    failed_months += 1
                    continue
                
                if month_data:
                    inserted_count = insert_stop_search_records(month_data, force, date_str)
                    total_records += inserted_count
                    
                    if inserted_count != len(month_data):
                        print(f"Warning: Only inserted {inserted_count}/{len(month_data)} records for {date_str}")
                
                record_fetch_attempt(force, date_str, len(month_data), True)
                successful_months += 1
                
            except KeyboardInterrupt:
                print("\nFetch interrupted by user")
                break
            except Exception as e:
                print(f"Error processing {date_str}: {e}")
                record_fetch_attempt(force, date_str, 0, False, str(e))
                failed_months += 1
                continue
        
        print("\n" + "=" * 50)
        print("FETCH COMPLETE")
        print("=" * 50)
        print(f"Successful months: {successful_months}")
        print(f"Failed months: {failed_months}")
        print(f"Total records inserted: {total_records}")
        print(f"Database records: {get_total_records()}")
        print()
        
        print("Fetch status summary:")
        status = get_fetch_status()
        recent_failures = [s for s in status[:10] if not s['success']]
        if recent_failures:
            print("Recent failures:")
            for failure in recent_failures:
                print(f"  {failure['date']}: {failure['error_message']}")
        else:
            print("No recent failures!")


def main():
    """Main entry point."""
    fetcher = PoliceDataFetcher()
    
    print("Police Data Fetcher")
    print("==================")
    print(f"Target force: {FORCE_ID}")
    print(f"Request delay: {REQUEST_DELAY}s")
    print()
    
    fetcher.fetch_all_data(FORCE_ID)


if __name__ == "__main__":
    main()