import type { ArticleTree, ArticleTreeStats } from '~/types'

export default function (
  tree: ArticleTree,
  year: string,
  month?: string,
  day?: string
): ArticleTreeStats {
  const yearNode = tree[year]
  if (!yearNode) return { year, total: 0 }

  if (day !== undefined && month !== undefined) {
    return { year, month, day, total: yearNode[month]?.[day]?.length ?? 0 }
  }
  if (month !== undefined) {
    const days = yearNode[month] ?? {}
    const total = Object.values(days).reduce((sum, articles) => sum + articles.length, 0)
    return { year, month, total }
  }
  const total = Object.values(yearNode)
    .flatMap((m) => Object.values(m))
    .flat().length
  return { year, total }
}
