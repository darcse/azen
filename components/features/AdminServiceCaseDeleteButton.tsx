"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

interface AdminServiceCaseDeleteButtonProps {
  action: (formData: FormData) => Promise<void>;
  caseId: string;
  caseTitle: string;
  compact?: boolean;
}

export const AdminServiceCaseDeleteButton = ({
  action,
  caseId,
  caseTitle,
  compact = false,
}: AdminServiceCaseDeleteButtonProps) => {
  const [isPending, setIsPending] = useState(false);

  const handleAction = async () => {
    const shouldDelete = window.confirm(`"${caseTitle}" 시공사례를 정말 삭제하시겠습니까?\n삭제 후에는 되돌릴 수 없습니다.`);
    if (!shouldDelete) {
      return;
    }

    try {
      setIsPending(true);
      const formData = new FormData();
      formData.append("id", caseId);
      await action(formData);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAction}
      disabled={isPending}
      className={`inline-flex items-center justify-center gap-1 rounded-md border border-red-500/30 text-red-500 hover:bg-red-500/10 disabled:opacity-60 ${
        compact ? "px-3 py-2 text-xs" : "w-36 px-2.5 py-2 text-sm"
      }`}
    >
      <Trash2 size={14} />
      {isPending ? "삭제 중..." : "삭제"}
    </button>
  );
};
