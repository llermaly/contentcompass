export interface AnalyzeAPIResponse {
  data?: Analysis[];
  ok: boolean;
  error?: string;
}

export interface CompareAPIResponse {
  data?: Comparision;
  ok: boolean;
  error?: string;
}

export interface ExtractBodyAPIResponse {
  data?: string;
  ok: boolean;
  meta: Meta;
  error?: string;
}

export interface EndToEndAPIResponse {
  data?: Analysis[];
  ok: boolean;
  metadata: {
    dest: Meta;
    source: Meta;
  };
  error?: string;
}

export interface Meta {
  thumbnail: string;
  title: string;
  duration: number;
  channel: string;
  uploader_url: string;
  channel_follower_count: number;
  view_count: number;
  webpage_url: string;
}

export interface Analysis {
  title: string;
  score: number;
  feedback: string;
}

export interface ExtractGuidelinesAPIResponse {
  data?: { title: string }[];
  ok: boolean;
  error?: string;
}

export interface Comparision {
  improvements: string[];
  feedbacks: string[];
}
