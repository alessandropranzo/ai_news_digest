from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
import logging
import sys
import os

# Add the parent directory of 'app' to sys.path to allow for absolute imports
# This assumes 'agents.py' is in 'backend/app/api/' and 'services' is in 'backend/app/'
current_dir = os.path.dirname(os.path.abspath(__file__))
app_dir = os.path.dirname(current_dir) # This should be 'backend/app/api' -> 'backend/app'
project_backend_dir = os.path.dirname(app_dir) # This should be 'backend/app' -> 'backend'
sys.path.append(project_backend_dir)


from app.services.agents.agent_single_digest import start_conversation_single_digest

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

class ConversationRequest(BaseModel):
    agent_id: str
    id_digest: int

@app.post("/api/agents")
async def start_conversation_endpoint(
    request: ConversationRequest, background_tasks: BackgroundTasks
):
    logger.info(
        f"Received request to start conversation with agent_id: {request.agent_id} for digest_id: {request.id_digest}"
    )
    
    dynamical_vars = {"id_digest": request.id_digest}

    # Run the potentially long-running function in the background
    background_tasks.add_task(
        start_conversation_single_digest, 
        agent_id_param=request.agent_id, 
        dynamical_vars_param=dynamical_vars
    )

    return {
        "message": "Conversation process started in the background.",
        "agent_id": request.agent_id,
        "id_digest": request.id_digest,
    }

# To run this FastAPI app (if it's the main module, e.g., for local testing):
# uvicorn backend.app.api.agents:app --reload --port 8001 
# (assuming you are in the root of your project, and your file is at backend/app/api/agents.py)
# Ensure your PYTHONPATH is set up correctly if running from a different directory,
# or if you have a more complex project structure.

if __name__ == "__main__":
    # This is for local testing/debugging if you run this file directly.
    # In a production setup, you'd use Uvicorn or similar ASGI server.
    import uvicorn
    logger.info("Starting FastAPI server for local testing on port 8001...")
    uvicorn.run(app, host="0.0.0.0", port=8001)
