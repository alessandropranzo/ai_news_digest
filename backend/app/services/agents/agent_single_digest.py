import os
import signal
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation, ConversationInitiationData
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface

from dotenv import load_dotenv
load_dotenv()

agent_id = 'agent_01jw19sps2fewsg3g3bqbpmd8y'
api_key = os.getenv('ELEVENLABS_API_KEY')

dynamical_vars = {
    "id_digest": 3
}

def start_conversation_single_digest(dynamical_vars: dict) -> None:

    elevenlabs = ElevenLabs(api_key=api_key)

    config = ConversationInitiationData(
        dynamic_variables=dynamical_vars
    )
    conversation = Conversation(
        elevenlabs,
        agent_id,
        config=config,
        requires_auth=True,
        audio_interface=DefaultAudioInterface(),

        callback_agent_response=lambda response: print(f"Agent: {response}"),
        callback_agent_response_correction=lambda original, corrected: print(f"Agent: {original} -> {corrected}"),
        callback_user_transcript=lambda transcript: print(f"User: {transcript}"),
    )

    conversation.start_session()
    signal.signal(signal.SIGINT, lambda sig, frame: conversation.end_session())
    signal.pause()

start_conversation_single_digest(dynamical_vars)