"use client"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { signUserOut } from "@/lib/actions/user.actions"
const LogoutDialog = ({ children }: { children: React.ReactNode }) => {
  const [isConfirmationModalOpen, setConfirmationModalState] = useState(false)
  return (
    <AlertDialog
      open={isConfirmationModalOpen}
      onOpenChange={setConfirmationModalState}
    >
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent className="shad-dialog button">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-3 md:flex-row mt-3">
          <AlertDialogCancel className="modal-cancel-button">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="modal-submit-button"
            onClick={async () => await signUserOut()}
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default LogoutDialog
