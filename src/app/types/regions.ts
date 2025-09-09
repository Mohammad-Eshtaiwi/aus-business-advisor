/**
 * Types for Australian geographical regions data
 */

/**
 * State information
 */
export interface State {
  state_code_2021: string;
  state_name_2021: string;
}

/**
 * Statistical Area Level 4 (SA4) information
 */
export interface SA4Region {
  sa4_code_2021: string;
  sa4_name_2021: string;
  state_code_2021: string;
  state_name_2021: string;
}

/**
 * Statistical Area Level 3 (SA3) information
 */
export interface SA3Region {
  sa3_code_2021: string;
  sa3_name_2021: string;
  sa4_code_2021: string;
  sa4_name_2021: string;
}

/**
 * Statistical Area Level 2 (SA2) information
 */
export interface SA2Region {
  sa2_code_2021: string;
  sa2_name_2021: string;
  sa3_code_2021: string;
  sa3_name_2021: string;
}

/**
 * Statistics about the regions data
 */
export interface RegionsStats {
  states: number;
  sa4Groups: number;
  sa3Groups: number;
  totalSA2: number;
}

/**
 * Complete regions data structure
 */
export interface RegionsData {
  stats: RegionsStats;
  data: {
    states: State[];
    sa4: Record<string, SA4Region[]>;
    sa3: Record<string, SA3Region[]>;
    sa2: Record<string, SA2Region[]>;
  };
}

/**
 * Type for region codes across different levels
 */
export type RegionCode = {
  state_code_2021?: string;
  sa4_code_2021?: string;
  sa3_code_2021?: string;
  sa2_code_2021?: string;
};

/**
 * Type for region names across different levels
 */
export type RegionName = {
  state_name_2021?: string;
  sa4_name_2021?: string;
  sa3_name_2021?: string;
  sa2_name_2021?: string;
};

/**
 * Union type for all region types
 */
export type Region = State | SA4Region | SA3Region | SA2Region;

/**
 * Enum for region levels
 */
export enum RegionLevel {
  STATE = "state",
  SA4 = "sa4",
  SA3 = "sa3",
  SA2 = "sa2",
}
