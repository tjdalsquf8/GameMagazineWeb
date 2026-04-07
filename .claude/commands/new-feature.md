# /new-feature

새 기능 개발을 orchestrator에게 지시하는 커맨드.

## 사용법
```
/new-feature [기능 설명]
```

## 예시
```
/new-feature 뉴스 목록 페이지에 카테고리 필터 추가
/new-feature 커뮤니티 게시글 좋아요 기능 구현
```

orchestrator에게 아래 형식으로 임무를 전달한다:

```
[CEO 임무 지시]

기능: $ARGUMENTS

요구사항:
- 위 기능을 분석하고 frontend/backend 작업을 분배하라
- 구현 완료 후 QA 검증을 수행하라
- 전체 완료 후 CEO에게 보고하라

완료 기준:
- 기능이 정상 동작
- 타입 에러 없음
- QA 통과
```
