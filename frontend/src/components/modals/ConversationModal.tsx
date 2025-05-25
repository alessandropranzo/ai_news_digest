import React, { useEffect } from "react";

interface ConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  digestId?: number;
}

const ConversationModal: React.FC<ConversationModalProps> = ({
  isOpen,
  onClose,
  agentId,
  digestId,
}) => {
  useEffect(() => {
    if (isOpen && agentId && digestId !== undefined) {
      const startConversation = async () => {
        try {
          const response = await fetch("/api/agents", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ agent_id: agentId, id_digest: digestId }),
          });
          if (!response.ok) {
            console.error(
              "Failed to start conversation:",
              await response.text()
            );
            // Optionally, update UI to show an error to the user
          } else {
            console.log(
              "Conversation started successfully for digest:",
              digestId
            );
            // Backend handles the long-running conversation task
          }
        } catch (error) {
          console.error("Error starting conversation:", error);
          // Optionally, update UI to show an error to the user
        }
      };

      startConversation();
    }
  }, [isOpen, agentId, digestId]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-background p-6 rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Conversation Agent</h2>
          <button
            onClick={onClose}
            className="text-foreground/70 hover:text-red-500"
            aria-label="Close conversation modal"
          >
            &times;
          </button>
        </div>
        <div>
          <elevenlabs-convai agent-id={agentId}></elevenlabs-convai>
          <script
            src="https://elevenlabs.io/convai-widget/index.js"
            async
            type="text/javascript"
          ></script>
          {/* The script will be loaded in the main HTML or via a useEffect hook if preferred */}
        </div>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationModal;
