import Header from "@/components/header"
import MobileNavigation from "@/components/MobileNavigation"
import Sidebar from "@/components/Sidebar"
import { redirect } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"
import { getCurrentUserCached } from "@/lib/getCurrentUserCached"

export const dynamic = 'force-dynamic'

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUserCached()

  if (!currentUser) return redirect("/sign-in")

  return (
    <div className="flex min-h-screen h-full lg:h-screen">
      <Sidebar {...currentUser} />
      <main className="flex lg:max-w-[75%] w-full h-full flex-1 flex-col">
        <MobileNavigation {...currentUser} />
        <Header useId={currentUser.$id} accountId={currentUser.accountId} />
        <section className="main-content">{children}</section>
        <Toaster />
      </main>
    </div>
  )
}

export default Layout
