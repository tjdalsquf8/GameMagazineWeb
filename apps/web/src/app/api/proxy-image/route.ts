// 외부 이미지 CORS 우회 프록시 — html2canvas 다운로드 시 외부 도메인 이미지를 서버에서 fetch 후 반환
// GET /api/proxy-image?url=<외부이미지URL>
// 보안: image/* MIME 타입만 허용, 비이미지 응답은 400 반환

import { NextRequest, NextResponse } from 'next/server'

/** 외부 이미지 URL을 서버에서 fetch하여 CORS 없이 반환하는 프록시 핸들러 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const url = searchParams.get('url')

  // url 파라미터 누락 시 400
  if (!url) {
    return NextResponse.json({ error: 'url 파라미터가 필요합니다' }, { status: 400 })
  }

  // URL 유효성 검사 — http/https 프로토콜만 허용
  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return NextResponse.json({ error: '허용되지 않는 프로토콜입니다' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: '유효하지 않은 URL입니다' }, { status: 400 })
  }

  // 외부 이미지 fetch
  let response: Response
  try {
    response = await fetch(parsedUrl.toString(), {
      headers: {
        // 일부 서버는 User-Agent 없으면 차단
        'User-Agent': 'Mozilla/5.0 (compatible; GameMagazine-ImageProxy/1.0)',
      },
    })
  } catch {
    return NextResponse.json({ error: '이미지를 가져올 수 없습니다' }, { status: 502 })
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: `외부 서버 오류: ${response.status}` },
      { status: response.status >= 500 ? 502 : 400 }
    )
  }

  // MIME 타입 검사 — image/* 만 허용
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.startsWith('image/')) {
    return NextResponse.json({ error: '이미지 파일만 프록시할 수 있습니다' }, { status: 400 })
  }

  // 이미지 바이너리 반환
  const buffer = await response.arrayBuffer()

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      // 브라우저 캐시 1시간
      'Cache-Control': 'public, max-age=3600',
      // CORS 허용 — 같은 도메인에서 호출되므로 동일 오리진 처리
      'Access-Control-Allow-Origin': '*',
    },
  })
}
