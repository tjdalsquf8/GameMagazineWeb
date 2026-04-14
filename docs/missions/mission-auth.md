# MISSION: 로그인 / 회원가입 구현

## 운영 원칙

- 중간에 CEO에게 질문하거나 확인을 구하지 않는다
- 모호한 부분은 합리적으로 판단하고 진행, 최종 보고서에 명시
- 완료 후 한 번만 보고

---

## 기술 스택 컨텍스트

- **Frontend**: Next.js 14 App Router / TypeScript / Tailwind CSS
- **Backend**: NestJS / Prisma ORM
- **Auth**: Passport.js + JWT (이메일 방식)
- **Email**: Nodemailer + 네이버 SMTP
- **DB 모델**: `users`, `email_verifications` (schema.prisma 참고)

---

## 1. 회원가입 플로우

```
Step 1. 닉네임 + 이메일 입력
        ↓ (인증 코드 발송 API → 네이버 SMTP 실제 발송)
Step 2. 이메일 인증 코드 입력 (6자리)
        ↓ (인증 코드 확인 API)
Step 3. 비밀번호 + 비밀번호 확인 입력
        ↓ (회원가입 완료 API)
완료 → 로그인 페이지로 이동
```

---

## 2. 로그인 플로우

```
이메일 + 비밀번호 입력
↓
로그인 API → JWT 발급
↓
accessToken → Zustand (메모리)
refreshToken → HttpOnly Cookie
↓
메인 페이지로 이동
```

---

## 3. Backend 구현 명세

### 이메일 발송 (Nodemailer + 네이버 SMTP)

```typescript
// 패키지 설치
// pnpm add nodemailer
// pnpm add -D @types/nodemailer

// SMTP 설정
host: "smtp.naver.com";
port: 465;
secure: true;
auth: user: process.env.MAIL_USER;
pass: process.env.MAIL_PASSWORD;

// 발송 형식
제목: "[Game Magazine] 이메일 인증 코드";
내용: "인증 코드: 123456 (5분 이내 입력해주세요)";
```

### API 엔드포인트

| Method | URL                         | 설명           | 인증   | Rate Limit |
| ------ | --------------------------- | -------------- | ------ | ---------- |
| POST   | /api/auth/email/send-code   | 인증 코드 발송 | 불필요 | 10회/분    |
| POST   | /api/auth/email/verify-code | 인증 코드 확인 | 불필요 | 10회/분    |
| POST   | /api/auth/register          | 회원가입 완료  | 불필요 | 10회/분    |
| POST   | /api/auth/login             | 로그인         | 불필요 | 10회/분    |
| POST   | /api/auth/logout            | 로그아웃       | 필요   | 기본       |
| POST   | /api/auth/refresh           | 토큰 갱신      | 불필요 | 기본       |

> 인증 관련 엔드포인트는 기본 Throttler(100회/분)보다 엄격하게 별도 적용

### 인증 코드 발송 (POST /api/auth/email/send-code)

```typescript
// Request
{ email: string }

// 처리
- 이미 가입된 이메일 → 409 에러
- 같은 이메일로 5분 내 3회 초과 발송 시 → 429 에러 ("잠시 후 다시 시도해주세요")
- 기존 미인증 레코드 있으면 upsert (재발송 허용)
- 6자리 랜덤 숫자 코드 생성 (Math.random 아닌 crypto 모듈 사용)
- 만료 시간: 현재 시각 + 5분
- 네이버 SMTP로 실제 인증 메일 발송

// Response
{ message: "인증 코드가 발송되었습니다" }
```

### 인증 코드 확인 (POST /api/auth/email/verify-code)

```typescript
// Request
{ email: string, code: string }

// 처리
- 레코드 없음 → 400 에러
- 코드 불일치 → 400 에러 ("인증 코드가 올바르지 않습니다")
- 만료된 코드 → 400 에러 ("인증 코드가 만료되었습니다")
- 일치 → is_verified = true 업데이트

// Response
{ verified: true }
```

### 회원가입 (POST /api/auth/register)

```typescript
// Request
{ email: string, nickname: string, password: string }

// 처리
- email_verifications 에서 is_verified 확인 → false면 400 ("이메일 인증이 필요합니다")
- 이메일 중복 → 409 에러
- 닉네임 중복 → 409 에러
- 비밀번호 bcrypt 해싱 (rounds: 12)
- users 생성 후 email_verifications 레코드 삭제 (인증 완료 정리)

// Response
{ user: User }
```

### 로그인 (POST /api/auth/login)

```typescript
// Request
{ email: string, password: string }

// 처리
- 이메일 없거나 비밀번호 불일치 → 401 에러
  → 반드시 동일 메시지: "이메일 또는 비밀번호가 올바르지 않습니다"
  → 이메일 존재 여부를 외부에 노출하지 않음 (계정 열거 공격 방지)
- accessToken (1h), refreshToken (30d) 발급
- refreshToken → HttpOnly, Secure, SameSite=Strict Cookie 설정

// Response
{ user: User, accessToken: string }
```

