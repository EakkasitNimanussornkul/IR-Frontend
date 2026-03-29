import type { RecipeCard } from '../types/index'
import api from './api'

export interface LandingRecommendations {
  summary_all_folders: RecipeCard[]
  specific_category: RecipeCard[]
  random_dishes: RecipeCard[]
}

export const recommendationService = {
  async getLandingRecommendations(chosenFolderId?: number | null): Promise<LandingRecommendations> {
    const params: Record<string, any> = {}
    if (chosenFolderId) params.chosen_folder_id = chosenFolderId

    const res = await api.get('/recommendations/landing-recommendations', { params })
    return res.data.data
  },
}
