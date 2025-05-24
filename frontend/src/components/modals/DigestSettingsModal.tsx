import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";

const AVAILABLE_TOPICS = [
  "AI",
  "Sports",
  "Politics",
  "Technology",
  "Health",
  "Business",
];

const DigestSettingsModal = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [otherPrefs, setOtherPrefs] = useState("");

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSave = () => {
    // Placeholder action – in a real app you would call an API to create the digest
    toast.success("Digest settings saved (stub)");
    console.table({ selectedTopics, otherPrefs });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-10">Create New Digest</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Digest</DialogTitle>
          <DialogDescription>
            Choose topics and describe any special preferences for this digest.
          </DialogDescription>
        </DialogHeader>

        <section className="space-y-4 mt-4">
          <h2 className="text-md font-semibold">Select topics</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {AVAILABLE_TOPICS.map((topic) => (
              <label
                key={topic}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <Checkbox
                  checked={selectedTopics.includes(topic)}
                  onCheckedChange={() => toggleTopic(topic)}
                  id={`digest-${topic}`}
                />
                <Label htmlFor={`digest-${topic}`}>{topic}</Label>
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-2 mt-6">
          <h2 className="text-md font-semibold">Other preferences</h2>
          <Textarea
            placeholder="Describe formatting, style, or any other preferences…"
            value={otherPrefs}
            onChange={(e) => setOtherPrefs(e.target.value)}
          />
        </section>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DigestSettingsModal;
