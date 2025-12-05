"use client"

import type React from "react"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
}

export function SearchBar({ placeholder = "Search...", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  const handleClear = () => {
    setQuery("")
    onSearch?.("")
  }

  return (
    <form onSubmit={handleSubmit} className="w-1/5">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-5 w-5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 hover:bg-muted rounded transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </form>
  )
}
