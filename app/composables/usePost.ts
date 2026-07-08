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

export const usePost = () => {
  const config = useRuntimeConfig()
  const posts_all = useAsyncData('posts:all', () => {
    fetchAllParallel<ArticleDisplay>(`${config.apiServerBase}/articles`)
  })
  // const posts_page = useState('posts:page', () => {})
  // const posts_detail = useState('posts:detail', () => {})
  return {
    posts_all,
  }
}
