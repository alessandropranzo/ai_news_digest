export interface Digest {
  id_digests: number;
  created_at: string;
  digest_number?: number;
  title?: string;
  short_description?: string;
  content?: string;
  date?: string;
  sources?: Record<string, unknown>;
  podcast?: string;
  user_query?: string;
  user_topics?: string;
  user_other_preferences?: string;
}
