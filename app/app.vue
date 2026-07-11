<template>
  <div class="main">
    <NuxtLayout>
      <NuxtPage :keepalive />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
  import type { ApiArticleStats, ApiResponse } from './types'

  const keepalive = {
    include: ['archive', 'home'],
  }
  const res_post_stats = await useAPI<ApiResponse<ApiArticleStats>>('articles/stats')
  useState<ApiArticleStats>(
    'post:stats',
    () => res_post_stats.data.value?.data ?? ({} as ApiArticleStats)
  )
</script>
