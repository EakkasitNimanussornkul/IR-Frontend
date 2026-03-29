export interface RecipeCard {
  recipe_id: number
  name: string
  description_preview: string
  image_urls?: string
  score?: number
}

export interface BookmarkCard {
  recipe_id: number
  name: string
  description_preview: string
  image_url?: string
  folder_id: number
  rating?: number
  score?: number
}

export interface Folder {
  id: number
  name: string
  description?: string
}
