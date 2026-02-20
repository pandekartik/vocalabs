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
    timestamp: string; // ISO String
    direction: CallDirection;
    phoneNumber: string; // E.g. "+1-555-0456"
    durationSeconds: number; // Duration in seconds
    outcome: CallOutcome;
    recordingStatus: RecordingStatus;
    tags: CallTag[];
    notes: string;
    aiSummary?: string;
    sentiment?: "Positive" | "Neutral" | "Negative";
}