---

## 4. 보안 / 예외처리 명세

### 입력값 검증 (class-validator — 백엔드)

```
email:    @IsEmail() — 이메일 형식 강제
nickname: @Matches(/^[가-힣a-zA-Z0-9]{2,20}$/) — 허용 문자 화이트리스트
password: @MinLength(8) + @Matches(/^(?=.*[A-Za-z])(?=.*\d)/) — 영문+숫자 조합
code:     @Matches(/^\d{6}$/) — 6자리 숫자만
```

> **모든 DTO에 class-validator 적용 필수. 검증 실패 시 400 + 구체적 에러 메시지 반환**

### SQL Injection 방지

```
- Prisma ORM 파라미터 바인딩 사용 (기본 방어)
- $queryRaw / $executeRaw 사용 절대 금지
- 사용자 입력값을 쿼리에 직접 삽입 금지
```

### XSS 방지

```
- 모든 입력값 class-validator whitelist: true 적용
- DTO에 없는 필드 자동 제거 (forbidNonWhitelisted: true)
- HTML 태그 허용 안 함 (@IsString + @Matches로 허용 문자 제한)
```

### Rate Limiting (인증 엔드포인트 전용)

```typescript
// 인증 컨트롤러에 별도 Throttler 적용
@Throttle({ default: { limit: 10, ttl: 60000 } })
// → 동일 IP에서 1분에 10회 초과 시 429 에러
```

### 이메일 인증 재발송 제한

```
- 5분 내 동일 이메일 3회 초과 발송 시 429 차단
- email_verifications.created_at 기준으로 판단
```

### 민감 정보 보호

```
- API 응답에 password 필드 절대 포함 금지
- 로그에 비밀번호, 인증 코드 출력 금지
- refreshToken은 Cookie로만 전달 (response body 포함 금지)
```

---

## 5. Frontend 구현 명세

### 파일 구조

```
apps/web/src/
├── app/
│   └── (auth)/
│       ├── layout.tsx          # Header/Footer 없는 심플 레이아웃
│       ├── login/
│       │   └── page.tsx
│       └── register/
│           └── page.tsx
├── components/
│   └── auth/
│       ├── LoginForm.tsx
│       ├── RegisterStep1.tsx    # 닉네임 + 이메일
│       ├── RegisterStep2.tsx    # 인증 코드 입력
│       └── RegisterStep3.tsx    # 비밀번호 입력
└── hooks/
    └── useAuth.ts
```

### UI/UX 요구사항

- 전체 화면 중앙 정렬 카드 레이아웃
- 회원가입 Step 전환 시 슬라이드 애니메이션
- 각 Step 상단 진행 표시바 (1/3, 2/3, 3/3)
- 로딩 중 버튼 비활성화 + 스피너
- 에러 메시지 입력 필드 하단 인라인 표시

### 프론트엔드 유효성 검사 (실시간)

```
닉네임:      2~20자, 한글/영문/숫자만
이메일:      이메일 형식
인증코드:    6자리 숫자만
비밀번호:    8자 이상, 영문+숫자 조합
비밀번호확인: 비밀번호와 일치 여부
```

> 백엔드 검증과 이중으로 적용 (프론트 검증만 믿지 않음)

### 재발송 제한 (프론트)

```
- 인증 코드 발송 후 재발송 버튼 60초 쿨다운 타이머
- 타이머 중 버튼 비활성화 + 남은 시간 표시 ("재발송 (45초)")
```

---

## 6. 작업 순서 (Orchestrator 지침)

```
1. backend: nodemailer 패키지 설치 + MailModule 구현
2. backend: Auth 모듈 구현 (send-code, verify-code, register, login)
3. backend: 보안 처리 (Rate Limit, DTO 검증, Cookie 설정)
4. backend → QA: 정상 케이스 + 에러/보안 케이스 전체 검증
5. frontend: 인증 페이지 UI 구현 + API 연동
6. frontend → QA: UI/UX + 유효성 검사 + 재발송 타이머 검증
7. orchestrator → CEO 보고
```

---

## 7. 완료 기준 (Done Criteria)

```
□ 네이버 메일로 인증 코드 실제 수신 확인
□ 5분 내 3회 초과 발송 시 429 에러 확인
□ 만료/불일치 코드 에러 처리 확인
□ 회원가입 완료 후 users 테이블 생성, email_verifications 삭제 확인
□ 로그인 실패 시 이메일/비밀번호 구분 없는 동일 메시지 확인
□ refreshToken이 HttpOnly Cookie로 설정되는지 확인
□ API 응답에 password 필드 없는지 확인
□ 재발송 버튼 60초 쿨다운 동작 확인
□ 타입 에러 없음 (tsc --noEmit)
□ QA 테스트 통과
```
