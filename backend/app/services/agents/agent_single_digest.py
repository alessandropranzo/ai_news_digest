import os
import signal
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation, ConversationInitiationData
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface

from dotenv import load_dotenv
load_dotenv()

def client_init(agent_id_name: str, api_key_name: str) -> tuple:

    agent_id = 'agent_01jw19sps2fewsg3g3bqbpmd8y'
    api_key = os.getenv(api_key_name)
    elevenlabs = ElevenLabs(api_key=api_key)

    return elevenlabs, agent_id

def conversation_init(elevenlabs: ElevenLabs, agent_id: str, dynamical_vars: dict) -> Conversation:
    config = ConversationInitiationData(
        dynamic_variables=dynamical_vars
    )
    conversation = Conversation(
        elevenlabs,
        agent_id,
        config=config,
        audio_interface=DefaultAudioInterface(),

        callback_agent_response=lambda response: print(f"Agent: {response}"),
        callback_agent_response_correction=lambda original, corrected: print(f"Agent: {original} -> {corrected}"),
        callback_user_transcript=lambda transcript: print(f"User: {transcript}"),
    )

    return conversation

def conversation(agent_id_name: str, api_key_name: str, dynamical_vars: dict):

    elevenlabs, agent_id = client_init(agent_id_name, api_key_name)
    conversation = conversation_init(elevenlabs, agent_id, dynamical_vars)

    conversation.start_session()
    signal.signal(signal.SIGINT, lambda sig, frame: conversation.end_session())