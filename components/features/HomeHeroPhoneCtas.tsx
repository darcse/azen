"use client";

import { useCallback, useState } from "react";
import { Phone } from "lucide-react";
import { PHONE_TEL, PhoneInquiryModal } from "@/components/features/PhoneInquiryModal";

const openPhoneModalOnDesktop = (event: React.MouseEvent<HTMLAnchorElement>, openModal: () => void) => {
  if (window.matchMedia("(min-width: 768px)").matches) {
    event.preventDefault();
    openModal();
  }
};

export const HomeHeroPhoneCtas = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <a
          href={PHONE_TEL}
          onClick={(event) => openPhoneModalOnDesktop(event, openModal)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-transform duration-200 active:scale-95 dark:bg-[#0A84FF]"
        >
          <Phone size={16} aria-hidden />
          견적 문의
        </a>
        <a
          href={PHONE_TEL}
          onClick={(event) => openPhoneModalOnDesktop(event, openModal)}
          className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white"
        >
          <Phone size={16} aria-hidden />
          교체시공 문의
        </a>
      </div>
      <PhoneInquiryModal open={modalOpen} onClose={closeModal} />
    </>
  );
};
