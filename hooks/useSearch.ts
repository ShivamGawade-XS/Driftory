"use client"
import { useState, useCallback } from "react"
import { searchAll, SearchResponse } from "@/lib/api"

interface UseSearchReturn {
  results: SearchResponse | null
  loading: boolean
  error: string | null
  search: (from: string, to: string, date?: string, sort?: string) => Promise<void>
  clearResults: () => void
}

export default function useSearch(): UseSearchReturn {
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (from: string, to: string, date?: string, sort?: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await searchAll(from, to, date, sort)
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed. Please try again.")
      setResults(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults(null)
    setError(null)
  }, [])

  return { results, loading, error, search, clearResults }
}
