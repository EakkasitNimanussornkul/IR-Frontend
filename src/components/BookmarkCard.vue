<template>
    <div class="recipe-card" @click="goToDetail">
        <div class="card-image">
            <img v-if="firstImage && !imgError" :src="firstImage" :alt="bookmark.name" loading="lazy"
                @error="imgError = true" />
            <div v-else class="img-fallback">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                </svg>
            </div>
        </div>

        <div class="card-body">
            <h3 class="card-title">{{ bookmark.name }}</h3>
            <p class="card-desc">{{ bookmark.description_preview }}</p>
        </div>

        <div class="card-footer">
            <div class="stars">
                <svg v-for="n in 5" :key="n" width="12" height="12" viewBox="0 0 24 24"
                    :fill="n <= (bookmark.rating ?? 0) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"
                    :class="n <= (bookmark.rating ?? 0) ? 'star-filled' : 'star-empty'">
                    <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            </div>
            <button class="btn-delete" @click.stop="emit('delete', bookmark)" title="Remove bookmark">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { BookmarkCard } from '../types/index';

const props = defineProps<{
    bookmark: BookmarkCard
}>()

watch(() => props.bookmark.recipe_id, () => {
    imgError.value = false
})

const emit = defineEmits<{
    delete: [bookmark: BookmarkCard]
}>()

const router = useRouter()
const imgError = ref(false)

const firstImage = computed(() => props.bookmark.image_urls || '')

function goToDetail() {
    router.push(`/recipe/${props.bookmark.recipe_id}`)
}
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
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    background: var(--surface2);
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
    align-items: center;
    justify-content: space-between;
}

.stars {
    display: flex;
    gap: 0.15rem;
}

.star-filled {
    color: var(--accent);
}

.star-empty {
    color: var(--border);
}

.btn-delete {
    display: flex;
    align-items: center;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 0.3rem 0.45rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.15s;
}

.btn-delete:hover {
    border-color: var(--red);
    color: var(--red);
}
</style>