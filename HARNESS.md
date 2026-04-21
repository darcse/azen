# HARNESS — azen 개발 하네스

## 개발 흐름

1. **Claude Chat** → 요구사항을 feature 항목으로 변환 → feature_list/ JSON 출력
2. **JW** → feature_list/ JSON 업데이트
3. **Cursor** → feature_list/ 읽고 기능 구현
4. **Claude Code** → feature_list/ 기준 검증 → feedback.md 작성
5. **Cursor** → feedback.md 읽고 수정
6. 반복

## feature_list/ 구조

```
feature_list/
├── init.json      ← 프로젝트 초기 세팅
├── auth.json      ← 관리자 인증
├── page.json      ← 정적 페이지 (회사소개, 교체시공 등)
├── product.json   ← 제품 목록/상세 (공개)
├── admin.json     ← 제품 등록/수정/삭제 (관리자)
└── media.json     ← 이미지 업로드
```

## passes 필드 운영

- `"passes": false` → 미구현 또는 검증 실패
- `"passes": true`  → Claude Code 검증 통과

## Cursor 작업 지침

- 구현 전 feature_list/의 해당 JSON 파일을 먼저 읽는다
- 한 번에 하나의 feature ID만 구현한다
- 구현 완료 후 claude-progress.txt에 작업 내용을 기록한다
