import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

import { BusinessSuggestionsSchema, businessSuggestionsSchema } from "./schema";

// Initialize OpenAI client
// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Get custom ancestry data from request body
    const body: BusinessSuggestionsSchema = await request.json();

    try {
      businessSuggestionsSchema.parse(body);
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Invalid ancestry data provided" },
        { status: 400 }
      );
    }
    const customAncestryData = body.ancestryData;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
      Based on the provided ancestry data, generate business suggestions following this exact format:

      # Community Summary
      [2-3 sentences describing the area's cultural composition. Be factual and direct.]

      # Business Suggestions

      ## [Business Type 1]
      ### **Name:**  [Business name]
      ###**Concept:** 
      - [Clear description of the business in 2-3 sentences]
      ### **Relevance:** 
      - [How it serves the community's cultural makeup in 1-2 sentences]

      ## [Business Type 2]
      ### **Name:**  [Business name]
      ### **Concept:** 
      -  [Clear description of the business in 2-3 sentences]
      ### **Relevance:** 
      -  [How it serves the community's cultural makeup in 1-2 sentences]

      ## [Business Type 3]
      ### **Name:** [Business name]
      ### **Concept:** 
      - [Clear description of the business in 2-3 sentences]
      ### **Relevance:** 
      -  [How it serves the community's cultural makeup in 1-2 sentences]

      Requirements:
      - Use simple, direct language
      - Avoid stereotypes and generalizations
      - Focus on practical, viable business ideas
      - Consider both traditional and modern concepts
      - Ensure suggestions serve multiple cultural groups
      - Use only spaces for indentation, no tabs
      - Use single line breaks between sections
      - Do not use escape characters like \\n
      - Keep each section concise and focused

      Ancestry data:
      ${JSON.stringify(customAncestryData, null, 2)}
      `,
    });

    const suggestions = response.text;

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error generating business suggestions:", error);
    return NextResponse.json(
      { error: "Failed to generate business suggestions" },
      { status: 500 }
    );
  }
}
