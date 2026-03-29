<template>
    <div class="search-view">
        <div class="search-header">
            <div class="search-inner">

                <div class="search-box" :class="{ focused: searchFocused }">
                    <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input v-model="query" type="text" placeholder="Search by dish, ingredient, or method…"
                        @keydown.enter="handleSearch" @focus="searchFocused = true" @blur="searchFocused = false"
                        class="search-input" ref="inputRef" />
                    <button class="btn-search" :disabled="!query.trim()" @click="handleSearch">Search</button>
                </div>

                <div v-if="suggestion" class="spell-banner">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>Did you mean <strong>{{ suggestion }}</strong>?</span>
                    <button class="btn-suggestion" @click="acceptSuggestion">Search for "{{ suggestion }}"</button>
                    <button class="btn-dismiss" @click="suggestion = null">Dismiss</button>
                </div>

            </div>
        </div>

        <div class="search-body">
            <div class="body-inner" :class="{ 'no-sidebar': !categories.length && !loading }">

                <aside class="sidebar" v-if="categories.length || loading">
                    <p class="sidebar-label">Filter by category</p>
                    <div class="category-list">
                        <button class="cat-chip" :class="{ active: activeCategory === null }"
                            @click="setCategory(null)">
                            All
                            <span class="cat-count">{{ totalHit.toLocaleString() }}</span>
                        </button>
                        <button v-for="cat in categories" :key="cat.category" class="cat-chip"
                            :class="{ active: activeCategory === cat.category }" @click="setCategory(cat.category)">
                            {{ cat.category }}
                            <span class="cat-count">{{ cat.count.toLocaleString() }}</span>
                        </button>
                    </div>
                </aside>

                <main class="results">

                    <div class="results-meta" v-if="!loading && results.length">
                        <span class="meta-count">
                            {{ totalHit.toLocaleString() }} results
                            <span v-if="activeCategory"> in <em>{{ activeCategory }}</em></span>
                        </span>
                        <span class="meta-time">{{ elapse.toFixed(2) }}s</span>
                    </div>

                    <div v-if="loading" class="cards-grid">
                        <div v-for="n in 10" :key="n" class="skeleton-card"></div>
                    </div>

                    <div v-else-if="results.length" class="cards-grid">
                        <RecipeCard v-for="recipe in results" :key="recipe.recipe_id" :recipe="recipe"
                            @bookmark="openBookmark" />
                    </div>

                    <div v-else-if="searched" class="empty-state">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.5">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <p>No results for <strong>"{{ lastQuery }}"</strong></p>
                        <span>Try different keywords or check your spelling</span>
                    </div>

                    <div v-else class="empty-state">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.5">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <p>Search for a recipe to get started</p>
                    </div>

                </main>

            </div>
        </div>

        <BookmarkPopup v-if="bookmarkTarget" :recipe="bookmarkTarget" @close="bookmarkTarget = null"
            @saved="bookmarkTarget = null" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BookmarkPopup from '../components/BookmarkPopup.vue'
import RecipeCard from '../components/RecipeCard.vue'
import { searchService, type Category } from '../services/search'
import type { RecipeCard as RecipeCardType } from '../types/index'

const route = useRoute()
const router = useRouter()

// ── State ──────────────────────────────────────────────────────────────────────
const query = ref('')
const lastQuery = ref('')
const loading = ref(false)
const searched = ref(false)
const searchFocused = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const bookmarkTarget = ref<RecipeCardType | null>(null)
const results = ref<RecipeCardType[]>([])
const categories = ref<Category[]>([])
const activeCategory = ref<string | null>(null)
const suggestion = ref<string | null>(null)
const totalHit = ref(0)
const elapse = ref(0)

// ── Search ─────────────────────────────────────────────────────────────────────
async function runSearch(q: string, categoryFilter: string | null = null) {
    loading.value = true
    searched.value = false
    suggestion.value = null
    try {
        const data = await searchService.search(q, categoryFilter)

        results.value = data.results
        totalHit.value = data.totalHit
        elapse.value = data.elapse
        suggestion.value = data.suggestion

        // only update category chips when not filtering so chips
        // don't disappear after the user selects one
        if (!categoryFilter) {
            categories.value = data.categories
        }

        lastQuery.value = q
        searched.value = true
    } catch {
        results.value = []
        categories.value = []
    } finally {
        loading.value = false
    }
}

