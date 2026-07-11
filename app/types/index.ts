export * from './base'
export * from './api'

export interface ArticleTree {
  [year: string]: {
    [month: string]: {
      [day: string]: ArticleDisplay[]
    }
  }
}

export interface ArticleTreeStats {
  year: string
  month?: string
  day?: string
  total: number
}
