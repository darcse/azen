import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="glass-header border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-6 text-center md:flex-row md:items-start md:justify-start md:gap-x-10 md:text-left">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <Link href="/" aria-label="AZEN 홈으로 이동" className="text-foreground">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="AZEN" className="h-16 w-auto" />
          </Link>
        </div>

        <div className="space-y-1 text-sm text-muted-foreground">
          <p>주소: 경기도 화성시 동탄 000-00</p>
          <p>대표자: 윤준호</p>
          <p>사업자등록번호: 123-45-67890</p>
          <p className="pt-1">© 2026 AZEN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
