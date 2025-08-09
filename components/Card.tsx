import Link from "next/link"
import Thumbnail from "./Thumbnail"
import { convertFileSize } from "@/lib/utils"
import FormattedDateTime from "./FormattedDateTime"
import ActionDropdown from "./ActionDropdown"
import { FileDocumentItem } from "@/types"

const Card = ({ file, isOwner } : {file: FileDocumentItem, isOwner?: boolean}) => {

  return (
    <Link href={file.url} target="_blank" className="file-card">
      <div className="flex justify-between">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
          className="!size-20"
          imageClassName="!size-11"
        />

        <div className="flex flex-col items-end justify-between">
            {/* ActionDropdown */}
            <ActionDropdown file={file} isOwner={isOwner}/>
            <p className="text-sm md:text-[0.9rem]">
                {convertFileSize(file.size)}
            </p>
        </div>
      </div>

      <div className="file-card-details">
        <p title={file.name} className="subtitle-2 break-all line-clamp-1">
            {file.name}
        </p>
        <div>
          <FormattedDateTime date={file.$createdAt} className="body-2 text-light-100/90" />
          <p className="caption line-clamp-1 text-light-200 mt-1">By: {file.owner?.fullName}</p>
        </div>

      </div>
    </Link>
  )
}

export default Card
