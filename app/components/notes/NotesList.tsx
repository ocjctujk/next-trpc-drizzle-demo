"use client";

import { trpc } from "@/trpc/client";
import { Plus } from "lucide-react";
import { useState } from "react";
import InputModal from "../common/InputModal";

export default function NotesList({
  groupId,
  selectedNoteId,
  onSelectNote,
}: {
  groupId: number | null;
  selectedNoteId: number | null;
  onSelectNote: (id: number) => void;
}) {
  const {
    data: notes,
    isLoading,
    refetch,
  } = trpc.notes.byGroup.useQuery(
    { groupId: groupId! },
    { enabled: !!groupId },
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const createNote = trpc.notes.create.useMutation({
    onSuccess: () => {
      console.log("Group created!");
      // Optionally refetch groups list
      refetch();
    },
  });
  const handleAddNote = (name: string) => {
    console.log("New note:", name);
    // When user submits form
    createNote.mutate({ title: name, groupId: groupId! });
    // call trpc.noteGroups.create.mutate({ title: name });
  };

  return (
    <div className="w-1/4  border-r p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Notes</h2>
        <button
          className="p-1.5 rounded-lg hover:bg-secondary"
          title="Add Group"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-5 h-5 text-foreground" />
        </button>
      </div>
      <InputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddNote}
        label="New Note Title"
      />
      {!groupId ? (
        <p className="text-muted-foreground">Select a group to view notes</p>
      ) : isLoading ? (
        <p>Loading...</p>
      ) : notes?.length ? (
        notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelectNote(note.id)}
            className={`cursor-pointer p-2 rounded-lg hover:bg-secondary ${
              selectedNoteId === note.id ? "bg-secondary font-medium" : ""
            }`}
          >
            {note.title}
          </div>
        ))
      ) : (
        <p className="text-muted-foreground">No notes in this group</p>
      )}
    </div>
  );
}
