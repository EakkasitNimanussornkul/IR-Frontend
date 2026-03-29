<template>
    <div class="bookmarks-view">
        <div class="page-header">
            <div class="header-inner">
                <div>
                    <h1 class="page-title">Bookmarks</h1>
                    <p class="page-sub">Your saved recipes organised by folder</p>
                </div>
                <button class="btn-new-folder" @click="showCreateFolder = true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New folder
                </button>
            </div>

            <div class="tabs-wrap" v-if="folders.length">
                <div class="tabs">
                    <button class="tab" :class="{ active: activeFolder === null }" @click="activeFolder = null">
                        All
                        <span class="tab-count">{{ allBookmarks.length }}</span>
                    </button>
                    <button v-for="folder in folders" :key="folder.id" class="tab"
                        :class="{ active: activeFolder?.id === folder.id }" @click="setActiveFolder(folder)">
                        {{ folder.name }}
                        <span class="tab-count">{{ countForFolder(folder.id) }}</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="page-body">
            <div class="body-inner">

                <div v-if="folders.length === 0 && !loading" class="empty-state">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="1.5">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    <p>No folders yet</p>
                    <span>Create a folder to start bookmarking recipes</span>
                    <button class="btn-new-folder" @click="showCreateFolder = true">Create your first folder</button>
                </div>

                <div v-else-if="loading" class="cards-grid">
                    <div v-for="n in 6" :key="n" class="skeleton-card"></div>
                </div>

                <template v-else-if="activeFolder === null && folders.length > 0">
                    <div v-if="allBookmarkCards.length === 0" class="empty-state">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.5">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                        <p>No bookmarks yet</p>
                        <span>Search for recipes and save them to a folder</span>
                        <RouterLink to="/search" class="btn-new-folder">Find recipes</RouterLink>
                    </div>
                    <div v-else class="cards-grid">
                        <BookmarkCard v-for="card in allBookmarkCards" :key="card.recipe_id + '-' + card.folder_id"
                            :bookmark="card" @delete="handleDeleteBookmark" />
                    </div>
                </template>

                <template v-else-if="activeFolder">
                    <div class="folder-actions">
                        <span class="folder-desc">{{ activeFolder.description }}</span>
                        <div class="folder-btns">
                            <RouterLink :to="`/folders/${activeFolder.id}`" class="btn-suggestions">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="16" />
                                    <line x1="8" y1="12" x2="16" y2="12" />
                                </svg>
                                Get suggestions
                            </RouterLink>
                            <button class="btn-delete-folder" @click="handleDeleteFolder(activeFolder)">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                </svg>
                                Delete folder
                            </button>
                        </div>
                    </div>

                    <div v-if="bookmarkCards.length === 0" class="empty-state">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.5">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                        <p>This folder is empty</p>
                        <span>Search for recipes and save them here</span>
                        <RouterLink to="/search" class="btn-new-folder">Find recipes</RouterLink>
                    </div>
                    <div v-else class="cards-grid">
                        <BookmarkCard v-for="card in bookmarkCards" :key="card.recipe_id" :bookmark="card"
                            @delete="handleDeleteBookmark" />
                    </div>
                </template>

            </div>
        </div>

        <Teleport to="body">
            <div v-if="showCreateFolder" class="overlay" @click.self="showCreateFolder = false">
                <div class="popup">
                    <div class="popup-header">
                        <h2>New folder</h2>
                        <button class="btn-close" @click="showCreateFolder = false">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                    <div class="popup-body">
                        <div class="field">
                            <label>Folder name</label>
                            <input v-model="newFolderName" type="text" placeholder="e.g. Weeknight dinners"
                                @keydown.enter="handleCreateFolder" />
                        </div>
                        <div class="field">
                            <label>Description</label>
                            <input v-model="newFolderDesc" type="text" placeholder="Optional description"
                                @keydown.enter="handleCreateFolder" />
                        </div>
                        <div v-if="folderError" class="error-msg">{{ folderError }}</div>
                        <button class="btn-save" :disabled="!newFolderName.trim() || folderLoading"
                            @click="handleCreateFolder">
                            <span v-if="folderLoading" class="spinner"></span>
                            {{ folderLoading ? 'Creating…' : 'Create folder' }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BookmarkCard from '../components/BookmarkCard.vue'
import { bookmarkService, type RawBookmark } from '../services/bookmark'
import { folderService } from '../services/folder'
import type { BookmarkCard as BookmarkCardType, Folder } from '../types/index'

const folders = ref<Folder[]>([])
const activeFolder = ref<Folder | null>(null)
const allBookmarks = ref<RawBookmark[]>([])
const allBookmarkCards = ref<BookmarkCardType[]>([])
const bookmarkCards = ref<BookmarkCardType[]>([])
const loading = ref(false)

const showCreateFolder = ref(false)
const newFolderName = ref('')
const newFolderDesc = ref('')
const folderLoading = ref(false)
const folderError = ref('')

function countForFolder(folderId: number) {
    return allBookmarks.value.filter(b => b.folder_id === folderId).length
}

// ── Data loading ───────────────────────────────────────────────────────────────
async function loadAll() {
    loading.value = true
    try {
        const [fetchedFolders, fetchedBookmarks] = await Promise.all([
            folderService.getFolders(),
            bookmarkService.getAllBookmarks(),
        ])
        folders.value = fetchedFolders
        allBookmarks.value = fetchedBookmarks
        allBookmarkCards.value = await bookmarkService.fetchBookmarkCards(fetchedBookmarks)
        activeFolder.value = null
        bookmarkCards.value = []
    } catch {
        folders.value = []
        allBookmarks.value = []
        allBookmarkCards.value = []
    } finally {
        loading.value = false
    }
}

async function setActiveFolder(folder: Folder) {
    activeFolder.value = folder
    loading.value = true
    try {
        bookmarkCards.value = await bookmarkService.getCardsForFolder(folder.id, allBookmarks.value)
    } catch {
        bookmarkCards.value = []
    } finally {
        loading.value = false
    }
}

async function handleCreateFolder() {
    if (!newFolderName.value.trim()) return
    folderLoading.value = true
    folderError.value = ''
    try {
        await folderService.createFolder({
            name: newFolderName.value.trim(),
            description: newFolderDesc.value.trim(),
        })
        newFolderName.value = ''
        newFolderDesc.value = ''
        showCreateFolder.value = false
        await loadAll()
    } catch (e: any) {
        folderError.value = e.response?.data?.detail ?? 'Failed to create folder.'
    } finally {
        folderLoading.value = false
    }
}

async function handleDeleteFolder(folder: Folder) {
    if (!confirm(`Delete "${folder.name}"? All bookmarks inside will also be removed.`)) return
    try {
        await folderService.deleteFolder(folder.id)
        await loadAll()
    } catch { }
}

async function handleDeleteBookmark(bookmark: BookmarkCardType) {
    const raw = allBookmarks.value.find(
        b => b.recipe_id === String(bookmark.recipe_id) && b.folder_id === bookmark.folder_id
    )
    if (!raw) return
    try {
        await bookmarkService.deleteBookmark(raw.id)
        await loadAll()
        if (activeFolder.value) {
            const stillExists = folders.value.find(f => f.id === activeFolder.value!.id)
            if (stillExists) setActiveFolder(stillExists)
        }
    } catch { }
}

onMounted(loadAll)
</script>

<style scoped>
/* all styles identical to before */
.bookmarks-view {
    min-height: 100vh;
}

.page-header {
    background: var(--bg2);
    border-bottom: 1px solid var(--border);
    padding: 2rem 2rem 0;
}

.header-inner {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.5rem;
}

.page-title {
    font-size: 1.5rem;
    font-weight: 900;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 0.25rem;
}

.page-sub {
    font-size: 0.825rem;
    color: var(--text-muted);
}

.btn-new-folder {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: var(--accent);
    color: #111;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.15s;
    text-decoration: none;
}

.btn-new-folder:hover {
    opacity: 0.85;
}

.tabs-wrap {
    max-width: 1000px;
    margin: 0 auto;
    overflow-x: auto;
}

.tabs {
    display: flex;
    gap: 0.15rem;
    min-width: max-content;
}

.tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--text-muted);
    padding: 0.65rem 1rem;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
}

