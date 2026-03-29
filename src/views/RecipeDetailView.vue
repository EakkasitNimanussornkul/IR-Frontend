<template>
    <div class="detail-view">

        <div class="detail-topbar">
            <div class="topbar-inner">
                <button class="btn-back" @click="router.back()">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back
                </button>
            </div>
        </div>

        <div v-if="loading" class="loading-state">
            <div class="spinner-lg"></div>
        </div>

        <div v-else-if="error" class="error-state">
            <p>Could not load this recipe.</p>
            <button class="btn-back" @click="router.back()">Go back</button>
        </div>

        <div v-else-if="recipe" class="detail-content">
            <div class="detail-inner">

                <aside class="detail-aside">
                    <div class="detail-image">
                        <img v-if="!imgError && firstImage" :src="firstImage" :alt="recipe.name" loading="lazy"
                            @error="imgError = true" />
                        <div v-else class="img-fallback">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                        </div>
                    </div>

                    <div class="meta-row">
                        <div class="meta-item" v-if="recipe.prep_time">
                            <span class="meta-label">Prep</span>
                            <span class="meta-value">{{ recipeService.formatTime(recipe.prep_time) }}</span>
                        </div>
                        <div class="meta-divider" v-if="recipe.prep_time && recipe.cook_time"></div>
                        <div class="meta-item" v-if="recipe.cook_time">
                            <span class="meta-label">Cook</span>
                            <span class="meta-value">{{ recipeService.formatTime(recipe.cook_time) }}</span>
                        </div>
                    </div>

                    <button class="btn-bookmark-full" @click="openBookmark()">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                        Save to folder
                    </button>
                </aside>

                <div class="detail-main">
                    <h1 class="recipe-name">{{ recipe.name }}</h1>
                    <p class="recipe-desc">{{ recipe.description }}</p>

                    <section class="recipe-section">
                        <h2 class="section-title">Ingredients</h2>
                        <ul class="ingredient-list">
                            <li v-for="(part, i) in ingredientParts" :key="i" class="ingredient-item">
                                <span class="ingredient-qty">{{ ingredientQtys[i] ?? '' }}</span>
                                <span class="ingredient-name">{{ part }}</span>
                            </li>
                        </ul>
                    </section>

                    <section class="recipe-section">
                        <h2 class="section-title">Instructions</h2>
                        <ol class="instruction-list">
                            <li v-for="(step, i) in instructionSteps" :key="i" class="instruction-step">
                                <span class="step-num">{{ i + 1 }}</span>
                                <span class="step-text">{{ step }}</span>
                            </li>
                        </ol>
                    </section>
                </div>

            </div>

            <div class="similar-section" v-if="recipe.similar_recipes?.length">
                <div class="similar-inner">
                    <h2 class="similar-title">More like this</h2>
                    <p class="similar-sub">Recipes similar to {{ recipe.name }}</p>
                    <div class="cards-grid">
                        <RecipeCard v-for="r in recipe.similar_recipes" :key="r.recipe_id" :recipe="r"
                            @bookmark="openBookmark" />
                    </div>
                </div>
            </div>
        </div>

        <BookmarkPopup v-if="bookmarkTarget" :recipe="bookmarkTarget" @close="bookmarkTarget = null"
            @saved="bookmarkTarget = null" />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BookmarkPopup from '../components/BookmarkPopup.vue'
import RecipeCard from '../components/RecipeCard.vue'
import { recipeService, type RecipeDetail } from '../services/recipe'
import type { RecipeCard as RecipeCardType } from '../types/index'

const route = useRoute()
const router = useRouter()

// ── State ──────────────────────────────────────────────────────────────────────
const recipe = ref<RecipeDetail | null>(null)
const bookmarkTarget = ref<RecipeCardType | null>(null)
const loading = ref(true)
const error = ref(false)
const imgError = ref(false)

// ── Computeds ──────────────────────────────────────────────────────────────────
const firstImage = computed(() => recipe.value?.image_urls || '')

const ingredientParts = computed(() =>
    recipe.value?.ingredient_parts.split(',').map(s => s.trim()).filter(Boolean) ?? []
)

