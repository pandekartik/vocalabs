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
    const outcomes = ["completed", "missed", "voicemail", "failed", "initiated"];
    const directions = ["inbound", "outbound"];

    for (let i = 0; i < count; i++) {
        const isCompleted = Math.random() > 0.3;
        const status = isCompleted ? "completed" : outcomes[Math.floor(Math.random() * outcomes.length)];
        const direction = directions[Math.floor(Math.random() * directions.length)];

        const hasRecording = status === "completed" && Math.random() > 0.1;
        const hasNotes = Math.random() > 0.2;
        const hasTags = Math.random() > 0.1;

        // Random duration based on outcome
        let duration = 0;
        if (status === "completed") {
            duration = Math.floor(Math.random() * 1200) + 30; // 30s to 20m
        } else if (status === "voicemail") {
            duration = Math.floor(Math.random() * 120) + 10;
        }

        const timestamp = new Date();
        // Spread calls over the last 30 days
        timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30));
        timestamp.setHours(Math.floor(Math.random() * 24));
        timestamp.setMinutes(Math.floor(Math.random() * 60));

        const endedAt = new Date(timestamp.getTime() + duration * 1000);

        const tagsArray = hasTags ? getRandomSubarray(mockTagsList, Math.floor(Math.random() * 3) + 1) : [];

        calls.push({
            id: `C${100000 + Math.floor(Math.random() * 899999)}`,
            call_sid: `CA${Math.random().toString(36).substring(2, 15)}`,
            stream_sid: `MZ${Math.random().toString(36).substring(2, 15)}`,
            direction,
            status: status as string,
            from_number: direction === "inbound" ? `+1-555-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}` : "+1-800-VOCALAB",
            to_number: direction === "outbound" ? `+1-555-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}` : "+1-800-VOCALAB",
            agent_number: "+1-800-VOCALAB",
            duration,
            recording_url: hasRecording ? "https://example.com/recording.wav" : "",
            transcript: hasRecording ? "Customer: Hello, I have a question about pricing.\nAgent: Sure, I can help with that." : "",
            ai_summary: hasNotes ? "Customer expressed interest in premium plan. Price sensitivity detected." : "",
            overall_sentiment: hasNotes ? (Math.random() > 0.5 ? "Positive" : Math.random() > 0.5 ? "Neutral" : "Negative") : "",
            agent_notes: hasNotes ? (mockNotes[Math.floor(Math.random() * mockNotes.length)] ?? "") : "",
            tags: JSON.stringify(tagsArray),
            started_at: timestamp.toISOString(),
            ended_at: endedAt.toISOString(),
            created_at: timestamp.toISOString()
        });
    }

    // Sort descending by created_at
    return calls.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export const CALL_HISTORY_MOCK_DATA = generateMockCalls(47);
