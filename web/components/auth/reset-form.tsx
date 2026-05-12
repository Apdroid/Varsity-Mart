"use client"

import { AuthFormShell } from "@/components/auth/auth-form-shell"
import { Button } from "@/components/ui/button"
import { FieldDescription, FieldGroup } from "@/components/ui/field"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import PasswordInput from "@/components/ui/password-input"
import { resetSchema, type ResetSchema } from "@/lib/validation/auth"
import { authApi } from "@/lib/api/auth"
import { ApiError } from "@/lib/api/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import type { ComponentProps } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function ResetForm({ className, ...props }: ComponentProps<"div">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const form = useForm<ResetSchema>({
    resolver: zodResolver(resetSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })
  const { errors, isSubmitting } = form.formState

  const onSubmit = async (data: ResetSchema) => {
    if (!token) {
      toast.error("Invalid or missing reset token")
      return
    }

    try {
      await authApi.resetPassword({
        reset_token: token,
        new_password: data.password,
        confirm_password: data.confirmPassword,
      })
      toast.success("Password reset successfully!")
      router.push("/login")
    } catch (err) {
      if (err instanceof ApiError) {
        const errorData = err.data as { message?: string; detail?: string }
        toast.error(errorData?.message || errorData?.detail || "Failed to reset password")
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }

  if (!token) {
    return (
      <AuthFormShell
        className={className}
        title="Invalid link"
        description="This password reset link is invalid or has expired."
        {...props}
      >
        <div className="mt-6 space-y-4">
          <Button
            type="button"
            className="w-full p-6 rounded-full"
            onClick={() => router.push("/forgot")}
          >
            Request a new reset link
          </Button>
          <FieldDescription className="text-center text-black dark:text-white">
            <Link href="/login" className="text-primary">
              Back to sign in
            </Link>
          </FieldDescription>
        </div>
      </AuthFormShell>
    )
  }

  return (
    <AuthFormShell
      className={className}
      title="Reset password"
      description={
        <>
          Create a new password for your{" "}
          <b className="font-bold text-black dark:text-primary">Varsity Mart</b>{" "}
          account
        </>
      }
      {...props}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="mt-6"
        >
          <FieldGroup>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem data-invalid={!!errors.password}>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoFocus
                      autoComplete="new-password"
                      className="p-6 rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem data-invalid={!!errors.confirmPassword}>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoComplete="new-password"
                      className="p-6 rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="text-md p-6"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update password
              </Button>
            </FormItem>
            <FieldDescription className="text-center text-black dark:text-white">
              Need a new link?{" "}
              <Link href="/forgot" className="text-primary">
                Request reset email
              </Link>
              {" · "}
              <Link href="/login" className="text-primary">
                Back to sign in
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </Form>
    </AuthFormShell>
  )
}
