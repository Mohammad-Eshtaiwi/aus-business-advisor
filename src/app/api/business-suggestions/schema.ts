import { z } from "zod";

export const businessSuggestionsSchema = z.object({
  ancestryData: z.record(z.string(), z.number()),
});

export type BusinessSuggestionsSchema = z.infer<
  typeof businessSuggestionsSchema
>;
