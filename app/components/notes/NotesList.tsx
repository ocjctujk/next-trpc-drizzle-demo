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
    <div className="w-1/4 bg-gray-50 border-r p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Notes</h2>
        <button
          className="p-1.5 rounded-lg hover:bg-gray-200"
          title="Add Group"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      <InputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddNote}
        label="New Note Title"
      />
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
