"use client";

import { useState } from "react";
import type { ReactNode } from "react";

interface AdminDeleteButtonProps {
  action: (formData: FormData) => Promise<void>;
  productId: string;
  productName: string;
  children: ReactNode;
}

export const AdminDeleteButton = ({
  action,
  productId,
  productName,
  children,
}: AdminDeleteButtonProps) => {
  const [isPending, setIsPending] = useState(false);

  const handleAction = async () => {
    const shouldDelete = window.confirm(`"${productName}" 제품을 정말 삭제하시겠습니까?\n삭제 후에는 되돌릴 수 없습니다.`);
    if (!shouldDelete) {
      return;
    }

    try {
      setIsPending(true);
      const formData = new FormData();
      formData.append("id", productId);
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
      className="inline-flex w-36 items-center justify-center gap-1 rounded-md border border-red-500/30 px-2.5 py-2 text-sm text-red-500 hover:bg-red-500/10 disabled:opacity-60"
    >
      {isPending ? "삭제 중..." : children}
    </button>
  );
};
