import React from "react";

interface ConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
}

const ConversationModal: React.FC<ConversationModalProps> = ({
  isOpen,
  onClose,
  agentId,
}) => {
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
