import os
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse
import logging

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()

# Define the path to your data directory, relative to this podcast.py file
# podcast.py is in backend/app/api/, data is in backend/app/data/
# So, we go up one level (to backend/app/) and then into data/
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data'))

@router.get("/audio/{filename}", tags=["Podcast Data"], response_class=FileResponse)
async def get_audio_file(filename: str):
    """
    Serves an audio file from the data directory.
    
    - **filename**: The name of the audio file (e.g., `podcast_XYZ.mp3`)
    """
    try:
        file_path = os.path.join(DATA_DIR, filename)

        # Security check: Ensure the path is still within the DATA_DIR
        if not os.path.abspath(file_path).startswith(DATA_DIR):
            logger.warning(f"Attempt to access file outside of data directory: {filename}")
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

        if os.path.isfile(file_path):
            media_type = "audio/mpeg" # Default for mp3
            if filename.lower().endswith(".wav"):
                media_type = "audio/wav"
            elif filename.lower().endswith(".ogg"):
                media_type = "audio/ogg"
            # Add more types if needed for other audio formats
            
            return FileResponse(path=file_path, media_type=media_type, filename=filename)
        else:
            logger.info(f"Audio file not found: {filename} at path {file_path}")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audio file not found")
    except HTTPException: # Re-raise HTTPException directly to preserve status code and details
        raise
    except Exception as e:
        logger.error(f"Error serving audio file {filename}: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.get("/transcripts/{filename}", tags=["Podcast Data"], response_class=FileResponse)
async def get_transcript_file(filename: str):
    """
    Serves a transcript file from the data directory.

    - **filename**: The name of the transcript file (e.g., `transcript_ABC.txt`)
    """
    try:
        file_path = os.path.join(DATA_DIR, filename)

        if not os.path.abspath(file_path).startswith(DATA_DIR):
            logger.warning(f"Attempt to access transcript outside of data directory: {filename}")
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

        if os.path.isfile(file_path) and filename.lower().endswith(".txt"):
            return FileResponse(path=file_path, media_type="text/plain", filename=filename)
        else:
            logger.info(f"Transcript file not found or invalid: {filename} at path {file_path}")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transcript file not found or not a .txt file")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error serving transcript file {filename}: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

# You would add a similar endpoint for transcripts here if needed in this file
# For example:
# @router.get("/transcripts/{filename}", tags=["Podcast Data"], response_class=FileResponse)
# async def get_transcript_file(filename: str):
#     # ... similar logic for serving .txt files from DATA_DIR ...
#     # Remember to set media_type="text/plain"
#     pass