// ── Handlers ───────────────────────────────────────────────────────────────────
function handleSearch() {
    if (!query.value.trim()) return
    activeCategory.value = null
    router.replace({ path: '/search', query: { q: query.value.trim() } })
    runSearch(query.value.trim())
}

function setCategory(cat: string | null) {
    activeCategory.value = cat
    runSearch(lastQuery.value, cat)
}

function acceptSuggestion() {
    query.value = suggestion.value!
    suggestion.value = null
    activeCategory.value = null
    router.replace({ path: '/search', query: { q: query.value } })
    runSearch(query.value)
}

function openBookmark(recipe: RecipeCardType) {
    bookmarkTarget.value = recipe
}

onMounted(() => {
    const q = route.query.q as string
    if (q) {
        query.value = q
        runSearch(q)
    } else {
        inputRef.value?.focus()
    }
})
</script>

<style scoped>
.search-view {
    min-height: 100vh;
}

/* HEADER */
.search-header {
    background: var(--bg2);
    border-bottom: 1px solid var(--border);
    padding: 1.25rem 2rem;
    position: sticky;
    top: 56px;
    z-index: 40;
}

.search-inner {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.search-box {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 0.5rem 0.5rem 0.5rem 1rem;
    transition: border-color 0.15s;
}

.search-box.focused {
    border-color: var(--accent);
}

.search-icon {
    color: var(--text-muted);
    flex-shrink: 0;
}

.search-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.9rem;
    color: var(--text);
}

.search-input::placeholder {
    color: var(--text-muted);
}

.btn-search {
    background: var(--accent);
    color: #111;
    border: none;
    padding: 0.5rem 1.1rem;
    border-radius: var(--radius-sm);
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.15s;
    flex-shrink: 0;
}

.btn-search:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* SPELL CORRECTION */
.spell-banner {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--surface);
    border: 1px solid rgba(245, 166, 35, 0.3);
    border-radius: var(--radius-sm);
    padding: 0.6rem 1rem;
    font-size: 0.825rem;
    color: var(--text-muted);
    flex-wrap: wrap;
}

.spell-banner svg {
    color: var(--accent);
    flex-shrink: 0;
}

.spell-banner strong {
    color: var(--accent);
}

.btn-suggestion {
    background: var(--accent);
    color: #111;
    border: none;
    padding: 0.28rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    margin-left: auto;
}

.btn-dismiss {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 0.28rem 0.65rem;
    border-radius: var(--radius-sm);
    font-size: 0.78rem;
    cursor: pointer;
}

/* BODY */
.search-body {
    padding: 2rem;
}

.body-inner {
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 2rem;
    align-items: start;
}

.body-inner.no-sidebar {
    grid-template-columns: 1fr;
}

/* SIDEBAR */
.sidebar {
    position: sticky;
    top: 120px;
}

.sidebar-label {
    font-family: var(--mono);
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
}

.category-list {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}

.cat-chip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: transparent;
    border: 1px solid transparent;
    color: var(--text-muted);
    padding: 0.4rem 0.65rem;
    border-radius: var(--radius-sm);
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    text-align: left;
    width: 100%;
}

.cat-chip:hover {
    background: var(--surface);
    color: var(--text);
    border-color: var(--border);
}

.cat-chip.active {
    background: var(--accent-dim);
    color: var(--accent);
    border-color: rgba(245, 166, 35, 0.3);
}

.cat-count {
    font-family: var(--mono);
    font-size: 0.68rem;
    color: var(--text-muted);
}

.cat-chip.active .cat-count {
    color: var(--accent);
}

/* RESULTS */
.results-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.meta-count {
    font-size: 0.82rem;
    color: var(--text-muted);
}

.meta-count em {
    color: var(--accent);
    font-style: normal;
    font-weight: 600;
}

.meta-time {
    font-family: var(--mono);
    font-size: 0.72rem;
    color: var(--text-muted);
}

.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
}

/* EMPTY */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 4rem 2rem;
    color: var(--text-muted);
    text-align: center;
}

.empty-state p {
    font-size: 0.95rem;
    color: var(--text);
}

.empty-state span {
    font-size: 0.82rem;
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

@media (max-width: 640px) {
    .body-inner {
        grid-template-columns: 1fr;
    }

    .sidebar {
        position: static;
    }
}
</style>