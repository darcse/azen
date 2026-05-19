"use client";

import { useEffect, useState } from "react";
import { Copy, Phone, X } from "lucide-react";

export const PHONE_NUMBER = "031-889-0225";
export const PHONE_TEL = `tel:${PHONE_NUMBER}`;

interface PhoneInquiryModalProps {
  open: boolean;
  onClose: () => void;
}

export const PhoneInquiryModal = ({ open, onClose }: PhoneInquiryModalProps) => {
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PHONE_NUMBER);
      onClose();
      setToastVisible(true);
      window.setTimeout(() => setToastVisible(false), 2000);
    } catch {
      setToastVisible(false);
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="phone-modal-title"
          onClick={onClose}
        >
          <div
            className="relative mx-4 w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="닫기"
            >
              <X size={20} aria-hidden />
            </button>

            <div className="flex flex-col items-center gap-4 pt-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Phone size={24} aria-hidden />
              </div>
              <h2 id="phone-modal-title" className="text-lg font-bold text-foreground">
                전화 문의
              </h2>
              <p className="text-3xl font-bold tracking-wide text-foreground">{PHONE_NUMBER}</p>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
              >
                <Copy size={16} aria-hidden />
                복사
              </button>
            </div>
          </div>
        </div>
      )}

      {toastVisible && (
        <p
          role="status"
          className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg"
        >
          복사됐습니다
        </p>
      )}
    </>
  );
};
