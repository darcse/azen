# CONVENTIONS — azen 코딩 컨벤션

## 폴더 구조

```
azen/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── (public)/
│   │   ├── about/page.tsx          ← 회사소개
│   │   ├── products/
│   │   │   ├── page.tsx            ← 제품 목록
│   │   │   └── [id]/page.tsx       ← 제품 상세
│   │   └── service/page.tsx        ← 교체시공
│   ├── admin/
│   │   ├── page.tsx                ← 관리자 대시보드
│   │   └── products/
│   │       ├── new/page.tsx        ← 제품 등록
│   │       └── [id]/edit/page.tsx  ← 제품 수정
│   └── login/page.tsx
├── components/
│   ├── ui/                         ← 재사용 기본 UI
│   ├── layout/                     ← Header, Footer, Nav
│   └── features/                   ← 기능별 컴포넌트
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts (루트의 middleware.ts에서 import)
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

## 네이밍 컨벤션

- 컴포넌트 파일: PascalCase (`ProductCard.tsx`)
- 훅: camelCase, use 접두사 (`useProducts.ts`)
- 유틸: camelCase (`formatDate.ts`)
- DB 테이블: snake_case (`product_images`)
- 환경변수: UPPER_SNAKE_CASE

## 컴포넌트 패턴

- named export 사용
- 서버 컴포넌트 기본, 인터랙션 필요 시 'use client'
- props 타입은 인터페이스로 별도 정의

## 카테고리 구조 (DB 기준)

메인 카테고리:
- filter (필터)
- electric (전기/유공압)
- service (교체시공)

서브 카테고리 (filter):
- air_handling     ← 공조기 필터
- dust_collector   ← 집진기 필터
- water_treatment  ← 수처리 필터
- others           ← 기타 품목

서브 카테고리 (electric):
- electric_parts   ← 전기 부품
- hydraulic        ← 유공압
