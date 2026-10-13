/** 경로 변수로 쓰일 리소스 ID를 검증하고 문자열로 변환합니다. */
export function toPathId(id: number): string {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new TypeError(`Invalid resource id: ${String(id)}`);
  }
  return String(id);
}
