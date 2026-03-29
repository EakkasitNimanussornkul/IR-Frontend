export interface RecipeCard {
  recipe_id: number
  name: string
  description_preview: string
  image_urls?: string
  score?: number
}

export interface Folder {
  id: number
  name: string
  description?: string
}
