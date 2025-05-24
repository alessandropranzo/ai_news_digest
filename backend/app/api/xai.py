import os
import requests
from datetime import datetime, timedelta
from prompts import X_AI_PROMPT
from dotenv import load_dotenv

load_dotenv()

def get_yesterday_iso8601():
    yesterday = datetime.now() - timedelta(days=1)
    return yesterday.strftime("%Y-%m-%d")

def get_xai_response(digest_sources):
    url = "https://api.x.ai/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.getenv('XAI_API_KEY')}"
    }
    prompt = X_AI_PROMPT.format(topics=digest_sources["topics"], user_format_preference=digest_sources["user_format_preference"])
    print(prompt)
    payload = {
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "search_parameters": {
            "mode": "auto",
            "return_citations": True,
            "from_date": get_yesterday_iso8601(),
            "sources": digest_sources["sources"],
        },
        "model": "grok-3-latest",
    }

    response = requests.post(url, headers=headers, json=payload)
    return response.json()