# MISSION: 이미지 업로드 — Frontend

## 운영 원칙

- 중간에 CEO에게 질문하거나 확인을 구하지 않는다
- 모호한 부분은 합리적으로 판단하고 진행, 최종 보고서에 명시
- 완료 후 한 번만 보고
- **백엔드 미션 완료 후 진행**

---

## 기술 스택 컨텍스트

- **Frontend**: Next.js 14 App Router / TypeScript / Tailwind CSS
- **에디터 방식**: contenteditable div (DC인사이드 방식)
- **XSS 방지**: DOMPurify (필수)
- **패키지**: `dompurify`, `@types/dompurify`
- **연동 API**: `POST /api/uploads/presigned-url`
- **아이콘**: lucide-react

---

## 1. 기능 개요

게시글 작성 시 이미지를 모달을 통해 업로드하고,
contenteditable 에디터 본문에 이미지가 인라인으로 삽입된다.

```
이미지 버튼 클릭 → 업로드 모달 오픈
→ 파일 선택 또는 드래그&드롭
→ R2 직접 업로드 (presigned URL)
→ 업로드 완료 → 에디터 커서 위치에 <img> 삽입
→ 모달 닫기 → 텍스트 계속 작성
```

---

## 2. 제한 사항

```
- 최대 5장
- 장당 최대 10MB
- 허용 확장자: png, jpg, jpeg, webp
- 초과 시 에러 토스트 표시
```

---

## 3. 파일 구조

```
apps/web/src/
├── components/
│   ├── community/
│   │   └── WriteForm.tsx          ← contenteditable 에디터로 교체
│   └── ui/
│       ├── ImageUploadModal.tsx   ← 신규 (이미지 업로드 모달)
│       └── ContentEditor.tsx      ← 신규 (contenteditable 에디터)
├── hooks/
│   └── useImageUpload.ts          ← 신규 (R2 업로드 로직)
└── lib/
    └── utils/
        └── sanitize.ts            ← 신규 (DOMPurify 래퍼)
```

---

## 4. 컴포넌트 상세 명세

### ImageUploadModal.tsx

```typescript
interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (urls: string[]) => void; // 업로드 완료된 URL 배열 반환
  currentCount: number; // 현재 업로드된 이미지 수
  maxCount?: number; // 기본값 5
}
```

**UI 구성 (DC인사이드 참고)**

```
┌─────────────────────────────┐
│ 이미지 업로드      [X 닫기] │
├─────────────────────────────┤
│  [+ 이미지 추가]            │
│                             │
│  ┌─────────────────────┐   │
│  │   드래그&드롭 영역   │   │
│  │   또는 클릭하여      │   │
│  │   파일 선택          │   │
│  └─────────────────────┘   │
│                             │
│  업로드된 이미지 미리보기   │
│  [썸네일] [썸네일] [X]      │
│                             │
│  • 최대 5장, 장당 10MB      │
│  • png, jpg, jpeg, webp    │
├─────────────────────────────┤
│        [취소]  [적용]       │
└─────────────────────────────┘
```

**동작 규칙**

```
- 파일 선택 즉시 presigned URL 발급 → R2 업로드 시작
- 업로드 중 프로그레스 바 표시
- 업로드 완료된 이미지 썸네일 미리보기
- X 버튼으로 개별 이미지 제거
- 5장 초과 시 추가 버튼 비활성화 + "최대 5장까지 업로드 가능합니다" 토스트
- 10MB 초과 파일 선택 시 즉시 에러 토스트, 해당 파일 제외
- 허용되지 않는 확장자 선택 시 에러 토스트
- [적용] 클릭 시 onUpload(urls) 호출 후 모달 닫기
```

---

### ContentEditor.tsx

```typescript
interface ContentEditorProps {
  value: string; // HTML 문자열
  onChange: (html: string) => void;
  onImageButtonClick: () => void; // 이미지 모달 오픈 트리거
  placeholder?: string;
}
```

**에디터 구조**

```
┌─────────────────────────────┐
│ [이미지] 버튼 툴바          │  ← 상단 툴바 (이미지 버튼만)
├─────────────────────────────┤
│                             │
│  contenteditable div        │  ← 실제 편집 영역
│  (이미지 + 텍스트 혼재)     │
│                             │
└─────────────────────────────┘
```

**이미지 삽입 방법**

