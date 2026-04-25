# CONVENTIONS.md — azen

## 프로젝트 개요

공업용 필터 판매 회사 홈페이지. 회사 소개·제품 소개·관리자 제품 등록/수정/삭제 기능 포함.

---

## 기술 스택

- Framework: Next.js App Router + TailwindCSS v4
- Database: Supabase (Auth + PostgreSQL + RLS + Storage)
- Deployment: Vercel
- Font: Pretendard

---

## 폴더 구조

```
azen/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── (public)/
│   │   ├── about/page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── service/page.tsx
│   ├── admin/
│   │   ├── page.tsx
│   │   └── products/
│   │       ├── new/page.tsx
│   │       └── [id]/edit/page.tsx
│   └── login/page.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   └── features/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   └── utils.ts
├── hooks/
├── types/
│   └── index.ts
├── feature_list/
├── middleware.ts
├── .env.local
├── CLAUDE.md
├── HARNESS.md
└── CONVENTIONS.md
```

---

## DB 테이블 prefix

모든 테이블은 `azen_` prefix 사용.
mylibrary·sshwrite와 동일한 Supabase 프로젝트 공유 — 충돌 방지 필수.

| 테이블명 | 설명 |
|---|---|
| `azen_categories` | 메인/서브 카테고리 |
| `azen_products` | 제품 목록 |
| `azen_product_images` | 제품 이미지 (Storage URL) |

---

## 환경변수

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 카테고리 구조

메인 카테고리:
- `filter` — 필터
- `electric` — 전기/유공압
- `service` — 교체시공

서브 카테고리 (filter):
- `air_handling` — 공조기 필터
- `dust_collector` — 집진기 필터
- `water_treatment` — 수처리 필터
- `others` — 기타 품목

서브 카테고리 (electric):
- `electric_parts` — 전기 부품
- `hydraulic` — 유공압

---

## 스타일 규칙

- Glass 스타일: `globals.css` 유틸 클래스 사용
  - 카드: `glass-card`
  - 헤더: `glass-header`
- 커스텀 클래스: `@layer utilities` 필수 (Tailwind v4)
- 조합 선택자(`.prose h3` 등): 별도 CSS 파일로 분리 후 `layout.tsx`에서 import