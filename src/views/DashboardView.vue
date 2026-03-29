<template>
    <div class="dashboard">

        <section class="hero">
            <div class="hero-inner">
                <h1 class="hero-title">What are you cooking <em>today?</em></h1>
                <p class="hero-sub">Search by dish name, ingredients, or cooking method</p>
                <div class="search-wrap">
                    <SearchBar />
                </div>
            </div>
        </section>

        <section class="recommendations">
            <div class="recs-inner">

                <div class="rec-section">
                    <div class="rec-header">
                        <div>
                            <h2 class="rec-title">From your collection</h2>
                            <p class="rec-subtitle">Dishes similar to everything you've saved</p>
                        </div>
                    </div>

                    <div v-if="summaryList.length" class="cards-grid">
                        <RecipeCard v-for="recipe in summaryList" :key="recipe.recipe_id" :recipe="recipe"
                            @bookmark="openBookmark" />
                    </div>
                    <div v-else-if="loading" class="cards-grid skeleton-grid">
                        <div v-for="n in 4" :key="n" class="skeleton-card"></div>
                    </div>
                    <div v-else-if="hasFolders" class="empty-state">
                        <span class="empty-icon">📂</span>
                        <p>Your folders are empty! Bookmark some dishes to get personalised picks.</p>
                    </div>
                    <div v-else class="empty-state">
                        <span class="empty-icon">◌</span>
                        <p>No folders yet. <RouterLink to="/bookmarks">Create a folder</RouterLink> and bookmark some
                            dishes to get personalised picks.</p>
                    </div>
                </div>

                <div class="rec-section">
                    <div class="rec-header">
                        <div>
                            <h2 class="rec-title">From a folder</h2>
                            <p class="rec-subtitle">Picks based on this specific collection</p>
                            <p>
                                {{folders.find(f => f.id === chosenFolderId)?.name || 'Unknown'}}
                            </p>
                        </div>
                    </div>

                    <div v-if="specificList.length" class="cards-grid">
                        <RecipeCard v-for="recipe in specificList" :key="recipe.recipe_id" :recipe="recipe"
                            @bookmark="openBookmark" />
                    </div>
                    <div v-else-if="loading && chosenFolderId" class="cards-grid skeleton-grid">
                        <div v-for="n in 4" :key="n" class="skeleton-card"></div>
                    </div>
                    <div v-else-if="hasFolders && chosenFolderId" class="empty-state">
                        <span class="empty-icon">📂</span>
                        <p>This folder is empty! Bookmark some dishes here to see suggestions.</p>
                    </div>
                    <div v-else class="empty-state">
                        <span class="empty-icon">◌</span>
                        <p>No folders yet. <RouterLink to="/bookmarks">Create a folder</RouterLink> and bookmark some
                            dishes to see folder-based suggestions.</p>
                    </div>
                </div>

                <div class="rec-section">
                    <div class="rec-header">
                        <div>
                            <h2 class="rec-title">Discover something new</h2>
                            <p class="rec-subtitle">A random selection from thousands of recipes</p>
                        </div>
                        <button class="btn-refresh" @click="fetchRecommendations" title="Shuffle" :disabled="loading">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polyline points="23 4 23 10 17 10" />
                                <polyline points="1 20 1 14 7 14" />
                                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                            </svg>
                            Shuffle
                        </button>
                    </div>

                    <div v-if="randomList.length && !loading" class="cards-grid">
                        <RecipeCard v-for="recipe in randomList" :key="recipe.recipe_id" :recipe="recipe"
                            @bookmark="openBookmark" />
                    </div>
                    <div v-else class="cards-grid skeleton-grid">
                        <div v-for="n in 4" :key="n" class="skeleton-card"></div>
                    </div>
                </div>

            </div>
        </section>

        <BookmarkPopup v-if="bookmarkTarget" :recipe="bookmarkTarget" @close="bookmarkTarget = null"
            @saved="bookmarkTarget = null" />

    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import BookmarkPopup from '../components/BookmarkPopup.vue'
import RecipeCard from '../components/RecipeCard.vue'
import SearchBar from '../components/SearchBar.vue'
import type { Folder, RecipeCard as RecipeCardType } from '../types/index'

