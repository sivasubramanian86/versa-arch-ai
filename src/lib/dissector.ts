/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Utility to extract text from various sources
 */
export async function extractFromSource(input: string): Promise<{
    text: string,
    metadata: { type: "book" | "video" | "audio" | "article", title: string, url?: string }
}> {

    // Check if it's a YouTube URL
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]{11})/;
    const ytMatch = input.match(youtubeRegex);

    if (ytMatch) {
        const videoId = ytMatch[1];
        console.log(`Dissector: Extracting transcript for Video ID: ${videoId}`);

        // In a real app, use youtube-transcript-api or similar
        // For this demo, we'll "fetch" a high-quality transcript mock
        return {
            text: `[TRANSCRIPT START] 
Welcome to this deep dive into Kubernetes Architecture. 
Today we're talking about the Control Plane and Worker Nodes. 
The API Server is the front door. The Scheduler decides where pods go. 
ETCD stores the cluster state. This is the source of truth.
[TRANSCRIPT END]`,
            metadata: {
                type: "video",
                title: "Kubernetes Deep Dive - Video Dissection",
                url: input
            }
        };
    }

    // Check if it's a "Book" request
    if (input.toLowerCase().includes("book:") || input.toLowerCase().includes("read:")) {
        const title = input.replace(/book:|read:/i, "").trim();
        return {
            text: `[BOOK CONTENT: ${title}]
Chapter 1: The First Principles. 
In this chapter, we explore how systems thinking applies to software. 
Isolation of concerns is paramount. Scalability is a side effect of good design.
Complexity is the enemy of reliability.`,
            metadata: {
                type: "book",
                title: title
            }
        };
    }

    // Default: No special extraction
    return {
        text: "",
        metadata: { type: "article", title: "Untitled" }
    };
}
