from typing import List, Optional, Any, Union
from datetime import datetime
import json
import markdown2
import bleach

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
    contentHtml: Optional[str] = None

    class Config:
        populate_by_name = True

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/digests", tags=["digests"])

# Define allowed HTML tags and attributes for bleach
ALLOWED_TAGS_EXTENDED = bleach.ALLOWED_TAGS | {
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr', 'pre', 'img', 'figure', 'figcaption',
    'span', 'div', 'strong', 'em', 'blockquote', 'ul', 'ol', 'li', 'code',
    'table', 'thead', 'tbody', 'tr', 'th', 'td'
}
ALLOWED_ATTRIBUTES_EXTENDED = {
    **bleach.ALLOWED_ATTRIBUTES,
    'img': ['src', 'alt', 'title'],
    'pre': ['class'], # for syntax highlighting
    'code': ['class'], # for inline code or syntax highlighting
    '*': ['id'], # allow id on any tag for linking/anchors
    'table': ['summary'],
    'th': ['scope'],
    'td': ['headers']
}

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

        title = "test"
        summary = "test"
        content_from_xai = xai_result_json['choices'][0]["message"]["content"]
        logger.info(f"Raw content_from_xai (type: {type(content_from_xai)}): {content_from_xai[:500]}...")

        # Prepare the base data for insertion first
        data_to_insert = {
            "user_topics": payload.user_topics,
            "user_format_preference": payload.user_format_preference,
            "sources": [s.model_dump(exclude_none=True) for s in payload.sources] if payload.sources else [],
            "title": title,
            "short_description": summary,
            "content": content_from_xai, # Store raw markdown
            "date": datetime.now().isoformat(),
            "contentHtml": None # Initialize to None, will be updated below
        }

        # Convert content to HTML and sanitize it, then update data_to_insert
        if content_from_xai:
            logger.info("Entering content_from_xai block for HTML generation.")
            html_output = markdown2.markdown(content_from_xai, extras=["tables", "fenced-code-blocks", "strike", "nofollow"])
            logger.info(f"html_output from markdown2 (type: {type(html_output)}): {str(html_output)[:500]}...")
            
            sanitized_html = bleach.clean(
                html_output,
                tags=ALLOWED_TAGS_EXTENDED,
                attributes=ALLOWED_ATTRIBUTES_EXTENDED,
                strip=True
            )
            logger.info(f"sanitized_html from bleach (type: {type(sanitized_html)}): {str(sanitized_html)[:500]}...")
            data_to_insert["contentHtml"] = sanitized_html # Update the dictionary
        else:
            logger.info("Skipped HTML generation because content_from_xai was falsy.")
            # data_to_insert["contentHtml"] remains None as initialized

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

        processed_digests = []
        for digest_dict in digests_data:
            raw_markdown = digest_dict.get("content")
            if raw_markdown:
                html_output = markdown2.markdown(raw_markdown, extras=["tables", "fenced-code-blocks", "strike", "nofollow"])
                sanitized_html = bleach.clean(
                    html_output,
                    tags=ALLOWED_TAGS_EXTENDED,
                    attributes=ALLOWED_ATTRIBUTES_EXTENDED,
                    strip=True # Remove disallowed tags completely
                )
                digest_dict["contentHtml"] = sanitized_html
            else:
                digest_dict["contentHtml"] = None # Ensure the field exists even if content is null
            processed_digests.append(Digest(**digest_dict)) # Validate and cast to Pydantic model

        return processed_digests
    except Exception as e:
        logger.error(f"Error fetching digests: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error fetching digests")
