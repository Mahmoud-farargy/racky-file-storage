"use client"
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMemo, useState } from "react"
import Image from "next/image"
import { actionsDropdownItems } from "@/constants"
import { ActionType, FileDocumentItem } from "@/types"
import { constructDownloadUrl } from "@/lib/utils"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { deleteFile, renameFile, updatefileSharedUsers } from "@/lib/actions/files.actions"
import { usePathname } from "next/navigation"
import FileDetailsModal from "./ActionsModalContent"
import ShareFileInput from "./ShareFileInput"

const ActionDropdown = ({ file, isOwner = false }: { file: FileDocumentItem, isOwner?: boolean }) => {
  const path = usePathname()
  const [isModalOpen, setModalOpenState] = useState<boolean>(false)
  const [isDropdownOpen, setDropdownOpenState] = useState<boolean>(false)

  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null)
  const [fileName, setFileName] = useState<string>(file.name)

  const [editedSharedEmails, setEditedSharedEmails] = useState<string[]>([])

  const [isLoading, setLoading] = useState<boolean>(false)

  const resetAll = (fileNameToReset: string = file.name) => {
    setModalOpenState(false)
    setDropdownOpenState(false)
    setSelectedAction(null)
    setFileName(fileNameToReset)
  }

  const isSubmitButtonDisabled = useMemo(() => {
    switch (selectedAction?.value) {
      case "share":
        return editedSharedEmails?.length > 0
          ? editedSharedEmails?.some((emailItem) => {
              const hasOwnerEmail = emailItem === file.owner?.email
              const hasInvalidEmail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                emailItem
              )
              const hasEmailAlready = file.users?.includes(emailItem)
              return hasOwnerEmail || hasInvalidEmail || hasEmailAlready
            })
          : true
    }
    return false
  }, [selectedAction, editedSharedEmails, file])

  const confirmAction = async () => {
    setLoading(true)
    try {
      switch (selectedAction?.value) {
        case "rename":
          await renameFile({
            fileId: file.$id,
            name: fileName,
            extension: file.extension,
            path,
          })
          break
        case "share":
          await updatefileSharedUsers({
            fileId: file.$id,
            emails: editedSharedEmails,
            path,
          })
          break
        case "delete":
          await deleteFile({
            fileId: file.$id,
            bucketFileId: file.bucketFileId,
            path,
          })
          break
        default: {
          setLoading(false)
        }
      }
      resetAll(fileName)
    } catch {
      resetAll()
    } finally {
      setLoading(false)
    }
  }
  const handleRemoveUserEmail = async (email: string) => {
    const updatedEmails = editedSharedEmails?.filter(
      (emailItem) => emailItem !== email
    )
    const isSuccess = await updatefileSharedUsers({
      fileId: file.$id,
      emails: updatedEmails,
      path,
    })
    if (isSuccess) {
      setEditedSharedEmails(updatedEmails)
    }
  }
  const renderActionContent = (value: string) => {
    switch (value) {
      case "rename":
        return (
          <Input
            type="text"
            value={fileName}
            className="share-input-field"
            onChange={(e) => setFileName(e.target.value)}
          />
        )
      case "details":
        return <FileDetailsModal file={file}/>
      case "share":
        return (
          <ShareFileInput
            file={file}
            onInputChange={setEditedSharedEmails}
            onRemove={handleRemoveUserEmail}
          />
        )
      case "delete":
        return (<p className="delete-confirmation">
           Are you sure you want to delete {` `} <span className="delete-file-name">{file.name}</span>?
        </p>)
      default:
        return <></>
    }
  }

  const renderDialogContent = () => {
    if (!selectedAction) return null
    const { value, label } = selectedAction

    const dialogFooter = ["rename", "delete", "share"].includes(value)
    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {renderActionContent(value)}
        </DialogHeader>
        {dialogFooter && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row mt-3">
            {value === "delete" && (
              <Button
                onClick={() => resetAll()}
                className="modal-cancel-button"
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={confirmAction}
              disabled={isSubmitButtonDisabled}
              className="modal-submit-button"
            >
              <p className="capitalize">{label}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loading"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    )
  }

  const onActionClick = (selectedActionItem: ActionType) => {
    const openModalActionTypes = ["rename", "share", "delete", "details"]
    const isDownload = selectedActionItem.value === "download"
    if (isDownload) {
      const link = document.createElement("a")
      link.href = constructDownloadUrl(file.bucketFileId)
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      link.remove()
    } else if (openModalActionTypes.includes(selectedActionItem.value)) {
      setModalOpenState(true)
      setSelectedAction(selectedActionItem)
    }
  }

  const handleModalState = (newState: boolean) => {
    setModalOpenState(newState)
    if (!newState) {
      resetAll()
    }
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalState}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpenState}>
        <DropdownMenuTrigger className="shad-no-focus hover:bg-light-100/5 rounded-full p-2">
          <Image
            src="/assets/icons/dots.svg"
            alt=""
            width={25}
            height={5}
            className="h-auto"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] min-w-[160px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems(isOwner).map((actionItem: ActionType) => (
            <DropdownMenuItem
              key={actionItem.value}
              className="shad-dropdown-item"
              onSelect={() => onActionClick(actionItem)}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={actionItem.icon}
                  alt={actionItem.label}
                  width={30}
                  height={30}
                />
              </div>
              {actionItem.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Option item Dialog */}

      {renderDialogContent()}
    </Dialog>
  )
}

export default ActionDropdown
