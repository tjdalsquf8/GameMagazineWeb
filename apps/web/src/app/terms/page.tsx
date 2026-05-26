// 이용약관 페이지
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관 | Game Magazine',
  description: 'Game Magazine 이용약관',
}

const SECTIONS = [
  {
    title: '제1조 (목적)',
    content: `본 약관은 Game Magazine(이하 "서비스")이 제공하는 게임 뉴스 및 커뮤니티 서비스의 이용 조건과 절차, 이용자와 서비스 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.`,
  },
  {
    title: '제2조 (용어 정의)',
    content: `• "서비스"란 Game Magazine이 제공하는 웹사이트 및 관련 제반 서비스를 의미합니다.
• "이용자"란 본 약관에 동의하고 서비스를 이용하는 회원 및 비회원을 의미합니다.
• "회원"이란 서비스에 가입하여 아이디와 비밀번호를 부여받은 자를 의미합니다.
• "게시물"이란 회원이 서비스에 작성한 글, 댓글, 이미지 등 일체의 정보를 의미합니다.`,
  },
  {
    title: '제3조 (약관의 효력 및 변경)',
    content: `• 본 약관은 서비스 화면에 게시하거나 이용자에게 공지함으로써 효력이 발생합니다.
• 서비스는 합리적인 사유가 있을 경우 약관을 변경할 수 있으며, 변경 시 서비스 내 공지합니다.
• 변경된 약관에 동의하지 않는 경우 회원 탈퇴를 할 수 있습니다.`,
  },
  {
    title: '제4조 (회원가입)',
    content: `• 이용자는 서비스가 정한 양식에 따라 정보를 입력하고 본 약관에 동의함으로써 회원가입을 신청합니다.
• 서비스는 제1항의 신청에 대해 승낙함으로써 회원가입이 완료됩니다.
• 다음 각 호에 해당하는 경우 가입 신청을 거절하거나 사후 취소할 수 있습니다.
  - 타인의 정보를 도용한 경우
  - 허위 정보를 기재한 경우
  - 서비스 운영을 방해할 목적으로 가입한 경우`,
  },
  {
    title: '제5조 (이용자의 의무)',
    content: `이용자는 다음 행위를 해서는 안 됩니다.

• 타인의 개인정보 도용 및 허위 정보 등록
• 서비스에 게시된 정보의 무단 변경·삭제
• 서비스가 허용하지 않은 광고·홍보물 게시
• 타인을 비방하거나 명예를 훼손하는 게시물 작성
• 음란물, 혐오 표현, 불법 콘텐츠 게시
• 서비스의 정상적인 운영을 방해하는 행위
• 관련 법령을 위반하는 일체의 행위`,
  },
  {
    title: '제6조 (게시물 관리)',
    content: `• 게시물의 저작권은 해당 게시물을 작성한 이용자에게 있습니다.
• 서비스는 이용자가 작성한 게시물을 서비스 운영 및 홍보 목적으로 활용할 수 있습니다.
• 서비스는 다음 각 호에 해당하는 게시물을 사전 통보 없이 삭제하거나 숨김 처리할 수 있습니다.
  - 타인의 권리를 침해하는 게시물
  - 관련 법령을 위반하는 게시물
  - 서비스 운영 정책에 위반되는 게시물`,
  },
  {
    title: '제7조 (계정 정지 및 이용 제한)',
    content: `• 서비스는 이용자가 본 약관을 위반한 경우 경고, 일시 정지, 영구 정지 등의 조치를 취할 수 있습니다.
• 정지 기준: 경미한 위반 시 7일, 반복 위반 시 30일, 중대한 위반 시 영구 정지.
• 이용 제한에 이의가 있는 경우 고객센터를 통해 이의를 제기할 수 있습니다.`,
  },
  {
    title: '제8조 (서비스 제공 및 변경)',
    content: `• 서비스는 연중무휴 24시간 제공을 원칙으로 하나, 시스템 점검·장애 등의 사유로 일시 중단될 수 있습니다.
• 서비스는 운영상·기술상의 필요에 따라 서비스의 전부 또는 일부를 변경·종료할 수 있습니다.`,
  },
  {
    title: '제9조 (면책조항)',
    content: `• 서비스는 이용자가 게시한 정보·자료·사실의 신뢰도·정확성에 대해 책임을 지지 않습니다.
• 서비스는 이용자 간 또는 이용자와 제3자 간의 분쟁에 개입하지 않으며, 이로 인한 손해를 배상할 책임이 없습니다.
• 천재지변, 서비스 장애 등 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.`,
  },
  {
    title: '제10조 (분쟁 해결)',
    content: `본 약관과 관련된 분쟁은 대한민국 법률에 따라 처리하며, 분쟁 해결을 위한 관할 법원은 서울중앙지방법원으로 합니다.`,
  },
  {
    title: '제11조 (뉴스 콘텐츠 출처 및 저작권)',
    content: `• 서비스가 제공하는 뉴스 콘텐츠는 아래 미디어의 공개 RSS 피드를 기반으로 인공지능(AI)이 재작성한 내용입니다.
  - 국내 뉴스: 게임메카 (gamemeca.com)
  - 콘솔 뉴스: Push Square (pushsquare.com), Pure Xbox (purexbox.com), Nintendo Life (nintendolife.com)
  - e스포츠(LCK): Riot Games Lolesports API (lolesports.com)
• 원문 기사의 저작권은 각 미디어사에 있으며, 서비스는 사실관계 전달을 목적으로 AI 재작성 방식을 통해 콘텐츠를 제공합니다.
• 저작권 관련 문의 및 콘텐츠 삭제 요청은 jscompany0407@gmail.com으로 연락 주시면 즉시 처리합니다.`,
  },
  {
    title: '부칙',
    content: `본 약관은 2026년 5월 26일부터 시행합니다.`,
  },
]

// 이용약관 페이지 컴포넌트
export default function TermsPage() {
  return (
    <div className="container-main py-10 md:py-16 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-2">
        이용약관
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
