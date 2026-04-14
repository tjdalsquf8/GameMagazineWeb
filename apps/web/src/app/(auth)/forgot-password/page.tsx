import type { Metadata } from 'next'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

export const metadata: Metadata = {
  title: '비밀번호 찾기 | Game Magazine',
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
