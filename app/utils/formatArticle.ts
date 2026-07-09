import type { ApiArticle } from '~/types'

export default function (article: ApiArticle): ArticleDisplay {
  const [cyear, cmonth, cday] = useDateFormat(article.created_at, 'YYYY-MM-DD').value.split('-')
  const [uyear, umonth, uday] = useDateFormat(article.updated_at, 'YYYY-MM-DD').value.split('-')
  return {
    ...article,
    created_at_display: { year: cyear ?? '', month: cmonth ?? '', day: cday ?? '' },
    updated_at_display: { year: uyear ?? '', month: umonth ?? '', day: uday ?? '' },
  }
}
