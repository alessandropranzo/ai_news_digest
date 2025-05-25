import os
import signal
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation, ConversationInitiationData
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface

from dotenv import load_dotenv
load_dotenv()

def client_init(agent_id_name: str, api_key_name: str) -> tuple:

    agent_id = 'agent_01jw35p30ffgy9ydkkw3ky3r6m'
    api_key = os.getenv(api_key_name)
    elevenlabs = ElevenLabs(api_key=api_key)

    return elevenlabs, agent_id

def conversation_init(elevenlabs: ElevenLabs, agent_id: str) -> Conversation:

    conversation = Conversation(
        elevenlabs,
        agent_id,
        audio_interface=DefaultAudioInterface(),

        callback_agent_response=lambda response: print(f"Agent: {response}"),
        callback_agent_response_correction=lambda original, corrected: print(f"Agent: {original} -> {corrected}"),
        callback_user_transcript=lambda transcript: print(f"User: {transcript}"),
    )

    return conversation

def conversation(agent_id_name: str, api_key_name: str):

    elevenlabs, agent_id = client_init(agent_id_name, api_key_name)
    conversation = conversation_init(elevenlabs, agent_id)

    conversation.start_session()
    signal.signal(signal.SIGINT, lambda sig, frame: conversation.end_session())