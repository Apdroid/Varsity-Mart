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
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import type { ComponentProps } from "react"
import { useForm } from "react-hook-form"

export function ForgotForm({ className, ...props }: ComponentProps<"div">) {
  const form = useForm<ForgotSchema>({
    resolver: zodResolver(forgotSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  })
  const { errors, isSubmitting } = form.formState

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
          onSubmit={form.handleSubmit(() => {})}
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
