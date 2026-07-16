<template>
  <div>
    <PageHeader
      class="px-[12vw]"
      desc="收好那些散落的碎片，还有漫长岁月里不该被遗忘的名字。"
      label="article&nbsp;/&nbsp;index"
      :stats="{
        文章总数: post_stats.total,
      }"
      title="归档"
    />
    <Listbox.Root
      class="px-[12vw] py-12"
      multiple
    >
      <!-- <Listbox.Filter>你好</Listbox.Filter> -->
      <Listbox.Content>
        <Listbox.Group
          v-for="(groupedMonth, year) in allArticle"
          :key="year"
        >
          <Listbox.GroupLabel class="block text-xl font-bold text-primary pt-6 pb-2">
            {{ year }}年·{{ getArticleTreeStats(allArticle, year).total }}篇
          </Listbox.GroupLabel>
          <Listbox.Group
            v-for="(groupedDay, month) in groupedMonth"
            :key="month"
            class="flex flex-col"
          >
            <Listbox.GroupLabel class="block text-lg font-semibold text-primary pt-3 pb-1 pl-2">
              {{ month }}月·{{ getArticleTreeStats(allArticle, year, month).total }}篇
            </Listbox.GroupLabel>
            <template
              v-for="(groupedArticle, day) in groupedDay"
              :key="day"
            >
              <Listbox.Item
                v-for="art in groupedArticle"
                class="p-0.5"
                :key="art.short_id"
                :value="art.short_id"
              >
                <div class="flex items-center gap-4 h-6 px-2 whitespace-nowrap w-full">
                  <!-- 时间 -->
                  <NuxtTime
                    class="text-sm font-bold font-mono text-secondary tracking-tighter"
                    :datetime="art.created_at"
                    day="2-digit"
                    month="2-digit"
                  />
                  <div class="flex flex-1 items-center justify-between">
                    <!-- 分类 -->
                    <span class="flex items-center text-[#e3769b]">
                      <NuxtLink
                        class="text-sm font-normal font-mono cursor-pointer"
                        :to="{ name: 'list', query: { category: art.category } }"
                      >
                        {{ art.category }}
                      </NuxtLink>
                    </span>
                    <div class="mx-2 w-px self-stretch"></div>
                    <!-- 标题标签 -->
                    <span class="flex flex-4 justify-between">
                      <!-- 标题 -->
                      <NuxtLink
                        class="text-lg w-full font-medium font-serif text-primary hover:text-[#e3769b] transition-colors duration-200"
                        :to="{ name: 'post', params: { id: art.short_id } }"
                      >
                        {{ art.title }}
                      </NuxtLink>
                      <!-- 标签 -->
                      <span class="flex items-center text-secondary">
                        <Icon
                          class="text-base text-[#e3769b]/80"
                          name="tabler:tag"
                        />
                        <NuxtLink
                          v-for="(tag, index) in art.tags"
                          :key="index"
                          class="flex items-center px-1 text-xs font-mono text-secondary hover:text-[#e3769b] cursor-pointer transition-colors"
                          :to="{ name: 'list', query: { tags: tag } }"
                          >{{ tag }}
                        </NuxtLink>
                      </span>
                    </span>
                  </div>
                </div>
              </Listbox.Item>
            </template>
          </Listbox.Group>
        </Listbox.Group>
      </Listbox.Content>
    </Listbox.Root>
  </div>
</template>

<script setup lang="ts">
  import { Listbox } from 'reka-ui/namespaced'
  import type { ApiArticle, ApiArticleStats, ArticleTree } from '~/types'
  useHead({ title: '文章列表' })
  definePageMeta({
    title: '归档页',
    name: 'archive',
  })
  const { data } = await useAsyncData('posts:all', async () => {
    const result: ArticleTree = {}

    try {
      const articles = await fetchAllParallel<ApiArticle>('articles', {
        pageSize: 2,
      })
      articles.forEach((article) => {
        const [year = '0000', month = '00', day = '00'] = useDateFormat(
          article.created_at,
          'YYYY-MM-DD'
        ).value.split('-')
        // 初始化层级
        if (!result[year]) {
          result[year] = {}
        }
        if (!result[year][month]) {
          result[year][month] = {}
        }
        if (!result[year][month][day]) {
          result[year][month][day] = []
        }

        result[year][month][day].push(article)
      })
      return result
    } catch (err) {
      console.log(err)
    }
  })
  const { fetchStats } = usePostStore()
  const post_stats_res = await fetchStats()
  const post_stats = computed(() => {
    return post_stats_res?.value ?? ({} as ApiArticleStats)
  })
  const allArticle = computed(() => data.value ?? {})
  console.log(allArticle.value)
</script>
