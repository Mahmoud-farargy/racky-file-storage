"use client"
import { sendEmailOTP, verifySecret } from "@/lib/actions/user.actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

const OTPModal = ({
  email,
  accountId,
}: {
  email: string
  accountId: string
}) => {
  const [isOpen, setOpenModalState] = useState(true)
  const [isLoading, setLoadingState] = useState(false)
  const [password, setPassword] = useState("")

  const router = useRouter()
  const handleSubmission = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setLoadingState(true)

    try {

      const sessionId = await verifySecret({ accountId, password })

      if (sessionId) router.push("/")
    } catch (error) {
      console.error("Failed to verify OTP:", error)
    } finally {
      setLoadingState(false)
    }
  }
  const handleResendOTP = async () => {
    await sendEmailOTP(email)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setOpenModalState}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Enter your OTP
            <Image
              src="/assets/icons/close-dark.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => setOpenModalState(false)}
              className="otp-close-button"
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            We&apos;ve sent a code to{" "}
            <span className="text-band pl-1">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* OTP Input */}
        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className="shad-otp">
            <InputOTPSlot
              index={0}
              className="shad-otp-slot"
              autoFocus
            />
            <InputOTPSlot index={1} className="shad-otp-slot" />
            <InputOTPSlot index={2} className="shad-otp-slot" />
            <InputOTPSlot index={3} className="shad-otp-slot" />
            <InputOTPSlot index={4} className="shad-otp-slot" />
            <InputOTPSlot index={5} className="shad-otp-slot" />
          </InputOTPGroup>
        </InputOTP>
        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-4">
            <AlertDialogAction
              type="button"
              onClick={handleSubmission}
              className="shad-submit-btn h-12"
            >
              Submit
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="ml-2 animate-spin"
                />
              )}
            </AlertDialogAction>

            {/* Resend */}
            <div className="subtitle-2 mt-2 text-center text-light-100">
              Didn&apos;t get a code?
              <Button
                type="button"
                variant="link"
                className="pl-1 text-brand"
                onClick={handleResendOTP}
              >
                Click to resend
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default OTPModal
