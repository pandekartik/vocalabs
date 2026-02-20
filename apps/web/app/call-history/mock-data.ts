import { CallRecord, CallTag } from "./types";

const mockNotes = [
    "Customer interested in premium plan. Needs follow-up next week.",
    "Billing issue resolved. Refund processed for last month.",
    "Left a voicemail about the upcoming feature release.",
    "Technical support regarding login issues. Password reset sent.",
    "Spoke with the decision maker. They are reviewing the proposal.",
    "Wrong number.",
    "Requested cancellation due to budget constraints.",
    "Onboarding call completed successfully.",
    "Checking in on their current usage and satisfaction.",
    "Interested in upgrading, will discuss internally."
];

const mockTagsList: CallTag[] = [
    { id: "hot-lead", name: "hot-lead", category: "Lead Status" },
    { id: "follow-up", name: "follow-up", category: "Follow-up" },
    { id: "pricing", name: "pricing", category: "Topic" },
    { id: "support", name: "support", category: "Topic" },
    { id: "urgent", name: "urgent", category: "Priority" },
    { id: "closed-won", name: "closed-won", category: "Outcome" },
    { id: "callback", name: "callback", category: "Follow-up" }
];

function getRandomSubarray<T>(arr: T[], size: number) {
    const shuffled = arr.slice(0);
    let i = arr.length;
    let temp;
    let index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index] as T;
        shuffled[index] = shuffled[i] as T;
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

function generateMockCalls(count: number): CallRecord[] {
    const calls: CallRecord[] = [];
    const outcomes: CallRecord["outcome"][] = ["Completed", "Missed", "Voicemail", "Failed", "In Progress"];
    const directions: CallRecord["direction"][] = ["Inbound", "Outbound"];

    for (let i = 0; i < count; i++) {
        const isCompleted = Math.random() > 0.3;
        const outcome = isCompleted ? "Completed" : (outcomes[Math.floor(Math.random() * outcomes.length)] as CallRecord["outcome"]);
        const direction = directions[Math.floor(Math.random() * directions.length)] as CallRecord["direction"];

        const hasRecording = outcome === "Completed" && Math.random() > 0.1;
        const hasNotes = Math.random() > 0.2;
        const hasTags = Math.random() > 0.1;

        // Random duration based on outcome
        let durationSeconds = 0;
        if (outcome === "Completed") {
            durationSeconds = Math.floor(Math.random() * 1200) + 30; // 30s to 20m
        } else if (outcome === "Voicemail") {
            durationSeconds = Math.floor(Math.random() * 120) + 10;
        }

        const timestamp = new Date();
        // Spread calls over the last 30 days
        timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30));
        timestamp.setHours(Math.floor(Math.random() * 24));
        timestamp.setMinutes(Math.floor(Math.random() * 60));

        calls.push({
            id: `C${100000 + Math.floor(Math.random() * 899999)}`,
            timestamp: timestamp.toISOString(),
            direction,
            phoneNumber: `+1-555-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
            durationSeconds,
            outcome,
            recordingStatus: hasRecording ? "Available" : (outcome === "Completed" ? (Math.random() > 0.8 ? "Processing" : "Failed") : "None"),
            tags: hasTags ? getRandomSubarray(mockTagsList, Math.floor(Math.random() * 3) + 1) : [],
            notes: hasNotes ? (mockNotes[Math.floor(Math.random() * mockNotes.length)] as string) : "",
            aiSummary: hasNotes ? "Customer expressed interest in premium plan. Price sensitivity detected. Requested follow-up call next week." : undefined,
            sentiment: hasNotes ? (Math.random() > 0.5 ? "Positive" : Math.random() > 0.5 ? "Neutral" : "Negative") : undefined
        });
    }

    // Sort descending by timestamp
    return calls.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const CALL_HISTORY_MOCK_DATA = generateMockCalls(47);
