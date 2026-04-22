/**
 * 관리자 HTML textarea에서 저장된 줄바꿈(`\n`)을 공개 페이지에서 줄로 보이도록 `<br />`로 바꿉니다.
 * (textarea에는 그대로 줄바꿈만 두고, 렌더링 단계에서만 변환)
 */
export function applyLineBreaksAsHtmlBr(html: string): string {
  return html.replace(/\r?\n/g, "<br />");
}
