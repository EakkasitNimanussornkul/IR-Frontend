<template>
    <div class="search-box">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input v-model="query" type="text" placeholder="e.g. pasta with chicken, or garlic butter..."
            @keydown.enter="handleSearch" class="search-input" />
        <button class="btn-search" :disabled="!query.trim()" @click="handleSearch">
            Search
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const query = ref('')

function handleSearch() {
    if (!query.value.trim()) return
    router.push({ path: '/search', query: { q: query.value.trim() } })
}
</script>

<style scoped>
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

.search-box:focus-within {
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
</style>