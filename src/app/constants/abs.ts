export const CENSUS_API = {
  baseUrl: "https://data.api.abs.gov.au/rest/ABS/",
  endpoints: {
    data: "data/",
    metadata: "metadata/",
  },

  headers: {
    json: { Accept: "application/vnd.sdmx.data+json" },
    csv: { Accept: "application/vnd.sdmx.data+csv" },
  },
} as const;



export interface CensusError {
  code: string;
  message: string;
  details?: string;
}

export interface CensusResponse<T> {
  success: boolean;
  data?: T;
  error?: CensusError;
  metadata?: {
    topic: string;
    geography: string;
    period: string;
  };
}
