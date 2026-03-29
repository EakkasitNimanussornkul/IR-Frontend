<template>
  <div class="app-shell">
    <NavBar v-if="auth.isLoggedIn" />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/navbar.vue';
import { useAuthStore } from './stores/auth';

const auth = useAuthStore()
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Cabinet+Grotesk:wght@400;500;700;800;900&display=swap');

:root {
  --bg: #111113;
  --bg2: #17171a;
  --surface: #1e1e22;
  --surface2: #25252a;
  --border: #2e2e34;
  --border-hover: #45454e;
  --text: #eeeef0;
  --text-muted: #6b6b78;
  --text-dim: #3d3d45;
  --accent: #f5a623;
  --accent-dim: rgba(245, 166, 35, 0.1);
  --accent-glow: rgba(245, 166, 35, 0.25);
  --green: #4ade80;
  --green-dim: rgba(74, 222, 128, 0.1);
  --red: #f87171;
  --red-dim: rgba(248, 113, 113, 0.1);
  --blue: #60a5fa;
  --blue-dim: rgba(96, 165, 250, 0.1);
  --radius-sm: 6px;
  --radius: 10px;
  --radius-lg: 16px;
  --mono: 'IBM Plex Mono', monospace;
  --sans: 'Cabinet Grotesk', sans-serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
  min-height: 100vh;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
  background-size: 32px 32px;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
  font-family: var(--sans);
}

input,
textarea {
  font-family: var(--sans);
}

.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}

/* Shared utility classes */
.page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: var(--accent);
  color: #111113;
  border: none;
  padding: 0.65rem 1.4rem;
  border-radius: var(--radius-sm);
  font-family: var(--sans);
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.15s;
  white-space: nowrap;
}

.btn-primary:hover:not(:disabled) {
  background: #f7b84a;
  box-shadow: 0 0 20px var(--accent-glow);
}

.btn-primary:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
  padding: 0.65rem 1.4rem;
  border-radius: var(--radius-sm);
  font-family: var(--sans);
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.15s;
}

.btn-ghost:hover {
  border-color: var(--border-hover);
  color: var(--text);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.field label {
  font-family: var(--mono);
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.field input,
.field textarea {
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.7rem 0.9rem;
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
  width: 100%;
}

.field input:focus,
.field textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-dim);
}

.field input::placeholder,
.field textarea::placeholder {
  color: var(--text-dim);
}

.error-msg {
  font-family: var(--mono);
  font-size: 0.75rem;
  color: var(--red);
  background: var(--red-dim);
  border: 1px solid rgba(248, 113, 113, 0.2);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
}
</style>