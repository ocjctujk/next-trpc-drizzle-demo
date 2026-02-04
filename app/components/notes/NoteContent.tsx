"use client";

import { trpc } from "@/trpc/client";


export default function NoteContent({ noteId }: { noteId: number | null }) {
  const { data: note, isLoading } = trpc.notesRouter.byId.useQuery(
    { id: noteId! },
    { enabled: !!noteId }
  );

  return (
    <div className="flex-1 p-6">
      {!noteId ? (
        <p className="text-gray-500">Select a note to view its content</p>
      ) : isLoading ? (
        <p>Loading...</p>
      ) : note ? (
        <>
          <h2 className="text-2xl font-semibold mb-4">{note.title}</h2>
          <p>{note.content}</p>
        </>
      ) : (
        <p className="text-gray-500">Note not found</p>
      )}
    </div>
  );
}
