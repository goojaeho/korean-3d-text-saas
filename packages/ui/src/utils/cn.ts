/**
 * 클래스명을 조건부로 결합하는 유틸리티 함수
 * clsx의 경량화 버전
 */
export function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs
    .filter(Boolean)
    .join(' ')
    .trim();
}