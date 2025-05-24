from fastapi import FastAPI

app = FastAPI(title="AI News Digest API")


@app.get("/", tags=["root"])
async def read_root():
    """Health check endpoint returning a welcome message."""
    return {"message": "Welcome to AI News Digest API"}


if __name__ == "__main__":
    import uvicorn

    # Run the app with live-reload for development convenience
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
