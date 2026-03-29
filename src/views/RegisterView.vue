<template>
    <div class="auth-page">
        <div class="auth-left">
            <div class="auth-left-content">
                <div class="hero-badge">Create your account</div>
                <h1 class="hero-title">Start building your<br /><em>recipe collection</em></h1>
                <p class="hero-sub">Join to search thousands of dishes, organise them into folders, and get
                    personalised recommendations powered by machine learning.</p>
                <div class="steps">
                    <div class="step">
                        <span class="step-num">01</span>
                        <span>Create your account</span>
                    </div>
                    <div class="step">
                        <span class="step-num">02</span>
                        <span>Search and explore recipes</span>
                    </div>
                    <div class="step">
                        <span class="step-num">03</span>
                        <span>Bookmark dishes & get recommendations</span>
                    </div>
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
                    <h2>Create account</h2>
                    <p>Set up your recipe workspace in seconds</p>
                </div>

                <div class="auth-form">
                    <div class="field">
                        <label>Username</label>
                        <input v-model="username" type="text" placeholder="e.g. jamie_cooks"
                            @keydown.enter="handleRegister" autocomplete="username" />
                    </div>

                    <div class="field">
                        <label>Email address</label>
                        <input v-model="email" type="email" placeholder="you@cmu.ac.th" @keydown.enter="handleRegister"
                            autocomplete="email" />
                    </div>

                    <div class="field">
                        <label>Password</label>
                        <input v-model="password" type="password" placeholder="Min. 8 characters"
                            @keydown.enter="handleRegister" autocomplete="new-password" />
                        <div class="password-strength" v-if="password.length > 0">
                            <div class="strength-bar" :class="strengthClass" :style="{ width: strengthWidth }"></div>
                        </div>
                    </div>

                    <div v-if="error" class="error-msg">{{ error }}</div>
                    <div v-if="success" class="success-msg">
                        ✓ Account created! Redirecting to sign in…
                    </div>

                    <button @click="handleRegister" :disabled="loading || !username || !email || password.length < 6"
                        class="btn-primary btn-full">
                        <span v-if="loading" class="spinner"></span>
                        {{ loading ? 'Creating account…' : 'Create account' }}
                    </button>
                </div>

                <p class="auth-switch">
                    Already have an account?
                    <RouterLink to="/login">Sign in</RouterLink>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth'

const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const strengthClass = computed(() => {
    if (password.value.length < 6) return 'weak'
    if (password.value.length < 10) return 'medium'
    return 'strong'
})

const strengthWidth = computed(() => {
    if (password.value.length < 6) return '33%'
    if (password.value.length < 10) return '66%'
    return '100%'
})

async function handleRegister() {
    if (!username.value || !email.value || password.value.length < 6) return

    loading.value = true
    error.value = ''

    try {
        await authService.register({
            username: username.value,
            email: email.value,
            password: password.value
        })
        success.value = true
        setTimeout(() => router.push('/login'), 1500)
    } catch (e: any) {
        error.value = e.response?.data?.detail ?? 'Registration failed. Please try again.'
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
    background: radial-gradient(ellipse 60% 50% at 70% 40%, rgba(245, 166, 35, 0.07), transparent);
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
    color: var(--green);
    background: var(--green-dim);
    border: 1px solid rgba(74, 222, 128, 0.25);
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

.steps {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
}

.step {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.875rem;
    color: var(--text-muted);
}

.step-num {
    font-family: var(--mono);
    font-size: 0.7rem;
    color: var(--accent);
    background: var(--accent-dim);
    border: 1px solid rgba(245, 166, 35, 0.2);
    width: 28px;
    height: 28px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

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

.password-strength {
    height: 3px;
    background: var(--border);
    border-radius: 999px;
    overflow: hidden;
    margin-top: 0.35rem;
}

.strength-bar {
    height: 100%;
    border-radius: 999px;
    transition: width 0.3s, background-color 0.3s;
}

.weak {
    background: var(--red);
}

.medium {
    background: var(--accent);
}

.strong {
    background: var(--green);
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

.success-msg {
    font-family: var(--mono);
    font-size: 0.75rem;
    color: var(--green);
    background: var(--green-dim);
    border: 1px solid rgba(74, 222, 128, 0.2);
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-sm);
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