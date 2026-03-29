<template>
    <Teleport to="body">
        <div class="overlay" @click.self="emit('close')">
            <div class="popup">
                <div class="popup-header">
                    <h2>Save to folder</h2>
                    <p class="popup-sub">{{ recipe.name }}</p>
                    <button class="btn-close" @click="emit('close')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div class="popup-body">
                    <!-- No folders state -->
                    <div v-if="folders.length === 0" class="no-folders">
                        <p>You don't have any folders yet.</p>
                        <RouterLink to="/bookmarks" @click="emit('close')" class="btn-go-bookmarks">
                            Create a folder first
                        </RouterLink>
                    </div>

                    <template v-else>
                        <!-- Folder picker -->
                        <div class="field">
                            <label>Choose folder</label>
                            <div class="folder-options">
                                <button v-for="folder in folders" :key="folder.id" class="folder-option"
                                    :class="{ active: selectedFolderId === folder.id }"
                                    @click="selectedFolderId = folder.id">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path
                                            d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                    </svg>
                                    {{ folder.name }}
                                </button>
                            </div>
                        </div>

                        <!-- Star rating -->
                        <div class="field">
                            <label>Your rating</label>
                            <div class="stars">
                                <button v-for="n in 5" :key="n" class="star" :class="{ filled: n <= rating }"
                                    @click="rating = n">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon
                                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div v-if="error" class="error-msg">{{ error }}</div>

                        <button class="btn-save" :disabled="!selectedFolderId || rating === 0 || loading"
                            @click="handleSave">
                            <span v-if="loading" class="spinner"></span>
                            {{ loading ? 'Saving…' : 'Save recipe' }}
                        </button>
                    </template>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import api from '../services/api';
import type { Folder, RecipeCard } from '../types/index';

const props = defineProps<{
    recipe: RecipeCard
}>()

const emit = defineEmits<{
    close: []
    saved: []
}>()

const folders = ref<Folder[]>([])
const selectedFolderId = ref<number | null>(null)
const rating = ref(0)
const loading = ref(false)
const error = ref('')

async function fetchFolders() {
    try {
        const res = await api.get('/folders/')
        folders.value = res.data ?? []
        if (folders.value.length > 0) selectedFolderId.value = folders.value[0].id
    } catch {
        folders.value = []
    }
}

async function handleSave() {
    if (!selectedFolderId.value || rating.value === 0) return
    loading.value = true
    error.value = ''
    try {
        console.log('Saving bookmark with recipe_id:', props.recipe.recipe_id, 'folder_id:', selectedFolderId.value, 'rating:', rating.value)
        await api.post('/bookmarks/', {
            recipe_id: String(props.recipe.recipe_id),
            folder_id: selectedFolderId.value,
            rating: rating.value
        })
        emit('saved')
        emit('close')
    } catch (e: any) {
        error.value = e.response?.data?.detail ?? 'Failed to save. Please try again.'
    } finally {
        loading.value = false
    }
}

onMounted(fetchFolders)
</script>

<style scoped>
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
    max-width: 420px;
    overflow: hidden;
}

.popup-header {
    padding: 1.5rem 1.5rem 1rem;
    border-bottom: 1px solid var(--border);
    position: relative;
}

.popup-header h2 {
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text);
    margin-bottom: 0.2rem;
}

.popup-sub {
    font-size: 0.8rem;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 2rem;
}

.btn-close {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
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
    gap: 1.25rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.field label {
    font-size: 0.78rem;
    color: var(--text-muted);
    font-weight: 500;
}

.folder-options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.folder-option {
    display: flex;
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

.folder-option:hover {
    color: var(--text);
    border-color: var(--text-muted);
}

.folder-option.active {
    background: var(--accent-dim);
    border-color: rgba(245, 166, 35, 0.4);
    color: var(--accent);
}

.stars {
    display: flex;
    gap: 0.25rem;
}

.star {
    background: transparent;
    border: none;
    color: var(--border);
    cursor: pointer;
    padding: 0;
    transition: color 0.1s, transform 0.1s;
    line-height: 1;
}

.star:hover,
.star.filled {
    color: var(--accent);
}

.star:hover {
    transform: scale(1.15);
}

.btn-save {
    width: 100%;
    padding: 0.7rem;
    background: var(--accent);
    color: #111;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn-save:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.no-folders {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
    text-align: center;
}

.no-folders p {
    font-size: 0.875rem;
    color: var(--text-muted);
}

.btn-go-bookmarks {
    background: var(--accent);
    color: #111;
    border: none;
    padding: 0.6rem 1.25rem;
    border-radius: var(--radius-sm);
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
}

.spinner {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid rgba(17, 17, 19, 0.3);
    border-top-color: #111;
    animation: spin 0.6s linear infinite;
    display: inline-block;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>