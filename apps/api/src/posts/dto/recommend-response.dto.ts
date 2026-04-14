// recommend-response.dto.ts
// 추천 토글 API 응답 형식을 정의하는 DTO

export class RecommendResponseDto {
  // 현재 추천 상태 (true: 추천됨, false: 추천 취소됨)
  recommended!: boolean

  // 현재 총 추천 수
  recommendCount!: number
}
