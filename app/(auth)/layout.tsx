import LogoFilled from "@/components/full_logo/LogoFilled"
import LogoOutline from "@/components/full_logo/LogoOutline"
import Image from "next/image"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      {/* == Sidebar == */}
      <aside className="hidden lg:flex justify-center items-center p-7 xl:p-10 bg-brand max-w-[25%] min-w-[23rem] w-full">
        <div className="flex max-h-[50rem] max-w-[26.875rem] flex-col justify-center space-y-12">
          <LogoOutline />

          <div className="space-y-5 text-white">
            <h1 className="h1">Manage your files the best way</h1>
            <p className="body-1">
              This is a place where you can store all your documents.
            </p>
          </div>
          <Image
            src="/assets/images/files.png"
            alt="Files"
            width={266}
            height={274}
            className="transition-all hover:rotate-2 hover:scale-105 w-[16.625rem] h-auto"
          />
        </div>
      </aside>
      {/* == Main Section == */}
      <main className="flex flex-col items-center justify-center lg:max-w-[75%] w-full p-6 lg:p-10">
        {/* Logo on Mobile */}
        <div className="mb-14 lg:hidden">
          <LogoFilled />
        </div>
        {/* Page Inner Content */}
        {children}
      </main>
    </div>
  )
}

export default Layout
