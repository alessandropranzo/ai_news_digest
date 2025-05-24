// These types are used for the final output structure of sources from the modal
export interface OutputWebNewsSource {
  type: "web" | "news";
  country: string;
  exclude_websites: string[];
}

export interface OutputXSource {
  type: "x";
  x_handles: string[];
}

export type FinalOutputSource = OutputWebNewsSource | OutputXSource;

export interface Digest {
  id_digests: number;
  created_at: string;
  digest_number?: number;
  title?: string;
  short_description?: string;
  content?: string;
  date?: string;
  sources?: FinalOutputSource[];
  podcast?: string;
  user_query?: string;
  user_topics?: string;
  user_other_preferences?: string;
  user_format_preference?: string;
}
