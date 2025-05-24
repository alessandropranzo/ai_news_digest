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

async def fetch_digests(client: Client, limit: int | None = None) -> list[dict]:
    """Fetches digests from Supabase ordered by date (newest first).

    Args:
        client: The Supabase client instance.
        limit: Optional maximum number of digests to return.

    Returns:
        A list of dictionaries where each dictionary represents a row in the
        `digests` table.
    """
    try:
        query = client.table("digests").select("*")
        if limit:
            query = query.limit(limit)

        response: APIResponse = query.execute()

        if not response.data:
            if hasattr(response, 'error') and response.error:
                logger.error(f"Error fetching digests from Supabase: {response.error}")
                return []
            logger.info("No digests found in Supabase for the given query.")
            return []

        logger.info(f"Successfully fetched {len(response.data)} digests from Supabase.")
        return response.data
    except Exception as e:
        logger.error(f"An unexpected error occurred during digest fetch: {e}", exc_info=True)
        return []
