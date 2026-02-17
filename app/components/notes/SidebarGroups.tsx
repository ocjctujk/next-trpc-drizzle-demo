"use client";

import { trpc } from "@/trpc/client";
import { Plus } from "lucide-react";
import InputModal from "../common/InputModal";
import { useState } from "react";

export default function SidebarGroups({
  selectedGroupId,
  onSelectGroup,
}: {
  selectedGroupId: number | null;
  onSelectGroup: (id: number) => void;
}) {
  const {
    data: groups,
    isLoading,
    refetch,
  } = trpc.noteGroupsRouter.list.useQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const createGroup = trpc.noteGroupsRouter.create.useMutation({
    onSuccess: () => {
      console.log("Group created!");
      // Optionally refetch groups list
      refetch();
    },
  });
  const handleAddGroup = (name: string) => {
    console.log("New group:", name);
    // When user submits form
    createGroup.mutate({ title: name });
    // call trpc.noteGroups.create.mutate({ title: name });
  };
  return (
    <div className="w-1/5 border-r p-4 space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Groups</h2>
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
        onSubmit={handleAddGroup}
        label="New Group Name"
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        groups?.map((group) => (
          <div
            key={group.id}
            onClick={() => onSelectGroup(group.id)}
            className={`cursor-pointer p-2 rounded-lg hover:bg-secondary ${
              selectedGroupId === group.id ? "font-medium" : ""
            }`}
          >
            {group.title}
          </div>
        ))
      )}
    </div>
  );
}