.tab:hover {
    color: var(--text);
}

.tab.active {
    color: var(--accent);
    border-bottom-color: var(--accent);
}

.tab-count {
    font-family: var(--mono);
    font-size: 0.68rem;
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 0.1rem 0.4rem;
    border-radius: 999px;
    color: var(--text-muted);
}

.page-body {
    padding: 2rem;
}

.body-inner {
    max-width: 1000px;
    margin: 0 auto;
}

.folder-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    gap: 1rem;
}

.folder-desc {
    font-size: 0.825rem;
    color: var(--text-muted);
}

.folder-btns {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
}

.btn-suggestions {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: transparent;
    border: 1px solid var(--accent);
    color: var(--accent);
    padding: 0.4rem 0.85rem;
    border-radius: var(--radius-sm);
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    text-decoration: none;
}

.btn-suggestions:hover {
    background: var(--accent-dim);
}

.btn-delete-folder {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 0.4rem 0.85rem;
    border-radius: var(--radius-sm);
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
}

.btn-delete-folder:hover {
    border-color: var(--red);
    color: var(--red);
}

.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 5rem 2rem;
    color: var(--text-muted);
    text-align: center;
}

.empty-state p {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text);
}

.empty-state span {
    font-size: 0.825rem;
}

.skeleton-card {
    aspect-ratio: 4/3;
    background: var(--surface);
    border-radius: var(--radius-md);
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.4;
    }
}

.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 1rem;
}

.popup {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 400px;
}

.popup-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.popup-header h2 {
    font-size: 1rem;
    font-weight: 800;
    color: var(--text);
}

.btn-close {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
    width: 28px;
    height: 28px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
}

.btn-close:hover {
    color: var(--text);
    border-color: var(--text-muted);
}

.popup-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.field label {
    font-size: 0.78rem;
    color: var(--text-muted);
}

.btn-save {
    width: 100%;
    padding: 0.65rem;
    background: var(--accent);
    color: #111;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn-save:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.spinner {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid rgba(17, 17, 19, 0.3);
    border-top-color: #111;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>