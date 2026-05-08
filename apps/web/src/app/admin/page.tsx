// /admin 루트 접속 시 대시보드로 자동 리다이렉트
import { redirect } from 'next/navigation'

/** /admin 루트 진입 시 대시보드로 이동 */
export default function AdminRootPage() {
  redirect('/admin/dashboard')
}
