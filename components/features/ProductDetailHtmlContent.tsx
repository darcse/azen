"use client";

import createDOMPurify from "dompurify";
import { useEffect, useMemo, useState } from "react";
import { applyLineBreaksAsHtmlBr } from "@/lib/html-content-newlines-to-br";

interface ProductDetailHtmlContentProps {
  html: string;
  className: string;
}

/**
 * 관리자 입력 HTML이 브라우저 파서에 의해 서버/클라 DOM이 달라지며 hydration 오류가 나는 경우를 막기 위해,
 * 마운트 이후에만 본문을 주입한다.
 */
export function ProductDetailHtmlContent({ html, className }: ProductDetailHtmlContentProps) {
  const [mounted, setMounted] = useState(false);
  const proseClassName = `prose max-w-none ${className}`.trim();
  const sanitizedHtml = useMemo(() => {
    if (!mounted) return "";
    return createDOMPurify(window).sanitize(applyLineBreaksAsHtmlBr(html));
  }, [html, mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={proseClassName} suppressHydrationWarning />;
  }

  return (
    <div
      className={proseClassName}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
