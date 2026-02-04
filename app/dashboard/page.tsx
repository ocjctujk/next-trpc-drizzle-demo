"use client";

import { useState } from "react";
import SidebarGroups from "../components/notes/SidebarGroups";
import NotesList from "../components/notes/NotesList";
import NoteContent from "../components/notes/NoteContent";

export default function NotesApp() {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

  return (
    <div className="flex h-screen text-gray-800">
      <SidebarGroups
        selectedGroupId={selectedGroupId}
        onSelectGroup={(id) => {
          setSelectedGroupId(id);
          setSelectedNoteId(null);
        }}
      />

      <NotesList
        groupId={selectedGroupId}
        selectedNoteId={selectedNoteId}
        onSelectNote={(id) => setSelectedNoteId(id)}
      />

      <NoteContent noteId={selectedNoteId} />
    </div>
  );
}
