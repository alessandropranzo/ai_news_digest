from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel, Field
from supabase import Client
import logging

from app.services.supabase_client import get_supabase_client, fetch_digests


class Digest(BaseModel):
    id_digests: int = Field(..., alias="id_digests")
    created_at: str
    digest_number: Optional[int] = None
    title: Optional[str] = None
    short_description: Optional[str] = None
    content: Optional[str] = None
    date: Optional[str] = None
    sources: Optional[dict] = None
    podcast: Optional[str] = None
    user_query: Optional[str] = None
    user_topics: Optional[str] = None
    user_other_preferences: Optional[str] = None

    class Config:
        populate_by_name = True


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/digests", tags=["digests"])


@router.get("", response_model=List[Digest])
async def get_digests(
    limit: Optional[int] = Query(default=None, ge=1),
    supabase_client: Client = Depends(get_supabase_client)
):
    """Return a list of digests ordered by newest first.

    Args:
        limit: Optional limit of how many digests to return.
    """
    logger.info(f"Received request to get digests. Limit: {limit}")
    try:
        digests_data = await fetch_digests(client=supabase_client, limit=limit)
        logger.info(f"Successfully retrieved {len(digests_data)} digests.")
        return digests_data
    except Exception as e:
        logger.error(f"Error fetching digests: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error fetching digests")
