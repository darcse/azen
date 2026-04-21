# INIT-003 검증 체크리스트

아래는 `supabase/init-003.sql` 실행 후 확인 항목입니다.

1. `storage.buckets`에서 `product-images` 버킷이 `public=true`인지 확인
2. 비로그인 상태에서 업로드된 이미지 URL 직접 접근 성공 확인
3. 비로그인 상태 업로드 시도 시 권한 에러 확인
4. 관리자(`app_metadata.role=admin`) 로그인 상태 업로드 성공 확인
5. `.exe` 등 비허용 MIME 업로드 실패 확인

## 참고 쿼리

```sql
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id = 'product-images';
```
