import Card from "@/components/Card"
import Sort from "@/components/Sort"
import { getFiles } from "@/lib/actions/files.actions"
import { getCurrentUserCached } from "@/lib/getCurrentUserCached"
import { convertFileSize, getFileTypesParams } from "@/lib/utils"
import { FileDocumentItem, FileType, SearchParamProps } from "@/types"

const Category = async ({ searchParams, params }: SearchParamProps) => {
  const currentUser = await getCurrentUserCached()
  const type = ((await params)?.type as string) || ""
  const types = getFileTypesParams(type) as FileType[];

  const searchText = ((await searchParams)?.search as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";
  const files = await getFiles({types, searchText, sort});
  
  const totalSpace = convertFileSize(files?.documents?.reduce((acc: number, file: FileDocumentItem) => acc + file.size, 0) || 0);

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          {/* Total Size */}
          <p className="body-1">
            Total: <span className="h5">{totalSpace}</span>
          </p>

          {/* Sorting */}
          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-200">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>

      {/* Render the files */}
      {files?.total > 0 ? (
        <section className="file-list">
          {files?.documents.map((file: FileDocumentItem) => {
            const isOwner = currentUser.$id === file.owner?.$id;
            return <Card key={file.$id} file={file} isOwner={isOwner} />
          })}
        </section>
      ) : (
        <p className="empty-list">No Files uploaded yet.</p>
      )}
    </div>
  )
}

export default Category
