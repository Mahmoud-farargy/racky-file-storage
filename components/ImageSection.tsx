import Thumbnail from './Thumbnail'
import FormattedDateTime from './FormattedDateTime'
import { convertFileSize } from '@/lib/utils'
import { FileDocumentItem } from '@/types'

const ImageSection = ({file}: {file: FileDocumentItem}) => (
    <div className="file-details-thumbnail">
        <Thumbnail type={file.type} extension={file.extension} url={file.url} />
        <div className="flex flex-col items-start">
            <p className="subtitle-2 mb-1 line-clamp-2 break-all">{file.name}</p>
            <div className="flex gap-1 body-1 text-light-200 caption">
                {convertFileSize(file.size)} - <FormattedDateTime date={file.$createdAt} className="text-inherit caption"/>
            </div>
        </div>
    </div>
)

export default ImageSection