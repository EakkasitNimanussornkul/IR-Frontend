<template>
    <div class="recipe-card" @click="goToDetail">
        <div class="card-image">
            <img v-if="firstImage && !imgError" :src="firstImage" :alt="recipe.name" loading="lazy"
                @error="imgError = true" />
            <div v-else class="img-fallback">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>No image</span>
            </div>
        </div>
        <div class="card-body">
            <h3 class="card-title">{{ recipe.name }}</h3>
            <p class="card-desc">{{ recipe.description_preview }}</p>
        </div>
        <div class="card-footer">
            <button class="btn-bookmark" @click.stop="emit('bookmark', recipe)" title="Bookmark this recipe">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                <span>Save</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { RecipeCard } from '../types/index';

const props = defineProps<{
    recipe: RecipeCard
}>()

const emit = defineEmits<{
    bookmark: [recipe: RecipeCard]
}>()

const router = useRouter()
const imgError = ref(false)

const firstImage = computed(() => props.recipe.image_urls || '')

function goToDetail() {
    router.push(`/recipe/${props.recipe.recipe_id}`)
}

watch(() => props.recipe.recipe_id, () => { imgError.value = false })
</script>

<style scoped>
.recipe-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.15s, transform 0.15s;
    display: flex;
    flex-direction: column;
}

.recipe-card:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
}

.card-image {
    width: 100%;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: var(--surface2);
}

.card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.img-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: var(--text-muted);
    background: var(--surface2);
}

.img-fallback span {
    font-size: 0.72rem;
    color: var(--text-muted);
}

.card-body {
    padding: 0.85rem 0.85rem 0;
    flex: 1;
}

.card-title {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 0.35rem;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-desc {
    font-size: 0.75rem;
    color: var(--text-muted);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-footer {
    padding: 0.75rem 0.85rem;
    display: flex;
    justify-content: flex-end;
}

.btn-bookmark {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 0.3rem 0.65rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 500;
    transition: all 0.15s;
}

.btn-bookmark:hover {
    border-color: var(--accent);
    color: var(--accent);
}
</style>