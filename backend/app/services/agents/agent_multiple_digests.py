import os
import signal
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation, ConversationInitiationData
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface

from dotenv import load_dotenv
load_dotenv()

agent_id = 'agent_01jw35p30ffgy9ydkkw3ky3r6m'
api_key = os.getenv('ELEVENLABS_API_KEY')


def start_conversation_multiple_digests() -> None:

    elevenlabs = ElevenLabs(api_key=api_key)

    conversation = Conversation(
        elevenlabs,
        agent_id,
        requires_auth=True,
        audio_interface=DefaultAudioInterface(),

        callback_agent_response=lambda response: print(f"Agent: {response}"),
        callback_agent_response_correction=lambda original, corrected: print(f"Agent: {original} -> {corrected}"),
        callback_user_transcript=lambda transcript: print(f"User: {transcript}"),
    )

    conversation.start_session()
    signal.signal(signal.SIGINT, lambda sig, frame: conversation.end_session())
    signal.pause()

start_conversation_multiple_digests()