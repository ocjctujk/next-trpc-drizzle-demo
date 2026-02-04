"use client";

import { trpc } from "@/trpc/client";

export default function NotesList({
  groupId,
  selectedNoteId,
  onSelectNote,
}: {
  groupId: number | null;
  selectedNoteId: number | null;
  onSelectNote: (id: number) => void;
}) {
  const { data: notes, isLoading } = trpc.notesRouter.byGroup.useQuery(
    { groupId: groupId! },
    { enabled: !!groupId }
  );

  return (
    <div className="w-1/4 bg-gray-50 border-r p-4">
      <h2 className="text-lg font-semibold mb-4">Notes</h2>
      {!groupId ? (
        <p className="text-gray-500">Select a group to view notes</p>
      ) : isLoading ? (
        <p>Loading...</p>
      ) : notes?.length ? (
        notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelectNote(note.id)}
            className={`cursor-pointer p-2 rounded-lg hover:bg-gray-200 ${
              selectedNoteId === note.id ? "bg-gray-300 font-medium" : ""
            }`}
          >
            {note.title}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No notes in this group</p>
      )}
    </div>
  );
}
