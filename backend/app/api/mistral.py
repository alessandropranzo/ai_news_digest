import os
from mistralai import Mistral
from dotenv import load_dotenv

load_dotenv()
api_key = os.environ["MISTRAL_API_KEY"]
print(api_key)
model = "mistral-large-latest"

client = Mistral(api_key=api_key)

def get_llm_response(message):
    chat_response = client.chat.complete(
        model= model,
        messages = [
            {
                "role": "user",
                "content": message
            },
        ]
    )
    return chat_response.choices[0].message.content
