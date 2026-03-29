import type { BookmarkCard } from '../types/index'
import api from './api'

export interface RawBookmark {
  id: number
  recipe_id: string
  folder_id: number
  rating: number
}

export const bookmarkService = {
  async getAllBookmarks(): Promise<RawBookmark[]> {
    const res = await api.get('/bookmarks/')
    return res.data ?? []
  },

  async deleteBookmark(bookmarkId: number): Promise<void> {
    await api.delete('/bookmarks/', { params: { bookmark_id: bookmarkId } })
  },

  async fetchBookmarkCards(rawList: RawBookmark[]): Promise<BookmarkCard[]> {
    if (rawList.length === 0) return []

    const payload = rawList.map((b) => ({
      recipe_id: Number(b.recipe_id),
      folder_id: b.folder_id,
    }))

    console.log('Fetching bookmark cards for payload:', payload)
    const res = await api.post('/recipes/get_recipes_by_ids', { bookmarks: payload })
    const results = res.data.results ?? []

    return results.map((r: any) => ({
      ...r,
      rating:
        rawList.find((b) => b.recipe_id === String(r.recipe_id) && b.folder_id === r.folder_id)
          ?.rating ?? 0,
    }))
  },

  /** Hydrates cards for a single folder, filtered from an existing raw list. */
  async getCardsForFolder(folderId: number, allBookmarks: RawBookmark[]): Promise<BookmarkCard[]> {
    const folderBookmarks = allBookmarks.filter((b) => b.folder_id === folderId)
    return this.fetchBookmarkCards(folderBookmarks)
  },
}
