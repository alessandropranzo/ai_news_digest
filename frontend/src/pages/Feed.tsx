import React, { useState, useEffect } from "react";
import {
  Play,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Speaker,
  Voicemail,
  PersonStandingIcon,
  Speech,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DigestSettingsModal from "@/components/modals/DigestSettingsModal";
import { fetchDigests } from "@/api/apiClient";
import type { Digest } from "@/types/digest";

interface FeedDigest extends Digest {
  // Front-end helper properties if needed in the future
  audioUrl?: string; // placeholder until you store podcast URL in DB
  contentHtml?: string; // Added for server-rendered HTML
}

const Feed = () => {
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [digests, setDigests] = useState<FeedDigest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedDigests, setExpandedDigests] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    const loadDigests = async () => {
      try {
        setLoading(true);
        const data = await fetchDigests();
        // Ensure newest first (backend already does, but double-check)
        data.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
        const enhanced = data.map((d) => ({
          ...d,
          audioUrl: d.podcast ?? "#", // placeholder until real URL is available
        }));
        setDigests(enhanced);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadDigests();
  }, []);

  const handlePlay = (digest: FeedDigest) => {
    // Stop any currently playing audio
    currentAudio?.pause();

    if (!digest.audioUrl || digest.audioUrl === "#") {
      console.info("No audio available yet for digest", digest.id_digests);
      return;
    }

    const audio = new Audio(digest.audioUrl);
    audio.play();
    setCurrentAudio(audio);
  };

  const toggleExpand = (digestId: number) => {
    setExpandedDigests((prev) => ({
      ...prev,
      [digestId]: !prev[digestId],
    }));
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const total = digests.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading digests…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground pt-20 pb-12">
      <main className="container mx-auto px-4 flex-1">
        <DigestSettingsModal />
        <div className="relative border-l-2 border-border/20 pl-8">
          {digests.map((digest, index) => (
            <div key={digest.id_digests} className="relative mb-12">
              {/* Timeline node */}
              <span className="absolute -left-[9px] top-2 w-3 h-3 rounded-full bg-emerald-500" />
              {/* Date label */}
              <div className="absolute -left-24 top-1 text-sm font-medium select-none">
                {formatDate(digest.date)}
              </div>

              <div className="flex items-start gap-4">
                {/* Digest Card */}
                <div className="flex-1 bg-muted/20 backdrop-blur-sm border border-border/30 rounded-lg p-6 shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 ease-in-out flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-semibold">
                      Digest #{total - index}: {digest.title}
                    </h2>
                    {/* Wrapper for right-aligned buttons */}
                    <div className="flex items-center">
                      {/* More subtle expand button, part of the header now */}
                      <Button
                        variant="ghost" // Changed to ghost for subtlety
                        size="icon" // Changed to icon size
                        onClick={() => toggleExpand(digest.id_digests)}
                        className="text-foreground/70 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-full" // Removed negative margins
                        aria-label={
                          expandedDigests[digest.id_digests]
                            ? "Collapse digest"
                            : "Expand digest"
                        }
                      >
                        {expandedDigests[digest.id_digests] ? (
                          <Minimize2 className="w-5 h-5" />
                        ) : (
                          <Maximize2 className="w-5 h-5" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost" // Changed to ghost for consistency
                        className="text-foreground/70 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-full ml-1" // Added margin-left for spacing
                        aria-label="Play digest audio"
                        onClick={() => handlePlay(digest)}
                      >
                        <Play className="w-5 h-5" />
                      </Button>
                      {/* Voice Button - Styled for header */}
                      <Button
                        size="icon"
                        variant="ghost" // Changed to ghost for consistency
                        className="text-foreground/70 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-full ml-1" // Added margin-left for spacing
                        aria-label="Play digest audio"
                        onClick={() => handlePlay(digest)}
                      >
                        <Speech className="w-5 h-5" />
                      </Button>
                      {/* Play Button - Styled for header */}
                      
                    </div>
                  </div>

                  {expandedDigests[digest.id_digests] && digest.contentHtml && (
                    <div className="mt-4 pt-4 border-t border-border/20 animate-fadeIn">
                      <h3 className="text-md font-semibold mb-2 text-emerald-400">
                        Full Report:
                      </h3>
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none text-foreground/70 whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: digest.contentHtml }}
                      />
                    </div>
                  )}

                  {/* Removed the old expand button location. It's now in the card header. */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Feed;
