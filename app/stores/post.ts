import type { ApiArticle } from '~/types'

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
  // const config = useRuntimeConfig()
  // State
  // const { data } = useAsyncData('posts:all', () => {
  //   return fetchAllParallel<ArticleDisplay>(`${config.apiServerBase}/articles`)
  // })
  // const posts_all = ref<ArticleDisplay[]>(data.value ?? [])
  // console.log('加载poast_all', posts_all)

  // Getters

  // Actions

  return {}
})
