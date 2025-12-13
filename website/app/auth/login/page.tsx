import { AuthLayout } from "@/components/auth/auth-layout"
import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Sign In - VarsityMart",
  description: "Sign in to your VarsityMart account",
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your VarsityMart account"
      footerText="Don't have an account?"
      footerLink="/auth/register"
      footerLinkText="Create account"
    >
      <LoginForm />
    </AuthLayout>
  )
}
