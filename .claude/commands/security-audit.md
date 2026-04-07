# /security-audit

CEO가 security 에이전트를 직접 호출하여 보안 점검을 수행하는 커맨드.

## 사용법
```
/security-audit              # 전체 점검
/security-audit auth         # 인증/인가 집중 점검
/security-audit dependencies # 의존성 취약점 집중 점검
```

security 에이전트에게 아래 형식으로 지시한다:

```
[CEO 보안 점검 지시]

범위: $ARGUMENTS (비어있으면 전체)

security 에이전트는:
1. 해당 범위의 보안 점검 체크리스트를 전부 수행하라
2. 발견된 모든 취약점을 심각도별로 분류하라
3. 보안 점검 보고서 포맷에 맞춰 CEO에게 직접 보고하라
4. Critical/High 이슈는 즉시 수정 방향을 제시하라
```
