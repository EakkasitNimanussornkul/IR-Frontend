import type { RecipeCard } from '../types/index'
import api from './api'

export interface RecipeDetail {
  recipe_id: number
  name: string
  image_urls: string
  description: string
  prep_time: string
  cook_time: string
  ingredient_quantities: string
  ingredient_parts: string
  instructions: string
  similar_recipes: RecipeCard[]
}

export const recipeService = {
  async getById(id: string | string[]): Promise<RecipeDetail> {
    const res = await api.get('/recipes/get_recipe_by_id', { params: { recipe_id: id } })
    return res.data.data
  },

  /** Converts ISO 8601 duration to readable string. e.g. PT1H30M → "1h 30 min" */
  formatTime(iso: string): string {
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
    if (!match) return iso
    const h = match[1] ? `${match[1]}h ` : ''
    const m = match[2] ? `${match[2]} min` : ''
    return (h + m).trim() || iso
  },
}
