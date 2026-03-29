<template>
    <div class="auth-page">
        <div class="auth-left">
            <div class="auth-left-content">
                <div class="hero-badge">SE481 · Information Retrieval</div>
                <h1 class="hero-title">Your personal recipe <em>library</em></h1>
                <p class="hero-sub">Search thousands of dishes by name, ingredient, or cooking method. Bookmark
                    favourites into folders and get ML-powered recommendations.</p>
                <div class="hero-tags">
                    <span class="tag tag-search">Smart search</span>
                    <span class="tag tag-folder">Folders</span>
                    <span class="tag tag-recommend">Recommendations</span>
                </div>
            </div>
        </div>

        <div class="auth-right">
            <div class="auth-card" :class="{ 'card-loading': loading }">
                <div class="card-header">
                    <div class="card-logo">
                        <span class="brand-dot-lg"></span>
                        RecipeSearcher
                    </div>
                    <h2>Sign in</h2>
                    <p>Welcome back to your recipe workspace</p>
                </div>

                <div class="auth-form">
                    <div class="field">
                        <label>Email address</label>
                        <input v-model="email" type="email" placeholder="you@cmu.ac.th" @keydown.enter="handleLogin"
                            autocomplete="email" />
                    </div>
                    <div class="field">
                        <label>Password</label>
                        <input v-model="password" type="password" placeholder="••••••••" @keydown.enter="handleLogin"
                            autocomplete="current-password" />
                    </div>

                    <div v-if="error" class="error-msg">{{ error }}</div>

                    <button @click="handleLogin" :disabled="loading || !email || !password"
                        class="btn-primary btn-full">
                        <span v-if="loading" class="spinner"></span>
                        {{ loading ? 'Signing in…' : 'Sign in' }}
                    </button>
                </div>

                <p class="auth-switch">
                    Don't have an account?
                    <RouterLink to="/register">Create one</RouterLink>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
    if (!email.value || !password.value) return
    loading.value = true
    error.value = ''
    try {
        const res = await authService.login(email.value, password.value)
        auth.setAuth(res.data.access_token, email.value)
        router.push('/dashboard')
    } catch (e: any) {
        error.value = e.response?.data?.detail ?? 'Invalid credentials. Please try again.'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.auth-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
}

/* LEFT PANEL */
.auth-left {
    background: var(--bg2);
    border-right: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 3rem;
    position: relative;
    overflow: hidden;
}

.auth-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 50% at 30% 60%, rgba(245, 166, 35, 0.07), transparent);
    pointer-events: none;
}

.auth-left-content {
    position: relative;
    max-width: 380px;
}

.hero-badge {
    display: inline-block;
    font-family: var(--mono);
    font-size: 0.7rem;
    color: var(--accent);
    background: var(--accent-dim);
    border: 1px solid rgba(245, 166, 35, 0.25);
    padding: 0.3rem 0.75rem;
    border-radius: 999px;
    margin-bottom: 1.75rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.hero-title {
    font-size: 2.6rem;
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: -0.04em;
    color: var(--text);
    margin-bottom: 1.25rem;
}

.hero-title em {
    color: var(--accent);
    font-style: normal;
}

.hero-sub {
    font-size: 0.95rem;
    color: var(--text-muted);
    line-height: 1.7;
    margin-bottom: 2rem;
}

.hero-tags {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
}

.tag {
    font-family: var(--mono);
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.35rem 0.85rem;
    border-radius: 999px;
    border: 1px solid;
}

.tag-search {
    color: lightblue;
    border: 1px solid rgba(35, 193, 245, 0.25);
}

.tag-recommend {
    color: #b91c1c;
    border: 1px solid rgba(163, 26, 26, 0.25);
}

.tag-folder {
    color: #cd5c1a;
    border: 1px solid rgba(205, 131, 28, 0.25);
}

/* RIGHT PANEL */
.auth-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.auth-card {
    width: 100%;
    max-width: 400px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 2.25rem;
    transition: opacity 0.2s;
}

.auth-card.card-loading {
    opacity: 0.7;
}

.card-header {
    margin-bottom: 2rem;
}

.card-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 900;
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 1.5rem;
}

.brand-dot-lg {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 12px var(--accent-glow);
}

.card-header h2 {
    font-size: 1.65rem;
    font-weight: 800;
    letter-spacing: -0.035em;
    margin-bottom: 0.3rem;
}

.card-header p {
    font-size: 0.875rem;
    color: var(--text-muted);
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.btn-full {
    width: 100%;
    margin-top: 0.25rem;
    padding: 0.75rem;
    font-size: 0.95rem;
}

.spinner {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid rgba(17, 17, 19, 0.3);
    border-top-color: #111113;
    animation: spin 0.6s linear infinite;
    display: inline-block;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.auth-switch {
    text-align: center;
    font-size: 0.85rem;
    color: var(--text-muted);
    padding-top: 1.25rem;
    border-top: 1px solid var(--border);
}

.auth-switch a {
    color: var(--accent);
    font-weight: 600;
    margin-left: 0.25rem;
}

.auth-switch a:hover {
    text-decoration: underline;
}

@media (max-width: 768px) {
    .auth-page {
        grid-template-columns: 1fr;
    }

    .auth-left {
        display: none;
    }
}
</style>