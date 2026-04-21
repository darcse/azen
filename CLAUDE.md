# azen

공업용 필터 판매 회사 홈페이지. 회사 소개 및 제품 소개, 관리자 제품 등록/수정/삭제 기능 포함.

## 스택
- Next.js App Router + TailwindCSS
- Supabase (Auth + PostgreSQL + RLS + Storage)
- Vercel 배포
- 폰트: Pretendard

## 코딩 규칙
- TypeScript 사용, any 타입 지양
- 컴포넌트는 named export 사용
- 서버 컴포넌트 우선, 필요할 때만 'use client'
- 환경변수는 .env.local 사용, 절대 하드코딩 금지

## Git 규칙
- worktree 사용 금지
- main 브랜치에 직접 push
- PR 없음
- 커밋 메시지: 한국어 Conventional Commits
  - feat: 새 기능
  - fix: 버그 수정
  - refactor: 리팩토링
  - chore: 설정 변경
  - docs: 문서 수정

## 작업 방식
- feature_list/ 폴더의 JSON 파일을 단일 소스로 삼는다
- 항목별 승인 후 진행 (scope creep 금지)
- 커밋 전 반드시 확인
- 세션 종료 시 claude-progress.txt에 작업 내용 기록