import { folderService } from '@/services/folder'
import { recommendationService } from '@/services/recommendation'

const loading = ref(false)
const summaryList = ref<RecipeCardType[]>([])
const specificList = ref<RecipeCardType[]>([])
const randomList = ref<RecipeCardType[]>([])
const folders = ref<Folder[]>([])
const chosenFolderId = ref<number | null>(null)
const bookmarkTarget = ref<RecipeCardType | null>(null)

const hasFolders = computed(() => folders.value.length > 0)

watch(chosenFolderId, async () => {
    await fetchRecommendations()
})

async function fetchFolders() {
    try {
        const response = await folderService.getFolders()

        const actualFoldersArray = Array.isArray(response) ? response : (response?.data || response?.folders || [])

        folders.value = actualFoldersArray

        console.log("Dashboard.vue - Folders Array:", folders.value)

        if (folders.value && folders.value.length > 0) {
            const randomIndex = Math.floor(Math.random() * folders.value.length)
            chosenFolderId.value = folders.value[randomIndex].id

            console.log("Dashboard.vue - Randomly selected ID:", chosenFolderId.value)
        } else {
            console.log("Dashboard.vue - Folders array is empty or undefined. ID remains null.")
        }
    } catch (error) {
        console.error("Error fetching folders:", error)
        folders.value = []
    }
}

async function fetchRecommendations() {
    loading.value = true
    try {
        console.log("Fetching recs... Chosen Folder ID is:", chosenFolderId.value)

        const data = await recommendationService.getLandingRecommendations(chosenFolderId.value)

        console.log("Backend returned:", data)

        summaryList.value = data.summary_all_folders ?? []
        specificList.value = data.specific_category ?? []
        randomList.value = data.random_dishes ?? []
    } catch (error) {
        console.error("Error fetching recommendations:", error)
        randomList.value = []
    } finally {
        loading.value = false
    }
}

function openBookmark(recipe: RecipeCardType) {
    bookmarkTarget.value = recipe
}

onMounted(async () => {
    // 1. Fetch folders and randomly set chosenFolderId
    await fetchFolders()
    // 2. Fetch recommendations using that newly selected ID
    await fetchRecommendations()
})
</script>

<style scoped>
.dashboard {
    min-height: 100vh;
}

/* HERO */
.hero {
    border-bottom: 1px solid var(--border);
    background: var(--bg2);
    padding: 3.5rem 2rem;
}

.hero-inner {
    max-width: 640px;
    margin: 0 auto;
    text-align: center;
}

.hero-title {
    font-size: 2.2rem;
    font-weight: 900;
    letter-spacing: -0.04em;
    color: var(--text);
    margin-bottom: 0.5rem;
    line-height: 1.15;
}

.hero-title em {
    color: var(--accent);
    font-style: normal;
}

.hero-sub {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 1.75rem;
}

.search-wrap {
    width: 100%;
}

/* RECOMMENDATIONS */
.recommendations {
    padding: 3rem 2rem;
}

.recs-inner {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 3rem;
}

.rec-section {}

.rec-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.25rem;
}

.rec-title {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.02em;
    margin-bottom: 0.2rem;
}

.rec-subtitle {
    font-size: 0.8rem;
    color: var(--text-muted);
}

.folder-select {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    font-size: 0.8rem;
    padding: 0.35rem 0.65rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    flex-shrink: 0;
}

.btn-refresh {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 0.35rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.8rem;
    font-weight: 500;
    transition: all 0.15s;
    flex-shrink: 0;
}

.btn-refresh:hover {
    border-color: var(--accent);
    color: var(--accent);
}

.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
}

/* EMPTY STATE */
.empty-state {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: var(--surface);
    border: 1px dashed var(--border);
    border-radius: var(--radius-md);
    padding: 1.5rem;
}

.empty-icon {
    font-size: 1.5rem;
    color: var(--text-muted);
    flex-shrink: 0;
}

.empty-state p {
    font-size: 0.85rem;
    color: var(--text-muted);
    line-height: 1.6;
}

.empty-state a {
    color: var(--accent);
    font-weight: 600;
}

/* SKELETONS */
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
</style>