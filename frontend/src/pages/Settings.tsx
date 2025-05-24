import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const AVAILABLE_TOPICS = [
  "AI",
  "Sports",
  "Politics",
  "Technology",
  "Health",
  "Business",
];

const Settings = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [otherPrefs, setOtherPrefs] = useState("");

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSave = () => {
    toast.success("Preferences saved (not persisted yet)");
    console.table({ selectedTopics, otherPrefs });
  };

  return (
    <div className="min-h-screen pt-20 pb-10 container mx-auto flex flex-col gap-8 bg-background text-foreground">
      <h1 className="text-3xl font-bold">Settings</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Select your preferred topics</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {AVAILABLE_TOPICS.map((topic) => (
            <label
              key={topic}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Checkbox
                checked={selectedTopics.includes(topic)}
                onCheckedChange={() => toggleTopic(topic)}
                id={topic}
              />
              <Label htmlFor={topic}>{topic}</Label>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Other preferences</h2>
        <Textarea
          placeholder="Describe formatting, style, or any other preferences…"
          value={otherPrefs}
          onChange={(e) => setOtherPrefs(e.target.value)}
        />
      </section>

      <div>
        <Button onClick={handleSave} className="mt-4">
          Save
        </Button>
      </div>
    </div>
  );
};

export default Settings;
