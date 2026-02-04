"use client";

import { trpc } from "@/trpc/client";

export default function SidebarGroups({
  selectedGroupId,
  onSelectGroup,
}: {
  selectedGroupId: number | null;
  onSelectGroup: (id: number) => void;
}) {
  const { data: groups, isLoading } = trpc.noteGroupsRouter.list.useQuery();

  return (
    <div className="w-1/5 bg-gray-100 border-r p-4 space-y-2">
      <h2 className="text-lg font-semibold mb-4">Groups</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        groups?.map((group) => (
          <div
            key={group.id}
            onClick={() => onSelectGroup(group.id)}
            className={`cursor-pointer p-2 rounded-lg hover:bg-gray-200 ${
              selectedGroupId === group.id ? "bg-gray-300 font-medium" : ""
            }`}
          >
            {group.title}
          </div>
        ))
      )}
    </div>
  );
}
