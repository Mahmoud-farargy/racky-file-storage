"use client"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import LogoFilled from "./full_logo/LogoFilled"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { navItems } from "@/constants"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "./ui/button"
import FileUploader from "./header/FileUploader"
import LogoutDialog from "./LogoutDialog"

interface Props {
  $id: string
  accountId: string
  fullName: string
  email: string
  avatar: string
}
const MobileNavigation = ({
  $id: ownerId,
  accountId,
  fullName,
  email,
  avatar,
}: Props) => {
  const [isOpen, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="mobile-header">
      <LogoFilled width={43} height={42} imageClass="h-auto" />

      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="menu"
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent className="shad-sheeet h-screen px-3">

          {/* Header */}
          <SheetTitle>
            <div className="header-user">
              <Image
                src={avatar}
                alt="avatar"
                width={44}
                height={44}
                className="header-user-avatar"
              />
              <div className="sm:hidden lg:block">
                <p className="subtitle-2 capitalize">{fullName}</p>
                <p className="caption text-gray-400">{email}</p>
              </div>
            </div>
            <Separator className="mb-4 bg-light-200/20" />
          </SheetTitle>
          {/* Search */}
          {/* <Search /> */}
          {/* Nav */}
          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navItems?.map(({ url, icon, name }) => {
              const normalizedPath = pathname.toLowerCase() ?? "";
              const normalizedUrl = url.toLowerCase();

              const isActive =
                normalizedUrl === "/"
                  ? normalizedPath === "/"
                  : normalizedPath.startsWith(normalizedUrl);
                  
                return (
                  <li key={name} className="lg:w-full p-0">
                    <Link
                      href={url}
                      className={cn(
                        "mobile-nav-item",
                        isActive && "shad-active"
                      )}
                    >
                      <Image
                        src={icon}
                        alt={name}
                        width={24}
                        height={24}
                        className={cn(
                          "nav-icon",
                          isActive && "nav-icon-active"
                        )}
                      />
                      <p>{name}</p>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <Separator className="my-5 bg-light-200/20" />

          <div className="flex flex-col justify-between gap-5 pb-5">
            {/* File Uploader */}
            <FileUploader ownerId={ownerId} accountId={accountId}/>
            {/* Logout Button */}
            <LogoutDialog>
              <Button type="submit" className="mobile-sign-out-button">
                <Image
                  src="/assets/icons/logout.svg"
                  alt="logo"
                  width={24}
                  height={24}
                />
                <p>Logout</p>
              </Button>
            </LogoutDialog>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

export default MobileNavigation
