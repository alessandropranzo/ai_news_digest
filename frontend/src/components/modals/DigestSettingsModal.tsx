import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { XCircle, PlusCircle, Trash2 } from "lucide-react";
import type {
  FinalOutputSource,
  OutputWebNewsSource,
  OutputXSource,
  Digest,
} from "../../types/digest";
import { createDigest } from "../../api/apiClient";

const AVAILABLE_TOPICS = [
  "AI",
  "Sports",
  "Politics",
  "Technology",
  "Health",
  "Business",
];

const COUNTRIES = [
  { code: "_placeholder_", name: "Select Country...", isoCode: "" },
  { code: "US", name: "United States", isoCode: "US" },
  { code: "GB", name: "United Kingdom", isoCode: "GB" },
  { code: "DE", name: "Germany", isoCode: "DE" },
  { code: "FR", name: "France", isoCode: "FR" },
  { code: "IT", name: "Italy", isoCode: "IT" },
  { code: "CH", name: "Switzerland", isoCode: "CH" },
  { code: "CA", name: "Canada", isoCode: "CA" },
  { code: "AU", name: "Australia", isoCode: "AU" },
  { code: "JP", name: "Japan", isoCode: "JP" },
  { code: "IN", name: "India", isoCode: "IN" },
  { code: "BR", name: "Brazil", isoCode: "BR" },
  { code: "CN", name: "China", isoCode: "CN" },
];

interface BaseSource {
  id: string;
  type: "web" | "news" | "x" | "";
}

interface WebNewsSource extends BaseSource {
  type: "web" | "news";
  country: string;
  exclude_websites: string[];
}

interface XSource extends BaseSource {
  type: "x";
  x_handles: string[];
}

type SourceConfigEntry = BaseSource & {
  country?: string;
  exclude_websites?: string[];
  x_handles?: string[];
  current_website_to_add?: string;
  current_x_handle_to_add?: string;
};

interface DigestSettingsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDigestCreated: () => void;
}

