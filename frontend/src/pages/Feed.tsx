import React, { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import DigestSettingsModal from "@/components/modals/DigestSettingsModal";
import { fetchDigests } from "@/api/apiClient";
import type { Digest } from "@/types/digest";

interface FeedDigest extends Digest {
  // Front-end helper properties if needed in the future
  audioUrl?: string; // placeholder until you store podcast URL in DB
}

const Feed = () => {
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [digests, setDigests] = useState<FeedDigest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
                <div className="flex-1 bg-muted/20 backdrop-blur-sm border border-border/30 rounded-lg p-6 shadow-lg hover:shadow-emerald-500/10 transition-shadow duration-300">
                  <h2 className="text-lg font-semibold mb-2">
                    Digest #{total - index}: {digest.title}
                  </h2>
                  <p className="text-foreground/80 whitespace-pre-line">
                    {digest.short_description ?? digest.content}
                  </p>
                </div>

                {/* Play Button */}
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full shrink-0 bg-gradient-to-r from-emerald-600 to-chloris-blue text-white hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
                  aria-label="Play digest audio"
                  onClick={() => handlePlay(digest)}
                >
                  <Play className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Feed;
