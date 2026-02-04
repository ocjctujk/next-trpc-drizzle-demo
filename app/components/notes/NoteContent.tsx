"use client";

import { trpc } from "@/trpc/client";
import { useEffect, useState } from "react";

export default function NoteContent({ noteId }: { noteId: number | null }) {
  const [content, setContent] = useState("");

  // 1. Fetch note data
  const {
    data: note,
    isLoading,
    refetch,
  } = trpc.notes.byId.useQuery({ id: noteId as number }, { enabled: !!noteId });

  // 2. Sync local state when the fetched note changes
  useEffect(() => {
    if (note) {
      setContent(note.content ?? "");
    }
  }, [note]);

  const updateNote = trpc.notes.update.useMutation({
    onSuccess: () => {
      // Optional: You could use trpcUtils.notes.byId.setData to update cache locally
      // instead of a full refetch, but refetch() is safer for starters.
      refetch();
    },
  });

  const handleSave = () => {
    if (!noteId) return;
    updateNote.mutate({ id: noteId, content });
  };

  // UI Logic
  if (!noteId) {
    return (
      <div className="flex-1 p-6">
        <p className="text-gray-500">Select a note to view its content</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <p>Loading...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex-1 p-6">
        <p className="text-gray-500">Note not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">{note.title}</h2>
          <button
            onClick={handleSave}
            disabled={updateNote.isPending}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              updateNote.isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {updateNote.isPending ? "Saving..." : "Save"}
          </button>
        </div>

        <textarea
          className="flex-1 w-full resize-none bg-transparent outline-none text-gray-800 text-base leading-relaxed placeholder-gray-400"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your note..."
        />
      </div>
    </div>
  );
}
