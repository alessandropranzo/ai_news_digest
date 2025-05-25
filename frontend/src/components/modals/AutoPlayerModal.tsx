import React, { useEffect, useState } from "react";

interface AudioPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  audioSrc?: string;
  transcriptUrl?: string;
}

const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({
  isOpen,
  onClose,
  audioSrc,
  transcriptUrl,
}) => {
  const [transcriptContent, setTranscriptContent] = useState<string | null>(
    null
  );
  const [isLoadingTranscript, setIsLoadingTranscript] =
    useState<boolean>(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && transcriptUrl) {
      setIsLoadingTranscript(true);
      setTranscriptError(null);
      setTranscriptContent(null);

      fetch(transcriptUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to fetch transcript: ${response.status} ${response.statusText}`
            );
          }
          return response.text();
        })
        .then((text) => {
          setTranscriptContent(text);
        })
        .catch((err) => {
          console.error("Error fetching transcript:", err);
          setTranscriptError(err.message);
        })
        .finally(() => {
          setIsLoadingTranscript(false);
        });
    } else {
      setTranscriptContent(null);
      setTranscriptError(null);
      setIsLoadingTranscript(false);
    }
  }, [isOpen, transcriptUrl]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
      <div className="bg-background p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Audio Player</h2>
          <button
            onClick={onClose}
            className="text-foreground/70 hover:text-red-500"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="flex-grow overflow-y-auto space-y-4">
          {audioSrc && audioSrc !== "#" && (
            <div>
              <h3 className="text-lg font-medium mb-2">Playback</h3>
              <audio src={audioSrc} controls autoPlay className="w-full" />
            </div>
          )}
          {audioSrc === "#" && (
            <p className="text-sm text-foreground/70">
              No audio available for this item.
            </p>
          )}

          {transcriptUrl && (
            <div>
              <h3 className="text-lg font-medium mb-2">Transcript</h3>
              {isLoadingTranscript && <p>Loading transcript...</p>}
              {transcriptError && (
                <p className="text-red-500">
                  Error loading transcript: {transcriptError}
                </p>
              )}
              {transcriptContent && (
                <div className="bg-muted/50 p-3 rounded-md max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-foreground/90 text-left">
                    {transcriptContent}
                  </pre>
                </div>
              )}
              {!isLoadingTranscript &&
                !transcriptError &&
                !transcriptContent && (
                  <p className="text-sm text-foreground/70">
                    No transcript available or not loaded yet.
                  </p>
                )}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
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

export default AudioPlayerModal;
