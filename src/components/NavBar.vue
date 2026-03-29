<template>
    <header class="navbar">
        <div class="navbar-inner">
            <RouterLink to="/dashboard" class="nav-brand">
                <span class="brand-dot"></span>
                <span class="brand-name">RecipeSearcher</span>
            </RouterLink>

            <div class="nav-center">
                <RouterLink to="/bookmarks" class="nav-link" :class="{ active: route.path === '/bookmarks' }">
                    Bookmarks
                </RouterLink>
            </div>

            <div class="nav-right">
                <div class="nav-user">
                    <span class="user-indicator"></span>
                    <span class="user-email">{{ auth.userEmail }}</span>
                </div>
                <button @click="handleLogout" class="btn-logout">
                    <span>Sign out</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </button>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { authService } from '../services/auth'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

function handleLogout() {
    authService.logout()
    auth.clearAuth()
    router.push('/login')
}
</script>

<style scoped>
.navbar {
    position: sticky;
    top: 0;
    z-index: 50;
    background: rgba(17, 17, 19, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
}

.navbar-inner {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 2rem;
    height: 56px;
    display: flex;
    align-items: center;
    gap: 2rem;
}

.nav-brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 900;
    font-size: 1rem;
    letter-spacing: -0.02em;
    flex-shrink: 0;
}

.brand-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 10px var(--accent-glow);
}

.brand-name {
    color: var(--text);
}

.nav-center {
    flex: 1;
}

.nav-link {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-muted);
    padding: 0.3rem 0.6rem;
    border-radius: var(--radius-sm);
    transition: color 0.15s;
}

.nav-link:hover,
.nav-link.active {
    color: var(--text);
}

.nav-link.active {
    background: var(--surface2);
}

.nav-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-left: auto;
}

.nav-user {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 0.35rem 0.75rem;
    border-radius: var(--radius-sm);
}

.user-indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 8px var(--green-dim);
}

.user-email {
    font-family: var(--mono);
    font-size: 0.72rem;
    color: var(--text-muted);
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.btn-logout {
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
}

.btn-logout:hover {
    border-color: var(--red);
    color: var(--red);
}
</style>