import type { Folder } from '../types/index'
import api from './api'

export interface CreateFolderPayload {
  name: string
  description?: string
}

export const folderService = {
  async getFolders(): Promise<Folder[]> {
    const res = await api.get('/folders/')
    console.log('Fetched folders:', res.data)
    return res.data ?? []
  },

  async createFolder(payload: CreateFolderPayload): Promise<void> {
    await api.post('/folders', payload)
  },

  async deleteFolder(folderId: number): Promise<void> {
    await api.delete('/folders/', { params: { folder_id: folderId } })
  },
}
