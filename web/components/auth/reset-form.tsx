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
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import type { ComponentProps } from "react"
import { useForm } from "react-hook-form"

export function ResetForm({ className, ...props }: ComponentProps<"div">) {
  const form = useForm<ResetSchema>({
    resolver: zodResolver(resetSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })
  const { errors, isSubmitting } = form.formState

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
          onSubmit={form.handleSubmit(() => {})}
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
                      className="p-6"
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
                      className="p-6"
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
