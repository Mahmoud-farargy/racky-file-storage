"use client"
import LogoFilled from "./full_logo/LogoFilled"
import Link from "next/link"
import Image from "next/image"
import { avatarPlaceholderUrl, navItems } from "@/constants"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
interface Props {
    fullName: string;
    email: string;
    avatar: string;
}
const Sidebar = ({ fullName, email, avatar }: Props) => {
  const pathname = usePathname()
  const searchParams = useSearchParams();
  const currentQuery = searchParams.toString();

  return (
    <aside className="sidebar">
      <Link href="/">
        {/* Desktop Logo */}
        <LogoFilled
          width={54}
          height={50}
          className="hidden h-auto lg:flex"
          imageClass="h-auto"
        />
        {/* Mobile Logo */}
        <Image
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={52}
          height={52}
          className="lg:hidden"
          draggable={false}
        />
      </Link>
      {/* Nav */}
      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-3">
          {navItems?.map(({ url, icon, name }) => {
          const normalizedPath = pathname.toLowerCase();
          const normalizedUrl = url.toLowerCase();

          const isActive =
            normalizedUrl === "/"
              ? normalizedPath === "/"
              : normalizedPath.startsWith(normalizedUrl);

          const hrefWithParams = currentQuery && url !== "/"
            ? `${url}?${currentQuery}`
            : url;
            return (
              <li key={name} className="lg:w-full p-0">
                <Link
                  href={hrefWithParams}
                  className={cn("sidebar-nav-item", isActive && "shad-active")}
                >
                  <Image
                    src={icon}
                    alt={name}
                    width={24}
                    height={24}
                    className={cn("nav-icon", isActive && "nav-icon-active")}
                  />
                  <p className="hidden lg:block">{name}</p>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      {/* Files icon */}
      <Image
        src="/assets/images/files-2.png"
        alt="logo"
        draggable={false}
        width={253}
        height={127}
        className="w-[90%] h-auto mt-3"
      />
      {/* Avatar image */}
        <div className="sidebar-user-info">
          <Image
            src={avatar || avatarPlaceholderUrl}
            alt="Avatar"
            draggable={false}
            width={44}
            height={44}
            className="sidebar-user-avatar"
          />
          <div className="hidden lg:block">
            <p className="subtitle-2 capitalize mb-0.5">
              {fullName}
            </p>
            <p className="caption text-gray-400">{email}</p>
          </div>
        </div>
    </aside>
  )
}

export default Sidebar
