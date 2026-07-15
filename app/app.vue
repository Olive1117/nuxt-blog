<template>
  <div class="main">
    <NuxtLayout>
      <NuxtPage :keepalive />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
  import type { ApiArticleStats, ApiResponse } from './types'
  import 'katex/dist/katex.min.css'

  const keepalive = {
    include: ['archive', 'home'],
  }
</script>

<style>
  html.dark .shiki span {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }
</style>