```typescript
// 업로드 완료 후 커서 위치에 <img> 삽입
const insertImagesAtCursor = (urls: string[]) => {
  const selection = window.getSelection();
  urls.forEach((url) => {
    const img = document.createElement("img");
    img.src = url;
    img.style.maxWidth = "100%";
    // 커서 위치에 삽입
    selection?.getRangeAt(0).insertNode(img);
  });
};
```

---

### sanitize.ts (DOMPurify 래퍼)

```typescript
import DOMPurify from "dompurify";

// 허용 태그/속성 화이트리스트
const ALLOWED_TAGS = ["p", "br", "img", "strong", "em", "u", "div", "span"];
const ALLOWED_ATTR = ["src", "alt", "style"];

export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // src는 https:// 로 시작하는 URL만 허용
    FORCE_BODY: true,
  });
}

// 상세 페이지 렌더링 시 사용
// dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }}
```

---

### useImageUpload.ts

```typescript
// presigned URL 발급 → R2 직접 PUT 업로드
const useImageUpload = () => {
  const upload = async (file: File): Promise<string> => {
    // 1. 클라이언트 검증 (MIME, 크기)
    // 2. POST /api/uploads/presigned-url → { uploadUrl, publicUrl }
    // 3. PUT uploadUrl (R2 직접 업로드)
    // 4. publicUrl 반환
  };
  return { upload, isLoading, progress };
};
```

---

## 5. WriteForm.tsx 수정

기존 textarea → ContentEditor + ImageUploadModal 조합으로 교체

```typescript
// 상태
const [content, setContent] = useState("");
const [isImageModalOpen, setIsImageModalOpen] = useState(false);
const [uploadedImageCount, setUploadedImageCount] = useState(0);

// 이미지 업로드 완료 핸들러
const handleImagesUploaded = (urls: string[]) => {
  // ContentEditor에 이미지 삽입
  setUploadedImageCount((prev) => prev + urls.length);
};

// 제출 전 sanitize
const handleSubmit = async () => {
  const cleanContent = sanitizeHTML(content);
  await createPost({ title, content: cleanContent, categoryId });
};
```

---

## 6. 상세 페이지 렌더링 수정 (PostDetail.tsx)

```typescript
// 기존 텍스트 렌더링 → sanitize 후 HTML 렌더링
<div
  className="post-content prose max-w-none"
  dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }}
/>
```

---

## 7. 보안 처리

```
클라이언트 검증 (UX용):
- 파일 선택 즉시 MIME 타입, 크기 체크
- 5장 초과 시 추가 차단

DOMPurify (XSS 방지 — 핵심):
- 저장 전 sanitizeHTML() 적용
- 상세 페이지 렌더링 전 sanitizeHTML() 적용
- <script>, onclick, onerror 등 이벤트 핸들러 모두 제거
- src 속성은 https:// URL만 허용

dangerouslySetInnerHTML:
- 반드시 sanitizeHTML() 통과한 값만 사용
- raw HTML 직접 렌더링 절대 금지
```

---

## 8. 패키지 설치

```bash
cd apps/web
pnpm add dompurify
pnpm add -D @types/dompurify
```

---

## 9. 작업 순서 (Frontend Agent 지침)

```
1. 패키지 설치 (dompurify, @types/dompurify)
2. sanitize.ts 구현 (DOMPurify 래퍼)
3. useImageUpload.ts 훅 구현
4. ImageUploadModal.tsx 구현 (드래그&드롭, 미리보기, 프로그레스)
5. ContentEditor.tsx 구현 (contenteditable + 이미지 삽입)
6. WriteForm.tsx 수정 (textarea → ContentEditor + 모달 연결)
7. PostDetail.tsx 수정 (sanitizeHTML 적용)
```

---

## 10. 완료 기준 (Done Criteria)

```
□ 이미지 버튼 클릭 시 모달 오픈
□ 드래그&드롭 파일 업로드 동작
□ 클릭으로 파일 선택 업로드 동작
□ 업로드 중 프로그레스 바 표시
□ 업로드 완료 후 에디터 커서 위치에 이미지 삽입
□ 5장 초과 시 추가 버튼 비활성화 + 토스트
□ 10MB 초과 파일 에러 토스트
□ 허용되지 않는 확장자 에러 토스트
□ 개별 이미지 X 버튼으로 제거 동작
□ 게시글 저장 전 DOMPurify sanitize 적용
□ 상세 페이지에서 이미지 정상 렌더링
□ <script> 태그 삽입 시 제거되는지 확인 (XSS 방어)
□ 모바일 레이아웃 정상 동작
□ tsc --noEmit 타입 에러 없음
□ pnpm lint 통과
```
