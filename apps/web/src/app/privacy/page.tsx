// 개인정보처리방침 페이지
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침 | Game Magazine',
  description: 'Game Magazine 개인정보처리방침',
}

const SECTIONS = [
  {
    title: '1. 수집하는 개인정보 항목',
    content: `Game Magazine(이하 "서비스")은 회원가입 및 서비스 이용 과정에서 아래와 같은 개인정보를 수집합니다.

• 필수 항목: 이메일 주소, 닉네임
• 선택 항목: 프로필 사진
• 소셜 로그인(Google) 이용 시: Google 계정 이메일, 프로필 사진 (Google이 제공하는 범위 내)
• 서비스 이용 과정에서 자동 수집: 접속 IP, 서비스 이용 기록, 쿠키`,
  },
  {
    title: '2. 개인정보 수집 및 이용 목적',
    content: `수집한 개인정보는 다음 목적으로만 이용합니다.

• 회원 식별 및 서비스 제공
• 이메일 인증 및 비밀번호 재설정
• 커뮤니티 게시글·댓글 작성자 표시
• 불법·부적절한 이용 방지 및 분쟁 해결`,
  },
  {
    title: '3. 개인정보 보유 및 이용 기간',
    content: `• 회원 탈퇴 시까지 보유합니다.
• 회원 탈퇴 요청 시 즉시 삭제합니다. 단, 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.
  - 전자상거래 등에서의 소비자 보호에 관한 법률: 5년
  - 통신비밀보호법: 3개월`,
  },
  {
    title: '4. 개인정보의 제3자 제공',
    content: `서비스는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 단, 아래의 경우는 예외입니다.

• 이용자가 사전에 동의한 경우
• 법령의 규정에 의거하거나 수사 기관의 요청이 있는 경우

Google 소셜 로그인 이용 시, Google의 개인정보처리방침이 함께 적용됩니다.`,
  },
  {
    title: '5. 개인정보 처리 위탁',
    content: `서비스는 원활한 운영을 위해 아래와 같이 개인정보 처리 업무를 위탁합니다.

• Cloudflare R2: 프로필 이미지 저장·제공
• Render: 서버 호스팅 및 데이터베이스 운영`,
  },
  {
    title: '6. 이용자의 권리',
    content: `이용자는 언제든지 아래 권리를 행사할 수 있습니다.

• 개인정보 조회·수정: 마이페이지에서 직접 수정 가능
• 회원 탈퇴(개인정보 삭제): 마이페이지 > 계정 설정에서 탈퇴 가능
• 기타 문의: 아래 연락처로 요청 시 지체 없이 처리합니다.`,
  },
  {
    title: '7. 쿠키 사용',
    content: `서비스는 로그인 상태 유지를 위해 쿠키(JWT Refresh Token)를 사용합니다. 브라우저 설정에서 쿠키 저장을 거부할 수 있으나, 이 경우 로그인 유지 기능이 제한될 수 있습니다.`,
  },
  {
    title: '8. 개인정보 보호책임자 및 문의',
    content: `개인정보 처리에 관한 문의, 불만 처리, 피해 구제 등은 아래 연락처로 문의하시기 바랍니다.

• 이메일: jscompany0407@gmail.com`,
  },
  {
    title: '9. 고지 의무',
    content: `본 개인정보처리방침은 법령·정책 변경에 따라 사전 고지 후 개정될 수 있습니다.

• 시행일: 2026년 5월 26일`,
  },
]

// 개인정보처리방침 페이지 컴포넌트
export default function PrivacyPage() {
  return (
    <div className="container-main py-10 md:py-16 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-2">
        개인정보처리방침
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-10">시행일: 2026년 5월 26일</p>

      <div className="space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
              {section.title}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] leading-7 whitespace-pre-line">
              {section.content}
            </p>
          </section>
        ))}
      </div>
    </div>
  )
}
