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
import { Input } from "@/components/ui/input"
import { forgotSchema, type ForgotSchema } from "@/lib/validation/auth"
import { authApi } from "@/lib/api/auth"
import { ApiError } from "@/lib/api/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import type { ComponentProps } from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function ForgotForm({ className, ...props }: ComponentProps<"div">) {
  const [emailSent, setEmailSent] = useState(false)
  const form = useForm<ForgotSchema>({
    resolver: zodResolver(forgotSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  })
  const { errors, isSubmitting } = form.formState

  const onSubmit = async (data: ForgotSchema) => {
    try {
      await authApi.forgotPassword({ email: data.email })
      setEmailSent(true)
      toast.success("Reset link sent! Check your email.")
    } catch (err) {
      if (err instanceof ApiError) {
        const errorData = err.data as { message?: string; detail?: string }
        toast.error(errorData?.message || errorData?.detail || "Failed to send reset link")
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }

  if (emailSent) {
    return (
      <AuthFormShell
        className={className}
        title="Check your email"
        description={
          <>
            We&apos;ve sent a password reset link to{" "}
            <b className="font-bold text-black dark:text-primary">{form.getValues("email")}</b>
          </>
        }
        {...props}
      >
        <div className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the link in your email to reset your password. The link will expire in 24 hours.
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full p-6 rounded-full"
            onClick={() => setEmailSent(false)}
          >
            Try a different email
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
      title="Forgot password?"
      description={
        <>
          Enter your email and we&apos;ll send a reset link for your{" "}
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
              name="email"
              render={({ field }) => (
                <FormItem data-invalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@university.edu.gh"
                      autoFocus
                      autoComplete="email"
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
                className="text-md p-6 rounded-full"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send reset link
              </Button>
            </FormItem>
            <FieldDescription className="text-center text-black dark:text-white">
              Remembered your password?{" "}
              <Link href="/login" className="text-primary">
                Sign in
              </Link>
              {" · "}
              <Link href="/register" className="text-primary">
                Sign up
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </Form>
    </AuthFormShell>
  )
}
