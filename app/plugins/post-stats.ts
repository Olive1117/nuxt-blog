import type { ApiArticleStats, ApiResponse } from '~/types'

export default defineNuxtPlugin(async () => {
  const res_post_stats = await useAPI<ApiResponse<ApiArticleStats>>('articles/stats')
  useState<ApiArticleStats>(
    'post:stats',
    () => res_post_stats.data.value?.data ?? ({} as ApiArticleStats)
  )
})
