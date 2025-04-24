import { createGoogleGenerativeAI as createGoogleAI } from "@ai-sdk/google";
import { createStreamableValue as createStreamable } from "ai/rsc";
import { streamText as streamTextContent } from "ai";

// Re-export the functions with the original names
export const createGoogleGenerativeAI = createGoogleAI;
export const createStreamableValue = createStreamable;
export const streamText = streamTextContent;
