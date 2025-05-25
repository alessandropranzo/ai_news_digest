// These types are used for the final output structure of sources from the modal
export interface OutputWebNewsSource {
  type: "web" | "news";
  country: string | null;
  exclude_websites: string[] | null;
}

export interface OutputXSource {
  type: "x";
  x_handles: string[] | null;
}

export type FinalOutputSource = OutputWebNewsSource | OutputXSource;

export interface Digest {
  id_digests: number;
  created_at: string;
  digest_number?: number;
  title?: string;
  short_description?: string;
  content?: string;
  contentHtml?: string;
  date?: string;
  sources?: FinalOutputSource[];
  podcast?: string;
  user_query?: string;
  user_topics?: string;
  user_format_preference?: string;
}
