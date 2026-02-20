export type CallOutcome = "Completed" | "Missed" | "Voicemail" | "Failed" | "In Progress";
export type CallDirection = "Inbound" | "Outbound";
export type RecordingStatus = "Available" | "Processing" | "Failed" | "None";

export interface CallTag {
    id: string;
    name: string;
    category: string; // "Lead Status" | "Follow-up" | "Topic" | "Priority" | "Outcome"
}

export interface CallRecord {
    id: string;
    call_sid: string;
    stream_sid: string;
    direction: "inbound" | "outbound" | string;
    status: string;
    from_number: string;
    to_number: string;
    agent_number: string;
    duration: number; // in seconds
    recording_url: string;
    transcript: string;
    ai_summary: string;
    overall_sentiment: string;
    agent_notes: string;
    tags: string; // the API schema provides it as a string
    started_at: string; // ISO String
    ended_at: string; // ISO String
    created_at: string; // ISO String
}
