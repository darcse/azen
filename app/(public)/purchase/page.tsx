export default function PurchasePage() {
  return (
    <main className="bg-background text-foreground">
      <section
        className="relative w-full overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/elec.webp')", minHeight: "300px" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex min-h-[300px] items-end">
          <div className="mx-auto w-full max-w-6xl px-4 py-12">
            <h1 className="text-3xl font-bold text-white md:text-4xl">구매대행</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/80 md:text-base">
              필요하신 모든 전기부품 및 산업용 기자재를 빠르고 정확하게 찾아드립니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-8 py-16">
        <article className="glass-card rounded-2xl border border-border bg-background p-8 md:p-10">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground md:text-3xl">
            AZEN 제품 구매대행
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
            견적 비교부터 통관, 배송까지 원스톱으로 해결해 드립니다.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">대행 품목</h3>
              <p className="mt-2 text-base leading-7 text-foreground">
                국내외 전기부품, 제어기기, 자동화 부품 및 기타 산업 소모품 전반
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">이용 장점</h3>
              <p className="mt-2 text-base leading-7 text-foreground">
                최적의 공급선 확보를 통한 원가 절감, 복잡한 수입 절차 대행
              </p>
            </div>
          </div>
        </article>

        <article className="mt-8 rounded-2xl bg-primary p-8 text-white md:p-10">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] md:text-3xl">구매 및 견적 문의</h2>
          <p className="mt-4 text-base leading-7 text-white/90 md:text-lg">
            다양한 제품의 구매대행이 필요하시다면 아래 연락처로 편하게 문의해 주세요.
          </p>

          <dl className="mt-8 space-y-4 text-base md:text-lg">
            <div>
              <dt className="text-sm font-semibold uppercase tracking-[0.12em] text-white/70">담당자</dt>
              <dd className="mt-1 font-medium">이황범 부장</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold uppercase tracking-[0.12em] text-white/70">전화</dt>
              <dd className="mt-1">
                <a href="tel:010-4803-6730" className="font-medium underline-offset-4 hover:underline">
                  010-4803-6730
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold uppercase tracking-[0.12em] text-white/70">이메일</dt>
              <dd className="mt-1">
                <a
                  href="mailto:bum2002@kakao.com"
                  className="font-medium underline-offset-4 hover:underline"
                >
                  bum2002@kakao.com
                </a>
              </dd>
            </div>
          </dl>
        </article>
      </section>
    </main>
  );
}
