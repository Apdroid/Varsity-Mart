import { AuthLayout } from "@/components/auth/auth-layout"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata = {
  title: "Create Account - VarsityMart",
  description: "Create your VarsityMart account",
}

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="Join VarsityMart to buy and sell on campus"
      footerText="Already have an account?"
      footerLink="/auth/login"
      footerLinkText="Sign in"
    >
      <RegisterForm />
    </AuthLayout>
  )
}