const ingredientQtys = computed(() =>
    recipe.value?.ingredient_quantities.split(',').map(s => s.trim()) ?? []
)

const instructionSteps = computed(() =>
    recipe.value?.instructions.split('.,').map(s => s.trim().replace(/\.$/, '')).filter(Boolean) ?? []
)

// ── Handlers ───────────────────────────────────────────────────────────────────
function openBookmark(r?: RecipeCardType) {
    console.log('r from emit:', r)
    console.log('recipe.value:', recipe.value)  // add this
    bookmarkTarget.value = r ?? {
        recipe_id: recipe.value!.recipe_id,
        name: recipe.value!.name,
        description_preview: recipe.value!.description,
        image_urls: recipe.value!.image_urls,
    }
}

onMounted(async () => {
    try {
        recipe.value = await recipeService.getById(route.params.id)
    } catch {
        error.value = true
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.detail-view {
    min-height: 100vh;
}

/* TOPBAR */
.detail-topbar {
    border-bottom: 1px solid var(--border);
    padding: 0.75rem 2rem;
    background: var(--bg2);
}

.topbar-inner {
    max-width: 1000px;
    margin: 0 auto;
}

.btn-back {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 0.35rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
}

.btn-back:hover {
    color: var(--text);
    border-color: var(--text-muted);
}

/* STATES */
.loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 40vh;
}

.spinner-lg {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 4rem 2rem;
    color: var(--text-muted);
}

/* MAIN CONTENT */
.detail-content {
    padding-bottom: 4rem;
}

.detail-inner {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2.5rem 2rem;
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 3rem;
    align-items: start;
}

/* ASIDE */
.detail-aside {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-self: start;
}

.detail-image {
    width: 100%;
    aspect-ratio: 4/3;
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--surface2);
    border: 1px solid var(--border);
}

.detail-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.img-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
}

.meta-row {
    display: flex;
    align-items: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.75rem 1rem;
    gap: 1rem;
}

.meta-item {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    flex: 1;
    text-align: center;
}

.meta-label {
    font-family: var(--mono);
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
}

.meta-value {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text);
}

.meta-divider {
    width: 1px;
    height: 32px;
    background: var(--border);
}

.btn-bookmark-full {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.65rem;
    background: transparent;
    border: 1px solid var(--accent);
    color: var(--accent);
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
}

.btn-bookmark-full:hover {
    background: var(--accent-dim);
}

/* MAIN */
.recipe-name {
    font-size: 1.75rem;
    font-weight: 900;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 0.75rem;
    line-height: 1.2;
}

.recipe-desc {
    font-size: 0.9rem;
    color: var(--text-muted);
    line-height: 1.7;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--border);
}

.recipe-section {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--border);
}

.recipe-section:last-child {
    border-bottom: none;
}

.section-title {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin-bottom: 1rem;
    font-family: var(--mono);
}

/* INGREDIENTS */
.ingredient-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.ingredient-item {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    font-size: 0.875rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border);
}

.ingredient-item:last-child {
    border-bottom: none;
}

.ingredient-qty {
    font-family: var(--mono);
    font-size: 0.78rem;
    color: var(--accent);
    min-width: 2.5rem;
    flex-shrink: 0;
}

.ingredient-name {
    color: var(--text);
}

/* INSTRUCTIONS */
.instruction-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.instruction-step {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
}

.step-num {
    font-family: var(--mono);
    font-size: 0.72rem;
    color: var(--accent);
    background: var(--accent-dim);
    border: 1px solid rgba(245, 166, 35, 0.2);
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
}

.step-text {
    font-size: 0.875rem;
    color: var(--text);
    line-height: 1.7;
}

/* SIMILAR SECTION */
.similar-section {
    border-top: 1px solid var(--border);
    padding: 2.5rem 2rem;
    background: var(--bg2);
}

.similar-inner {
    max-width: 1000px;
    margin: 0 auto;
}

.similar-title {
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text);
    margin-bottom: 0.25rem;
}

.similar-sub {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-bottom: 1.5rem;
}

.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 1rem;
}

/* RESPONSIVE */
@media (max-width: 768px) {
    .detail-inner {
        grid-template-columns: 1fr;
    }

    .detail-aside {
        position: static;
    }
}
</style>