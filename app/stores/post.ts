import type { ApiArticle, ApiArticleStats, ApiResponse } from '~/types'

export interface ArticleDisplay extends ApiArticle {
  created_at_display?: {
    year: string
    month: string
    day: string
  }
  updated_at_display?: {
    year: string
    month: string
    day: string
  }
}

export const usePostStore = defineStore('post', () => {
  const stats = ref<ApiArticleStats>()
  async function fetchStats() {
    // 避免在客户端重复请求已经通过 SSR 获取到的数据
    if (stats.value && Object.keys(stats.value).length > 0) return stats

    // 在 Action 内部安全地获取 Nuxt 实例
    const { $api } = useNuxtApp()

    try {
      const res = await $api<ApiResponse<ApiArticleStats>>('articles/stats')
      if (res?.data) {
        stats.value = res.data
        return stats
      }
    } catch (error) {
      console.error('加载文章聚合状态失败:', error)
    }
    return null
  }
  return { stats, fetchStats }
})
