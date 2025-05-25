# 🗞️ My Journalist – Curated Digests from Your Preferred Sources

Welcome to **My Journalist** – your AI-powered news digest, tailored from the sources you trust.

# ⚙️ Setup

> *If you run into any issues, don’t hesitate to reach out to us!*

## 🔐 API Keys
- Copy the `.env.example` file and rename it to `.env`.
- Open `.env` and insert your API keys where indicated.

## 🧠 Backend Requirements

- `Python >= 3.11`
- Install `ffmpeg` (for audio processing)
    - `pip install ffmpeg` never worked for us. Depending on your platform, install `ffmpeg` using one of the following:
        - Homebrew (macOS/Linus): `brew install ffmpeg`
        - Conda (cross-platform): `conda install -c conda-forge ffmpeg`

        To verify installation, run this Python snippet:
        ```python
        from pydub import AudioSegment, utils
        print("ffmpeg ->", utils.which("ffmpeg"))
        print("ffprobe ->", utils.which("ffprobe"))
        ```
        If you see a valid path for both ffmpeg and ffprobe, you're good to go. If you see None, installation likely failed.

- Install dependencies with 
```bash
pip install -r requirements.txt
``` 

## 🎨 Frontend
- TODO

# Tech Stack





