from typing import List, Optional, Any, Union
from datetime import datetime
import json

from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel, Field
from supabase import Client
import logging

from app.services.supabase_client import get_supabase_client, fetch_digests, insert_data
from app.api.xai import get_xai_response

# Pydantic models for source types, mirroring frontend/src/types/digest.ts
class PydanticOutputWebNewsSource(BaseModel):
    type: str
    country: Optional[str] = None
    exclude_websites: Optional[List[str]] = None

class PydanticOutputXSource(BaseModel):
    type: str
    x_handles: Optional[List[str]] = None

class CreateDigestPayload(BaseModel):
    user_topics: Optional[str] = None
    user_format_preference: Optional[str] = None
    sources: Optional[List[Union[PydanticOutputWebNewsSource, PydanticOutputXSource]]] = None

class Digest(BaseModel):
    id_digests: int = Field(..., alias="id_digests")
    created_at: str
    digest_number: Optional[int] = None
    title: Optional[str] = None
    short_description: Optional[str] = None
    content: Optional[str] = None
    date: Optional[str] = None
    sources: Optional[List[Union[PydanticOutputWebNewsSource, PydanticOutputXSource]]] = None
    podcast: Optional[str] = None
    user_query: Optional[str] = None
    user_topics: Optional[str] = None
    user_format_preference: Optional[str] = None

    class Config:
        populate_by_name = True

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/digests", tags=["digests"])

@router.post("/create", response_model=Digest, status_code=201)
def create_digest_endpoint(
    payload: CreateDigestPayload,
    supabase_client: Client = Depends(get_supabase_client)
):
    """Create a new digest by processing user preferences with XAI and saving to Supabase."""
    try:
        logger.info(f"Received payload for new digest: {payload.model_dump_json(indent=2)}")

        xai_input_data = {
            "user_topics": payload.user_topics,
            "user_format_preference": payload.user_format_preference,
            "sources": [s.model_dump(exclude_none=True) for s in payload.sources] if payload.sources else []
        }
        logger.info(f"Data prepared for XAI: {xai_input_data}")

        xai_result_json = get_xai_response(xai_input_data) # This is a synchronous call
        logger.info(f"Raw XAI response: {xai_result_json}")

        title = "Culo Bello"
        summary = "Mi piace il culo così tanto che lo annuso anche con tutta la merda, perche le francesi non se lo lavano dato che non hanno il bidet"
        content_from_xai = xai_result_json['choices'][0]["message"]["content"]

        # if xai_result_json and xai_result_json.get('choices') and len(xai_result_json['choices']) > 0:
        #     message = xai_result_json['choices'][0].get('message')
        #     if message and message.get('content'):
        #         xai_content_str = message['content']
        #         logger.info(f"XAI message content string: {xai_content_str}")
        #         try:
        #             parsed_xai_content = json.loads(xai_content_str)
        #             if isinstance(parsed_xai_content, dict):
        #                 # Extract title, summary, content if available, otherwise use defaults
        #                 title = "culo"
        #                 summary = "culohhh"
        #                 content_from_xai = parsed_xai_content # Default to full string if 'content' key not in dict
        #                 logger.info(f"Attempted to parse XAI content as JSON dictionary. Title='{title}', Summary='{summary}'")
        #             else:
        #                 # Parsed JSON is not a dictionary, treat as simple string content
        #                 logger.info("XAI content parsed as JSON, but not a dictionary. Using raw string as main content.")
        #                 content_from_xai = parsed_xai_content
        #         except json.JSONDecodeError:
        #             logger.warning(f"Failed to parse XAI content as JSON. Using raw string as content: {xai_content_str}")
        #             content_from_xai = parsed_xai_content
        #         except Exception as e: # Catch other potential errors during parsing or .get calls
        #             logger.error(f"Error processing XAI content: {e}. Using raw string as content: {xai_content_str}")
        #             content_from_xai = parsed_xai_content
                
        #         # Consolidate title generation: if title is still default and topics exist
        #         if title == "Untitled Digest" and payload.user_topics:
        #             title = f"Digest on: {payload.user_topics}"
        #     else:
        #         logger.warning("XAI response did not contain expected message.content structure.")
        # else:
        #     logger.warning("XAI response did not contain choices or was empty.")

        data_to_insert = {
            "user_topics": payload.user_topics,
            "user_format_preference": payload.user_format_preference,
            "sources": [s.model_dump(exclude_none=True) for s in payload.sources] if payload.sources else [],
            "title": title,
            "short_description": summary,
            "content": content_from_xai,
            "date": datetime.now().isoformat(),
        }
        logger.info(f"Data to insert into Supabase: {data_to_insert}")

        inserted_row = insert_data(client=supabase_client, data=data_to_insert)

        if not inserted_row:
            logger.error("Failed to insert digest data into Supabase.")
            raise HTTPException(status_code=500, detail="Failed to save digest data.")

        logger.info(f"Successfully inserted digest: {inserted_row}")
        
        # Ensure all fields required by Digest model are present in inserted_row
        # or provide defaults if they can be missing from Supabase response.
        # Pydantic will raise an error if required fields (id_digests, created_at) are missing.
        # response_digest = Digest(**inserted_row)
        return inserted_row

    except HTTPException as he:
        logger.error(f"HTTP Exception in create_digest_endpoint: {he.detail}", exc_info=True)
        raise he
    except Exception as e:
        logger.error(f"Unexpected error in create_digest_endpoint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("", response_model=List[Digest])
async def get_digests(
    supabase_client: Client = Depends(get_supabase_client)
):
    """Return a list of digests ordered by newest first.

    Args:
        limit: Optional limit of how many digests to return.
    """
    try:
        digests_data = await fetch_digests(client=supabase_client)
        logger.info(f"Successfully retrieved {len(digests_data)} digests.")
        return digests_data
    except Exception as e:
        logger.error(f"Error fetching digests: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error fetching digests")
