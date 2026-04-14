'use client'

// contenteditable 기반 리치 텍스트 에디터
// 상단 툴바에 이미지 버튼 제공, 이미지 삽입은 커서 위치에 img 태그 직접 삽입
// forwardRef + useImperativeHandle로 insertImages 메서드 노출

import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import { ImageIcon } from 'lucide-react'

interface ContentEditorProps {
  value: string
  onChange: (html: string) => void
  onImageButtonClick: () => void
  placeholder?: string
}

// 부모에서 호출할 수 있도록 노출되는 메서드
export interface ContentEditorHandle {
  insertImages: (urls: string[]) => void
}

// contenteditable div 기반 에디터 — 이미지 삽입 지원
const ContentEditor = forwardRef<ContentEditorHandle, ContentEditorProps>(
  ({ value, onChange, onImageButtonClick, placeholder = '내용을 입력해주세요' }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null)
    // 커서 위치를 저장하기 위한 ref
    const savedRangeRef = useRef<Range | null>(null)
    // 외부에서 value 동기화 시 무한루프 방지용 플래그
    const isInternalChangeRef = useRef(false)

    // 커서(Selection) 위치 저장 — 반드시 에디터 내부의 range만 저장
    const saveSelection = useCallback(() => {
      if (!editorRef.current) return
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        // range의 공통 조상이 에디터 내부인 경우에만 저장
        if (editorRef.current.contains(range.commonAncestorContainer)) {
          savedRangeRef.current = range.cloneRange()
        }
      }
    }, [])

    // 저장된 커서 위치 복원
    const restoreSelection = useCallback(() => {
      if (!savedRangeRef.current) return
      const selection = window.getSelection()
      if (!selection) return
      selection.removeAllRanges()
      selection.addRange(savedRangeRef.current)
    }, [])

    // 커서 위치에 이미지 태그들을 삽입하는 메서드 — forwardRef로 외부 노출
    const insertImages = useCallback(
      (urls: string[]) => {
        if (!editorRef.current) return

        editorRef.current.focus()
        restoreSelection()

        const selection = window.getSelection()
        // 복원된 range가 에디터 내부인지 재검증 — 에디터 외부 range 차단
        const isSelectionInEditor =
          selection &&
          selection.rangeCount > 0 &&
          editorRef.current.contains(selection.getRangeAt(0).commonAncestorContainer)

        if (!isSelectionInEditor) {
          // 커서가 없거나 에디터 외부이면 끝에 삽입
          const fragment = document.createDocumentFragment()
          urls.forEach((url) => {
            const img = document.createElement('img')
            img.src = url
            img.alt = '업로드 이미지'
            img.className = 'max-w-full h-auto rounded my-2'
            fragment.appendChild(img)
            fragment.appendChild(document.createElement('br'))
          })
          editorRef.current.appendChild(fragment)
        } else {
          const range = selection!.getRangeAt(0)
          range.deleteContents()

          const fragment = document.createDocumentFragment()
          urls.forEach((url) => {
            const img = document.createElement('img')
            img.src = url
            img.alt = '업로드 이미지'
            img.className = 'max-w-full h-auto rounded my-2'
            fragment.appendChild(img)
            fragment.appendChild(document.createElement('br'))
          })

          range.insertNode(fragment)

          // 삽입 후 커서를 이미지 뒤로 이동
          range.collapse(false)
          selection.removeAllRanges()
          selection.addRange(range)
        }

        // onChange에 현재 HTML 전달
        isInternalChangeRef.current = true
        onChange(editorRef.current.innerHTML)
      },
      [onChange, restoreSelection]
    )

    // forwardRef로 insertImages 메서드 노출
    useImperativeHandle(ref, () => ({ insertImages }), [insertImages])

    // 외부에서 value 변경 시 에디터 내용 동기화 (내부 변경으로 인한 재렌더링 제외)
    useEffect(() => {
      if (!editorRef.current) return
      if (isInternalChangeRef.current) {
        isInternalChangeRef.current = false
        return
      }
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value
      }
    }, [value])

    // contenteditable 내용 변경 핸들러
    const handleInput = () => {
      if (!editorRef.current) return
      isInternalChangeRef.current = true
      onChange(editorRef.current.innerHTML)
    }

    // 이미지 버튼 클릭 — 커서 저장 후 모달 열기
    const handleImageButtonClick = () => {
      saveSelection()
      onImageButtonClick()
    }

    return (
      <div className="flex flex-col border border-border rounded overflow-hidden focus-within:border-primary transition-colors">
        {/* 툴바 */}
        <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border bg-surface">
          <button
            type="button"
            onClick={handleImageButtonClick}
            className="flex items-center gap-1.5 px-2 py-1 text-xs text-text-secondary hover:text-text-primary hover:bg-background rounded transition-colors"
            title="이미지 삽입"
            aria-label="이미지 삽입"
          >
            <ImageIcon size={14} />
            <span>이미지</span>
          </button>
        </div>

        {/* 편집 영역 */}
        <div className="relative">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onBlur={saveSelection}
            className="min-h-[400px] px-3 py-2 text-sm text-text-primary bg-background outline-none leading-relaxed"
            aria-label="본문 편집"
          />
          {/* placeholder — 내용이 비어있을 때만 표시 */}
          {!value && (
            <div
              className="absolute top-2 left-3 text-sm text-text-muted pointer-events-none select-none"
              aria-hidden
            >
              {placeholder}
            </div>
          )}
        </div>
      </div>
    )
  }
)

ContentEditor.displayName = 'ContentEditor'

export default ContentEditor
