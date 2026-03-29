import type { RecipeCard } from '../types/index'
import api from './api'

export interface Category {
  category: string
  count: number
}

export interface SearchResult {
  results: RecipeCard[]
  categories: Category[]
  totalHit: number
  elapse: number
  suggestion: string | null
}

export const searchService = {
  async search(query: string, categoryFilter: string | null = null): Promise<SearchResult> {
    const params: Record<string, any> = { query }
    if (categoryFilter) params.category_filter = categoryFilter

    const res = await api.get('/search/search_es', { params })
    const data = res.data

    return {
      results: data.results ?? [],
      categories: data.category ?? [],
      totalHit: data.total_hit ?? 0,
      elapse: data.elapse ?? 0,
      suggestion: data.suggestion ?? null,
    }
  },
}