const DigestSettingsModal = ({
  isOpen,
  onOpenChange,
  onDigestCreated,
}: DigestSettingsModalProps) => {
  const [selectedTopics, setSelectedTopics] = useState<string>("");
  const [userFormatPreference, setUserFormatPreference] = useState("");
  const [sources, setSources] = useState<SourceConfigEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const formatPreferenceTemplate =
    "Please organize the digest with the following sections:\n1. Introduction (here you insert the headlines of the day, giving an overview of the day in the news). \n2 A new section for each topic. For each section, include 2-3 key stories with detailed summaries of the single pieces of news.";

  const addSource = () => {
    setSources([
      ...sources,
      {
        id: Date.now().toString(),
        type: "",
        country: "_placeholder_",
        exclude_websites: [],
        x_handles: [],
        current_website_to_add: "",
        current_x_handle_to_add: "",
      },
    ]);
  };

  const updateSource = (
    id: string,
    updatedField: Partial<SourceConfigEntry>
  ) => {
    setSources(
      sources.map((source) =>
        source.id === id ? { ...source, ...updatedField } : source
      )
    );
  };

  const handleSourceTypeChange = (
    id: string,
    type: "web" | "news" | "x" | ""
  ) => {
    setSources(
      sources.map((source) => {
        if (source.id === id) {
          const newSource: SourceConfigEntry = {
            id,
            type,
            country: source.country || "_placeholder_",
            exclude_websites: [],
            x_handles: [],
            current_website_to_add: "",
            current_x_handle_to_add: "",
          };
          return newSource;
        }
        return source;
      })
    );
  };

  const removeSource = (id: string) => {
    setSources(sources.filter((source) => source.id !== id));
  };

  const addTag = (
    sourceId: string,
    tagType: "exclude_websites" | "x_handles"
  ) => {
    setSources(
      sources.map((s) => {
        if (s.id === sourceId) {
          const newTag =
            tagType === "exclude_websites"
              ? s.current_website_to_add?.trim()
              : s.current_x_handle_to_add?.trim();
          if (newTag) {
            const currentTags =
              (tagType === "exclude_websites"
                ? s.exclude_websites
                : s.x_handles) || [];
            if (!currentTags.includes(newTag)) {
              const updatedSource = {
                ...s,
                [tagType]: [...currentTags, newTag],
                ...(tagType === "exclude_websites"
                  ? { current_website_to_add: "" }
                  : { current_x_handle_to_add: "" }),
              };
              return updatedSource;
            }
          }
          return {
            ...s,
            ...(tagType === "exclude_websites"
              ? { current_website_to_add: "" }
              : { current_x_handle_to_add: "" }),
          };
        }
        return s;
      })
    );
  };

  const removeTag = (
    sourceId: string,
    tagType: "exclude_websites" | "x_handles",
    tagToRemove: string
  ) => {
    setSources(
      sources.map((s) => {
        if (s.id === sourceId) {
          const currentTags =
            (tagType === "exclude_websites"
              ? s.exclude_websites
              : s.x_handles) || [];
          return {
            ...s,
            [tagType]: currentTags.filter((tag) => tag !== tagToRemove),
          };
        }
        return s;
      })
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    const finalSources: FinalOutputSource[] = sources
      .map((s) => {
        const { id, current_website_to_add, current_x_handle_to_add, ...rest } =
          s;
        if (rest.type === "web" || rest.type === "news") {
          return {
            type: rest.type,
            country: rest.country || "",
            exclude_websites: rest.exclude_websites || [],
          } as OutputWebNewsSource;
        }
        if (rest.type === "x") {
          return {
            type: rest.type,
            x_handles: rest.x_handles || [],
          } as OutputXSource;
        }
        return null;
      })
      .filter((s) => s !== null) as FinalOutputSource[];

    const digestDataToSave: Omit<
      Digest,
      "id_digests" | "created_at" | "digest_number"
    > = {
      user_topics: selectedTopics,
      user_format_preference: userFormatPreference,
      sources: finalSources,
    };

    try {
      console.log(
        "Digest Data to be sent:",
        JSON.stringify(digestDataToSave, null, 2)
      );
      const newDigest = await createDigest(digestDataToSave);
      toast.success(
        `Digest "${newDigest.title || "New Digest"}" created successfully!`
      );
      onDigestCreated();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        `Error creating digest: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      console.error("Error creating digest:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="mb-10">Create New Digest</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Digest</DialogTitle>
          <DialogDescription>
            Configure topics, sources, and preferences for your new digest.
          </DialogDescription>
        </DialogHeader>

        <section className="space-y-4 mt-4">
          <h2 className="text-md font-semibold">Select topics</h2>
          <Textarea
            placeholder={`Enter topics separated by commas (e.g., ${AVAILABLE_TOPICS.join(
              ", "
            )})`}
            value={selectedTopics}
            onChange={(e) => setSelectedTopics(e.target.value)}
            className="min-h-[80px]"
          />
        </section>

        <section className="space-y-2 mt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-md font-semibold">Format Preference</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUserFormatPreference(formatPreferenceTemplate)}
            >
              Use Template
            </Button>
          </div>
          <Textarea
            placeholder="Describe your preferred formatting for the digest (e.g., bullet points, concise summaries, tone)..."
            value={userFormatPreference}
            onChange={(e) => setUserFormatPreference(e.target.value)}
          />
        </section>

        <section className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-md font-semibold">Sources</h2>
            <Button variant="outline" size="sm" onClick={addSource}>
              Add Source
            </Button>
          </div>
          {sources.map((source, index) => (
            <div
              key={source.id}
              className="p-4 border rounded-md space-y-3 bg-muted/50 relative"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                onClick={() => removeSource(source.id)}
              >
                <XCircle size={18} />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`source-type-${source.id}`}>
                    Source Type
                  </Label>
                  <Select
                    value={source.type}
                    onValueChange={(value: "web" | "news" | "x" | "") =>
                      handleSourceTypeChange(source.id, value)
                    }
                  >
                    <SelectTrigger id={`source-type-${source.id}`}>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Web</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="x">X (Twitter)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(source.type === "web" || source.type === "news") && (
                  <>
                    <div>
                      <Label htmlFor={`source-country-${source.id}`}>
                        Country
                      </Label>
                      <Select
                        value={source.country || "_placeholder_"}
                        onValueChange={(value) =>
                          updateSource(source.id, {
                            country: value === "_placeholder_" ? "" : value,
                          })
                        }
                      >
                        <SelectTrigger id={`source-country-${source.id}`}>
                          <SelectValue placeholder="Select country..." />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem
                              key={country.code}
                              value={country.code}
                              disabled={country.code === "_placeholder_"}
                            >
                              {country.isoCode || country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor={`source-exclude-input-${source.id}`}>
                        Exclude Websites
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={`source-exclude-input-${source.id}`}
                          placeholder="e.g., example.com"
                          value={source.current_website_to_add || ""}
                          onChange={(e) =>
                            updateSource(source.id, {
                              current_website_to_add: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTag(source.id, "exclude_websites");
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => addTag(source.id, "exclude_websites")}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {source.exclude_websites?.map((website) => (
                          <span
                            key={website}
                            className="flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-md text-sm"
                          >
                            {website}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 text-muted-foreground hover:text-destructive -mr-1"
                              onClick={() =>
                                removeTag(
                                  source.id,
                                  "exclude_websites",
                                  website
                                )
                              }
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {source.type === "x" && (
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor={`source-xhandles-input-${source.id}`}>
                      X Handles (without @)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={`source-xhandles-input-${source.id}`}
                        placeholder="e.g., handle1"
                        value={source.current_x_handle_to_add || ""}
                        onChange={(e) =>
                          updateSource(source.id, {
                            current_x_handle_to_add: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag(source.id, "x_handles");
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => addTag(source.id, "x_handles")}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {source.x_handles?.map((handle) => (
                        <span
                          key={handle}
                          className="flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-md text-sm"
                        >
                          {handle}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-muted-foreground hover:text-destructive -mr-1"
                            onClick={() =>
                              removeTag(source.id, "x_handles", handle)
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {sources.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No sources added yet.
            </p>
          )}
        </section>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Creating..." : "Run & Create Digest"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DigestSettingsModal;
