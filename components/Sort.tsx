"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sortTypes } from "@/constants"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const Sort = () => {
  const currentPath = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const sortParam = searchParams.get("sort") || sortTypes[0].value
  const [sortInputValue, setSortInputValue] = useState(sortTypes[0].value)

  const handleSortChange = (value: string) => {
    router.replace(`${currentPath}?sort=${encodeURIComponent(value)}`)
    setSortInputValue(value)
  }

  useEffect(() => {
    setSortInputValue(sortParam)
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Select onValueChange={handleSortChange} value={sortInputValue}>
      <SelectTrigger className="sort-select">
        <SelectValue placeholder={sortInputValue} />
      </SelectTrigger>
      <SelectContent className="sort-select-content">
        {sortTypes?.map((sortTypeItem) => (
          <SelectItem
            key={sortTypeItem.label}
            className="shad-select-item"
            value={sortTypeItem.value}
          >
            {sortTypeItem.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default Sort
