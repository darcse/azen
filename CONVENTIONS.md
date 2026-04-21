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
- DB 테이블: `azen_` prefix + snake_case (예: `azen_products`, `azen_categories`)
- 환경변수: UPPER_SNAKE_CASE

## DB 테이블 목록

| 테이블명 | 설명 |
|---|---|
| `azen_categories` | 메인/서브 카테고리 |
| `azen_products` | 제품 목록 |
| `azen_product_images` | 제품 이미지 (Storage URL) |

> 기존 mylibrary/sshwrite와 동일한 Supabase 프로젝트 사용. 테이블 충돌 방지를 위해 `azen_` prefix 필수.

## 컴포넌트 패턴

- named export 사용
- 서버 컴포넌트 기본, 인터랙션 필요 시 'use client'
- props 타입은 인터페이스로 별도 정의

## 스타일 유틸 규칙

- Glass 스타일은 인라인 다크 클래스 대신 `app/globals.css` 유틸 클래스를 사용
- 카드 컴포넌트: `glass-card` 사용 (다크모드에서 elevated 배경/블러/보더 적용)
- 헤더/네비 컨테이너: `glass-header` 사용 (다크모드에서 surface 배경/블러/하단 보더 적용)

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