import type { ApiResponse, PageResponse } from '~/types'

export interface FetchOptions {
  /** 每页条数 */
  pageSize?: number
  /** 并发数（混合策略用） */
  concurrency?: number
  /** 页间延迟 ms（串行策略用） */
  delay?: number
}

export async function fetchAllSequential<T = unknown>(
  url: string,
  opt?: FetchOptions
): Promise<T[]> {
  const { $api } = useNuxtApp()
  const pageSize = opt?.pageSize ?? 50
  const delay = opt?.delay ?? 0

  let firstPage: ApiResponse<PageResponse<T>>
  try {
    firstPage = await $api<ApiResponse<PageResponse<T>>>(url, {
      query: { page: 1, page_size: pageSize },
    })
  } catch (err) {
    throw new Error(`第1页加载失败: ${err instanceof Error ? err.message : String(err)}`, {
      cause: err,
    })
  }

  const totalPage = Math.ceil(firstPage.data.total / firstPage.data.page_size)
  const allData: T[] = [...firstPage.data.list]

  if (totalPage < 1) {
    return allData
  }

  for (let page = 2; page <= totalPage; page++) {
    try {
      const res = await $api<ApiResponse<PageResponse<T>>>(url, {
        query: { page, page_size: pageSize },
      })
      allData.push(...res.data.list)
    } catch (err) {
      throw new Error(`第 ${page} 页加载失败`, { cause: err })
    }
    if (delay > 0 && page < totalPage) {
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  return allData
}

export async function fetchAllParallel<T = unknown>(url: string, opt?: FetchOptions): Promise<T[]> {
  const { $api } = useNuxtApp()
  const pageSize = opt?.pageSize ?? 50
  const concurrency = opt?.concurrency ?? 3

  let firstPage: ApiResponse<PageResponse<T>>
  try {
    firstPage = await $api<ApiResponse<PageResponse<T>>>(url, {
      query: { page: 1, page_size: pageSize },
    })
  } catch (err) {
    throw new Error(`第1页加载失败: ${err instanceof Error ? err.message : String(err)}`, {
      cause: err,
    })
  }

  const totalPage = Math.ceil(firstPage.data.total / firstPage.data.page_size)
  const results: ApiResponse<PageResponse<T>>[] = []
  results[1] = firstPage

  if (totalPage <= 1) return firstPage.data.list

  const pageQueue: number[] = []
  for (let page = 2; page <= totalPage; page++) {
    pageQueue.push(page)
  }
  const worker = async () => {
    while (pageQueue.length > 0) {
      const page = pageQueue.shift()
      if (!page) break
      try {
        const res = await $api<ApiResponse<PageResponse<T>>>(url, {
          query: { page, page_size: pageSize },
        })
        results[page] = res
      } catch (err) {
        throw new Error(
          `第 ${page} 页并行加载失败: ${err instanceof Error ? err.message : String(err)}`,
          { cause: err }
        )
      }
    }
  }

  const work: Promise<void>[] = []
  const activeCount = Math.min(concurrency, pageQueue.length)
  for (let i = 0; i < activeCount; i++) {
    work.push(worker())
  }
  await Promise.all(work)

  const allData: T[] = []
  for (let page = 1; page <= totalPage; page++) {
    const pageResult = results[page]
    if (pageResult) {
      allData.push(...pageResult.data.list)
    }
  }

  return allData
}
