"use client"
import Image from "next/image"
import { Input } from "../ui/input"
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { getFiles } from "@/lib/actions/files.actions"
import { debounce } from "@/lib/utils"
import Thumbnail from "../Thumbnail"
import FormattedDateTime from "../FormattedDateTime"
import useClickOutside from "@/hooks/useClickOutside"
import { FileDocumentItem } from "@/types"

const Search = () => {
  const [inputQuery, setInputQuery] = useState("")
  const [isLoading, setLoadingState] = useState(false)
  const searchParams = useSearchParams()
  const currentPath = usePathname()


  const router = useRouter()
  const searchQuery = searchParams.get("search") || ""
  const [results, setResults] = useState<FileDocumentItem[]>([])

  const [isResultsModalOpen, setResultsModalState] = useState(false)
  const searchResultRef = useRef<HTMLUListElement>(null);

  useClickOutside(searchResultRef as unknown as RefObject<HTMLElement>, () => setResultsModalState(false));

  useEffect(() => {
    if (!searchQuery) {
      setInputQuery("")
    }
  }, [searchQuery])

  const fetchFiles = useCallback(
    async (newQuery: string) => {
      if (!newQuery) {
        setResults([])
        setResultsModalState(false)
        router.replace(currentPath.replace(searchParams.toString(), ""))
        return
      }
      setLoadingState(true);
      try{
        const files = await getFiles({ searchText: newQuery })
        setResults(files.documents)
        setResultsModalState(true)
      }finally {
        setLoadingState(false);
      }
    },
    [router, currentPath, searchParams]
  )

  const debouncedFetchingFiles = useMemo(
    () =>
      debounce((query: string) => {
        fetchFiles(query)
      }, 300),
    [fetchFiles]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setInputQuery(newQuery)
    debouncedFetchingFiles(newQuery)
  }

  const handleClickItem = (file: FileDocumentItem) => {
    setResultsModalState(false)
    setResults([])
    const fileType = file.type
    router.push(
      `/${fileType === "video" || fileType === "audio" ? "media" : fileType + "s"}?search=${encodeURIComponent(inputQuery)}`
    )
  }

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
        />
        <Input
          value={inputQuery}
          placeholder="Search..."
          className="search-input"
          onChange={(e) => handleInputChange(e)}
        />
        {isLoading && <div className="rounded-full bg-brand/70 p-1.5">
          <Image
            src="/assets/icons/loader.svg"
            alt="Searching"
            width={26}
            height={26}
          />  
        </div>}


        {isResultsModalOpen && (
          <ul ref={searchResultRef} className="search-result">
            {results?.length > 0 ? (
              results.map((file) => (
                <li
                  onClick={() => handleClickItem(file)}
                  key={file.$id}
                  className="flex items-center justify-between hover:bg-light-100/5 rounded-xl p-2"
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 break-all text-light-100">
                      {file.name}
                    </p>
                    <FormattedDateTime
                      date={file.$createdAt}
                      className="caption whitespace-nowrap text-light-200"
                    />
                  </div>
                </li>
              ))
            ) : (
              <p className="empty-result">No Files Found!</p>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Search
