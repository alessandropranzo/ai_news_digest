from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from app.api.digests import router as digests_router

app = FastAPI(title="AI News Digest API")

# Enable CORS for dev. Adjust origins as needed for production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers under /api prefix
app.include_router(digests_router, prefix="/api")


@app.get("/", tags=["root"])
async def read_root():
    """Health check endpoint returning a welcome message."""
    return {"message": "Welcome to AI News Digest API"}


if __name__ == "__main__":
    import uvicorn

    # Run the app with live-reload for development convenience
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
