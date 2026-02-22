"use client";

import { useState, useEffect, useRef, useCallback, KeyboardEvent } from "react";
import { Card } from "@/components/ui/card";
import { useCallStore } from "@/store/useCallStore";
import { INTELICONVOAPI } from "@/lib/axios";
import { Loader2, Check } from "lucide-react";

export default function ActiveCallRightPanel() {
    const { transcript, callId } = useCallStore();
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    // Notes state
    const [notes, setNotes] = useState("");
    const [notesSaving, setNotesSaving] = useState(false);
    const [notesSaved, setNotesSaved] = useState(false);

    // Tags state
    const [tags, setTags] = useState("");
    const [tagsSaving, setTagsSaving] = useState(false);
    const [tagsSaved, setTagsSaved] = useState(false);

    const scrollToBottom = () => {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [transcript]);

    // Save notes and tags via API
    const saveNotesAndTags = useCallback(async (notesVal: string, tagsVal: string) => {
        if (!callId) {
            console.warn("No callId — cannot save");
            return;
        }
        const token = localStorage.getItem("token");
        if (!token) return;

        const parsedTags = tagsVal.split(",").map(t => t.trim()).filter(Boolean);

        try {
            await INTELICONVOAPI.patch(`/calls/${callId}/notes`, {
                notes: notesVal,
                tags: parsedTags,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return true;
        } catch (e) {
            console.error("Failed to save:", e);
            return false;
        }
    }, [callId]);

    // Handle Enter key for notes
    const handleNotesKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            setNotesSaving(true);
            const ok = await saveNotesAndTags(notes, tags);
            setNotesSaving(false);
            if (ok) {
                setNotesSaved(true);
                setTimeout(() => setNotesSaved(false), 2000);
            }
        }
    };

    // Handle Enter key for tags
    const handleTagsKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            setTagsSaving(true);
            const ok = await saveNotesAndTags(notes, tags);
            setTagsSaving(false);
            if (ok) {
                setTagsSaved(true);
                setTimeout(() => setTagsSaved(false), 2000);
            }
        }
    };

    return (
        <div className="flex h-full flex-col gap-4 overflow-y-auto pr-1">
            {/* Live Transcript Card */}
            <Card title="Live Transcript" className="flex-1 min-h-[200px] shrink-0 flex flex-col relative">
                <div className="flex-1 rounded-2xl border border-[rgba(17,17,17,0.05)] overflow-hidden backdrop-blur-[42px] flex flex-col"
                    style={{
                        background: "linear-gradient(96deg, rgba(17, 17, 17, 0.05) -4.09%, rgba(17, 17, 17, 0.02) 105.58%)"
                    }}
                >
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-base font-medium text-[#111] opacity-60 font-sans whitespace-pre-wrap">
                        {transcript.length > 0 ? (
                            transcript.map((msg, index) => (
                                <p key={index}>
                                    <span className="font-bold">{msg.speaker}:</span> {msg.text}
                                </p>
                            ))
                        ) : (
                            <p className="text-gray-400 italic">No transcript yet...</p>
                        )}
                        <div ref={transcriptEndRef} className="shrink-0 h-1" />
                    </div>
                </div>
            </Card>

            {/* Notes Card */}
            <Card title="Notes" className="flex-1 min-h-[200px] shrink-0">
                <div className="h-full rounded-2xl border border-[rgba(17,17,17,0.05)] p-4 backdrop-blur-[42px] relative"
                    style={{
                        background: "linear-gradient(96deg, rgba(17, 17, 17, 0.05) -4.09%, rgba(17, 17, 17, 0.02) 105.58%)"
                    }}
                >
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        onKeyDown={handleNotesKeyDown}
                        placeholder="Enter notes... (Enter to save, Shift+Enter for new line)"
                        className="h-full w-full resize-none bg-transparent text-left font-sans text-base font-medium text-[#111] placeholder:text-[#111] placeholder:opacity-40 focus:outline-none"
                    />
                    {/* Save indicator */}
                    <div className="absolute bottom-2 right-3 flex items-center gap-1">
                        {notesSaving && <Loader2 size={14} className="animate-spin text-[#FE641F]" />}
                        {notesSaved && <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><Check size={14} /> Saved</span>}
                        {!notesSaving && !notesSaved && <span className="text-[10px] text-gray-400">↵ Enter to save</span>}
                    </div>
                </div>
            </Card>

            {/* Tagging ID Card */}
            <Card title="Tagging ID" className="flex-1 min-h-[200px] shrink-0">
                <div className="h-full rounded-2xl border border-[rgba(17,17,17,0.05)] p-4 backdrop-blur-[42px] relative"
                    style={{
                        background: "linear-gradient(96deg, rgba(17, 17, 17, 0.05) -4.09%, rgba(17, 17, 17, 0.02) 105.58%)"
                    }}
                >
                    <textarea
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        onKeyDown={handleTagsKeyDown}
                        placeholder="Enter tagging IDs (comma separated, Enter to save, Shift+Enter for new line)"
                        className="h-full w-full resize-none bg-transparent text-left font-sans text-base font-medium text-[#111] placeholder:text-[#111] placeholder:opacity-40 focus:outline-none"
                    />
                    {/* Save indicator */}
                    <div className="absolute bottom-2 right-3 flex items-center gap-1">
                        {tagsSaving && <Loader2 size={14} className="animate-spin text-[#FE641F]" />}
                        {tagsSaved && <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><Check size={14} /> Saved</span>}
                        {!tagsSaving && !tagsSaved && <span className="text-[10px] text-gray-400">↵ Enter to save</span>}
                    </div>
                </div>
            </Card>
        </div>
    );
}
