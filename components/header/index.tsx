import { Button } from "../ui/button"
import Image from "next/image"
import Search from "./Search"
import FileUploader from "./FileUploader"
import LogoutDialog from "../LogoutDialog"
interface Props {
  useId: string;
  accountId: string;
}
const Header = ({useId, accountId} :Props ) => {
  return (
    <header className="header">
      {/* Search bar */}
      <Search />
      <div className="header-wrapper">
        {/* File Uploader */}
        <FileUploader ownerId={useId} accountId={accountId} />
        {/* Logout Button */}
        <LogoutDialog>
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="logo"
              width={24}
              height={24}
              className="w-6 h-auto"
            />
          </Button>
        </LogoutDialog>
      </div>
    </header>
  )
}

export default Header
