"use client"
import { memo } from "react"
import { z } from "zod"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"
import { createAccount, signUserIn } from "@/lib/actions/user.actions"
import OTPModal from "@/components/OTPModal"

// Types
type FormType = "sign-in" | "sign-up"

// Helper Function(s)
const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullName:
      formType === "sign-up"
        ? z.string().min(2).max(50)
        : z.string().optional(),
  })
}

const AuthForm = ({ type }: { type: FormType }) => {
  // Hooks
  const [isLoading, setLoadingState] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [accountId, setAccountId] = useState("");

  // schemas
  const formSchema = authFormSchema(type)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoadingState(true);
    setErrorMessage("");

    try{
      const isSignUp = type === "sign-up";
      const signUpUserInfo = {
        fullName: values.fullName || '',
        email: values.email,
      }

      const signInUserInfo = {
        email: values.email,
      }

      const user = isSignUp ? await createAccount(signUpUserInfo) : await signUserIn(signInUserInfo);

      setAccountId(user.accountId);
    }catch (error) {
      console.error("error", error);
      setErrorMessage("Failed to create an account. Please try again later!");
    } finally {
      setLoadingState(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "sign-in" ? "Login" : "Create Account"}
          </h1>
          {type === "sign-up" && (
            // Full name
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full Name</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      className="shad-input"
                      {...field}
                      autoFocus={type === 'sign-up'}
                    />
                  </FormControl>
                  </div>

                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    className="shad-input"
                    {...field}
                    autoFocus={type === 'sign-in'}
                  />
                </FormControl>
                </div>

                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="form-submit-button"
            disabled={isLoading}
          >
            {type === "sign-in" ? "Login" : "Create Account"}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </Button>
          {/* Error Message */}
          {errorMessage && <p className="error-messsage">*{errorMessage}</p>}
          {/* Auth Links */}
          <div className="body-2 flex justify-center ">
            <p className="text-light-100">
              {type === "sign-in"
                ? "Dont't have an account?"
                : "Aleady have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="ml-1 font-medium text-brand"
            >
              {type === "sign-in" ? "Create Account" : "Login"}
            </Link>
          </div>
        </form>
      </Form>
      {/* OTP Verification */}

      {
        accountId && <OTPModal email={form.getValues('email')} accountId={accountId} />
      }
    </>
  )
}

export default memo(AuthForm)
