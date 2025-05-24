import React, { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Digest {
  id: number;
  date: string; // ISO string
  title: string;
  text: string;
  audioUrl?: string;
}

const mockDigests: Digest[] = [
  {
    id: 1,
    date: "2025-05-28",
    title: "AI & Climate: Breakthrough in Solar Forecasting",
    text: "Researchers unveiled a novel AI model that improves solar irradiance predictions by 20%, promising better grid stability and renewable integration.",
    audioUrl: "#",
  },
  {
    id: 2,
    date: "2025-05-27",
    title: "Green Hydrogen Gains Momentum",
    text: "Major utilities in Europe announced a joint venture to scale green hydrogen production, aiming to reduce industrial emissions by 15% within five years.",
    audioUrl: "#",
  },
  // Add more items or fetch from your backend later
];

const Feed = () => {
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );

  const handlePlay = (digest: Digest) => {
    // Stop any currently playing audio
    currentAudio?.pause();

    if (!digest.audioUrl || digest.audioUrl === "#") {
      console.info("No audio available yet for digest", digest.id);
      return;
    }

    const audio = new Audio(digest.audioUrl);
    audio.play();
    setCurrentAudio(audio);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground pt-20 pb-12">
      <main className="container mx-auto px-4 flex-1">
        <h1 className="text-3xl font-bold mb-10">Daily Digests</h1>
        <div className="relative border-l-2 border-border/20 pl-8">
          {mockDigests.map((digest, index) => (
            <div key={digest.id} className="relative mb-12">
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
                    Digest #{mockDigests.length - index}: {digest.title}
                  </h2>
                  <p className="text-foreground/80 whitespace-pre-line">
                    {digest.text}
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
