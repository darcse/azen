"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Factory, ShieldCheck, Truck, Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const productCards = [
  {
    id: "air-handling",
    title: "공조기 필터",
    description: "대형 공조 시스템 환경에 최적화된 고성능 필터",
    image:
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "dust-collector",
    title: "집진기 필터",
    description: "분진 환경의 포집 효율을 높이는 산업용 집진 필터",
    image:
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "water-treatment",
    title: "수처리 필터",
    description: "수질 안정성과 공정 효율을 위한 정밀 여과 솔루션",
    image:
      "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "others",
    title: "기타 품목",
    description: "현장 요구사항에 맞는 다양한 산업용 필터 품목",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "electric-parts",
    title: "전기 부품",
    description: "산업 설비 운영에 필요한 핵심 전기 부품 공급",
    image:
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "hydraulic",
    title: "유공압",
    description: "유압·공압 계통의 안정성을 높이는 부품 라인업",
    image:
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1600&q=80",
  },
];

const featureCards = [
  {
    title: "산업 현장 맞춤 제안",
    description: "업종별 오염원과 설비 특성을 반영한 맞춤형 제품 추천",
    icon: Factory,
    image:
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "품질 검수 프로세스",
    description: "출고 전 규격/성능 검수로 안정적인 운영 지원",
    icon: ShieldCheck,
    image:
      "https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "신속한 납품",
    description: "요청 일정에 맞춰 전국 단위 납품 대응",
    icon: Truck,
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "사후 기술 지원",
    description: "설치 이후 교체 주기와 운영 이슈까지 지속 관리",
    icon: Wrench,
    image:
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function Home() {
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    const updateItemsPerView = () => {
      setItemsPerView(window.innerWidth < 768 ? 1 : 3);
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStartIndex((prev) => (prev + 1) % productCards.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const trackCards = useMemo(
    () => [...productCards, ...productCards.slice(0, itemsPerView)],
    [itemsPerView],
  );

  const moveCarousel = (direction: "prev" | "next") => {
    setStartIndex((prev) => {
      if (direction === "next") return (prev + 1) % productCards.length;
      return (prev - 1 + productCards.length) % productCards.length;
    });
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.changedTouches[0].clientX);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const endX = event.changedTouches[0].clientX;

    if (touchStartX === null) return;

    const deltaX = touchStartX - endX;
    const swipeThreshold = 40;

    if (deltaX > swipeThreshold) moveCarousel("next");
    if (deltaX < -swipeThreshold) moveCarousel("prev");
  };

  return (
    <>
      <section
        className="relative w-full overflow-hidden bg-cover bg-center min-h-[600px]"
        style={{
          backgroundImage: "url('/hero-factory.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 mx-auto flex min-h-[600px] w-full max-w-6xl items-center px-4 py-16 md:px-6 md:py-24">
          <div className="max-w-2xl space-y-4 lg:space-y-6">
            <p className="inline-flex items-center rounded-full border border-[#2b4f86] bg-[#13223a]/90 px-5 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-[#82aef5] shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)] dark:border-[#2b4f86] dark:bg-[#13223a]/90 dark:text-[#82aef5]">
              AZEN INDUSTRIAL SOLUTIONS
            </p>
            <h1 className="font-english text-3xl font-bold leading-tight text-white md:text-5xl">
              <span className="text-primary dark:text-[#0A84FF]">멈추지 않는 공정,</span>
              <br />
              빈틈없는 필터 케어 솔루션
            </h1>
            <p className="max-w-xl text-sm leading-7 text-white/80 md:text-base">
              적기 수급부터 정밀 시공까지, 산업용 필터 관리의 모든 과정을 책임집니다. 집진기,
              유공압 부품 등 현장에 필요한 최상의 파츠를 가장 빠르게 연결해 드립니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-transform duration-200 active:scale-95 dark:bg-[#0A84FF]"
              >
                현장 진단 신청
              </Link>
              <Link
                href="/service"
                className="rounded-md border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white"
              >
                교체시공 문의
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl space-y-20 px-4 pt-12 pb-20 md:px-6 md:py-16 lg:space-y-32 lg:pt-24 lg:pb-32">
        <section className="space-y-6 lg:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Products</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => moveCarousel("prev")}
              className="glass-card rounded-md border border-border bg-background p-2"
              aria-label="이전 제품 카드"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => moveCarousel("next")}
              className="glass-card rounded-md border border-border bg-background p-2"
              aria-label="다음 제품 카드"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div
            className="flex gap-4 transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(calc(-${startIndex * (100 / itemsPerView)}% - ${startIndex * (1 / itemsPerView)}rem))`,
            }}
          >
            {trackCards.map((card, idx) => (
              <Link
                key={`${card.id}-${idx}`}
                href={`/products/${card.id}`}
                className="glass-card w-full shrink-0 overflow-hidden rounded-lg border border-border bg-background md:w-[calc((100%-2rem)/3)]"
              >
                <div className="relative h-[22rem] w-full">
                  <Image src={card.image} alt={card.title} fill className="object-cover" />
                </div>
                <div className="p-5 lg:p-6 dark:bg-[#111114]">
                  <h3 className="mb-2 text-lg font-semibold text-foreground dark:text-white">{card.title}</h3>
                  <p className="text-sm text-muted-foreground dark:text-white/80">{card.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        </section>

        <section className="space-y-6 lg:space-y-8">
        <h2 className="text-2xl font-semibold text-foreground">Core Values</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {featureCards.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href="/about"
                className="glass-card group relative h-[14rem] overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(255,255,255,0.08)] md:h-[28rem]"
              >
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 transition-colors duration-300 group-hover:bg-black/25" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 lg:p-6">
                  <Icon className="mb-2 h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
                  <h3 className="mb-1 text-sm font-semibold text-white md:text-base">{feature.title}</h3>
                  <p className="text-xs text-white/80 md:text-sm">{feature.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
        </section>
      </main>
    </>
  );
}
