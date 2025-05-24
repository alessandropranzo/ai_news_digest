import os
from supabase import create_client, Client
from dotenv import load_dotenv
import logging
from postgrest import APIResponse

# Load environment variables from .env file
load_dotenv()

url: str | None = os.environ.get("SUPABASE_URL")
key: str | None = os.environ.get("SUPABASE_ANON_KEY")

if not url or not key:
    raise EnvironmentError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file")

logger = logging.getLogger(__name__)

def get_supabase_client() -> Client:
    """Creates and returns a Supabase client instance."""
    try:
        client: Client = create_client(url, key)
        return client
    except Exception as e:
        logger.error(f"Error creating Supabase client: {e}")
        raise

async def fetch_digests(client: Client) -> list[dict]:
    """Fetches digests from Supabase ordered by date (newest first).

    Args:
        client: The Supabase client instance.
        limit: Optional maximum number of digests to return.

    Returns:
        A list of dictionaries where each dictionary represents a row in the
        `digests` table.
    """
    try:
        response: APIResponse = client.table('digests').select('*').execute()

        if not response.data:
             # Handle cases where data might be empty vs actual error if needed
            if hasattr(response, 'error') and response.error:
                 print(f"Error fetching digests: {response.error}")
                 return [] # Or raise an exception
            return [] # No error, just no data

        logger.info(f"Successfully fetched {len(response.data)} digests from Supabase.")
        return response.data
    except Exception as e:
        logger.error(f"An unexpected error occurred during digest fetch: {e}", exc_info=True)
        return []

async def insert_data(client: Client, data: dict) -> dict | None:
    """Inserts a new row into the specified table.

    Args:
        client: The Supabase client instance.
        table_name: The name of the table to insert data into.
        data: A dictionary representing the data to insert.

    Returns:
        The inserted data if successful, None otherwise.
    """
    try:
        response: APIResponse = await client.table('digests').insert(data).execute()

        if response.data:
            logger.info(f"Successfully inserted data into digests: {response.data[0]}")
            return response.data[0]
        elif hasattr(response, 'error') and response.error:
            logger.error(f"Error inserting data into digests: {response.error.message if response.error else 'Unknown error'}")
            return None
        else:
            logger.warning(f"No data returned after insert operation into digests, but no explicit error reported.")
            return None
    except Exception as e:
        logger.error(f"An unexpected error occurred during insert operation into digests: {e}", exc_info=True)
        return None
