import os
import signal
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation, ConversationInitiationData
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface

from dotenv import load_dotenv
load_dotenv()

# This is the hardcoded agent ID
HARDCODED_AGENT_ID = 'agent_01jw19sps2fewsg3g3bqbpmd8y'
api_key = os.getenv('ELEVENLABS_API_KEY')

# dynamical_vars = {
#     "id_digest": 20
# } # This will now be passed as a parameter
# print(api_key) # Can be removed or kept for debugging if needed


def start_conversation_single_digest(agent_id_param: str, dynamical_vars_param: dict) -> None:
    # The agent_id_param is received but HARDCODED_AGENT_ID will be used for the conversation.
    # You could still use agent_id_param for logging or other non-critical purposes if needed.
    print(f"Starting conversation for (requested agent_id: {agent_id_param}, using hardcoded: {HARDCODED_AGENT_ID}) with digest_id: {dynamical_vars_param.get('id_digest')}")
    if not api_key:
        print("ELEVENLABS_API_KEY not found. Please set it in your .env file.")
        return
    
    elevenlabs = ElevenLabs(api_key=api_key)

    config = ConversationInitiationData(
        dynamic_variables=dynamical_vars_param
    )
    try:
        conversation = Conversation(
            elevenlabs,
            HARDCODED_AGENT_ID, # Use the hardcoded agent_id
            config=config,
            requires_auth=True,
            audio_interface=DefaultAudioInterface(),

            callback_agent_response=lambda response: print(f"Agent: {response}"),
            callback_agent_response_correction=lambda original, corrected: print(f"Agent: {original} -> {corrected}"),
            callback_user_transcript=lambda transcript: print(f"User: {transcript}"),
        )

        conversation.start_session()
        # Set up a signal handler for graceful shutdown (e.g., on Ctrl+C)
        # Note: This signal handling might behave differently when run in a background task by FastAPI.
        # For long-running tasks, consider more robust job management or IPC if direct signal handling is problematic.
        # def signal_handler(sig, frame):
        #     print("Signal received, ending conversation session...")
        #     conversation.end_session()
        #     print("Conversation session ended.")
        # signal.signal(signal.SIGINT, signal_handler)
        # signal.signal(signal.SIGTERM, signal_handler)
        
        # Keep the function alive while the conversation is active.
        # The conversation.start_session() might be blocking or might run in its own thread.
        # If it's blocking, it will keep this function alive.
        # If it's non-blocking, you might need a way to keep this background task alive
        # or monitor the conversation's state.
        # For now, assuming start_session() handles its lifecycle or is blocking.

    except Exception as e:
        print(f"Error during conversation setup or execution: {e}")


if __name__ == "__main__":
    # Example usage for direct script execution (testing)
    test_agent_id = 'agent_01jw19sps2fewsg3g3bqbpmd8y' # Example agent ID
    test_dynamical_vars = {"id_digest": 25}
    print(f"Testing start_conversation_single_digest with Agent ID: {test_agent_id} and Digest ID: {test_dynamical_vars['id_digest']}")
    start_conversation_single_digest(test_agent_id, test_dynamical_vars)

