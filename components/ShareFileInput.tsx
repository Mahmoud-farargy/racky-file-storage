import { ShareInputProps } from "@/types"
import ImageSection from "./ImageSection"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import Image from "next/image"

const ShareFileInput = ({ file, onInputChange, onRemove }: ShareInputProps) => {
  return (
    <>
      <ImageSection file={file} />
      <div className="mt-2 space-y-2">
        <p className="subtitle-2 text-light-100">
          Share file with other users (separate by a comma)
        </p>
        <Input
          type="email"
          placeholder="Enter email address"
          onChange={(e) => onInputChange(e.target.value.trim().split(","))}
          className="share-input-field"
          autoFocus
        />
        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">Share with</p>
            <p className="subtitle-2 text-light-200">
              {file.users?.length} users
            </p>
          </div>
          <ul className="pt-2">
            {file.users?.map((userEmail) => (
              <li
                key={userEmail}
                className="flex items-center justify-between gap-2"
              >
                <p className="subtitle-2">{userEmail}</p>
                <Button variant="link" onClick={() => onRemove(userEmail)}>
                  <Image
                    src="/assets/icons/remove.svg"
                    alt="Remove"
                    width={24}
                    height={24}
                    className="remove-icon"
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default ShareFileInput
