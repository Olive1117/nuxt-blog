<template>
  <div class="relative flex flex-col z-0 text-primary">
    <PageHeader
      class="px-[12vw]"
      :stats="{
        文章: post_stats.total ?? 0,
      }"
    />
    <div class="relative px-[12vw] flex flex-col">
      <div class="flex flex-col md:flex-row-reverse gap-8 md:gap-16">
        <div class="flex flex-col gap-8 w-full md:w-[20vw] min-w-24 py-16">
          <div class="flex flex-col gap-2">
            <Label
              class="text-xl"
              for="cate"
            >
              分类
            </Label>
            <ToggleGroup.Root
              id="cate"
              v-model="query_category"
              class="flex flex-wrap gap-2"
              default-value=""
            >
              <template
                v-for="(count_cate, cat) in categorylist"
                :key="cat"
              >
                <ToggleGroup.Item
                  class="relative overflow-hidden border-b border-primary rounded px-1 flex items-center"
                  :value="cat"
                >
                  <Icon
                    :class="[
                      cat === query_category ? 'translate-y-0' : '-translate-y-4',
                      'absolute top-0 left-0 text-accent transition-[translate] duration-400',
                    ]"
                    name="tabler:bookmark"
                  />
                  <div
                    :class="[
                      cat === query_category ? 'w-4' : 'w-0',
                      'transition-[width] duration-400',
                    ]"
                  ></div>
                  {{ cat || '全部' }}&nbsp;{{ count_cate }}
                </ToggleGroup.Item>
              </template>
            </ToggleGroup.Root>
          </div>
          <div class="flex flex-col gap-2">
            <Label
              class="text-xl"
              for="tag"
            >
              标签
            </Label>
            <Combobox.Root
              id="tag"
              v-model="query_tag"
              class="relative flex flex-col min-w-0 group"
              multiple
              open
            >
              <Combobox.Anchor>
                <Combobox.Input
                  class="focus:outline-none border-b w-full"
                  placeholder="+按标签浏览"
                />
              </Combobox.Anchor>
              <Combobox.Content class="flex flex-row! flex-wrap gap-2 w-full top-full mt-2 z-10">
                <Combobox.Empty>暂时没有此标签哦</Combobox.Empty>
                <Combobox.Item
                  v-for="(_, tag) in tagList"
                  :key="tag"
                  class="relative text-nowrap flex items-center select-none border-b border-primary rounded px-1 group-focus-within:data-highlighted:bg-accent group-focus-within:data-highlighted:text-white"
                  :value="tag"
                >
                  <Combobox.ItemIndicator
                    class="absolute left-0 inline-flex items-center justify-center animate-scale-in"
                  >
                    <Icon name="tabler:check" />
                  </Combobox.ItemIndicator>
                  <div
                    :class="[
                      query_tag.includes(tag) ? 'w-3' : 'w-0',
                      'transition-[width] duration-400',
                    ]"
                  ></div>
                  {{ tag }}
                </Combobox.Item>
              </Combobox.Content>
            </Combobox.Root>
          </div>
        </div>
        <!-- 文章列表栏 -->
        <ul class="flex flex-col flex-1">
          <li
            v-for="articles in post_list"
            :key="articles.short_id"
            class="relative border-t border-olive-400/70 last:border-b first:border-none"
          >
            <div class="relative z-0 h-full w-full">
              <div class="p-4 flex gap-8">
                <!-- 左侧创建时间 -->
                <div class="flex flex-col items-center justify-between gap-2">
                  <div class="flex flex-col items-center justify-start gap-1">
                    <NuxtTime
                      class="text-sm font-medium text-nowrap text-accent"
                      date-style="short"
                      :datetime="new Date(articles.created_at)"
                    />
                    <div
                      class="flex items-center text-nowrap text-[11px] font-medium text-secondary"
                    >
                      编辑于
                      <NuxtTime
                        class=""
                        :datetime="new Date(articles.updated_at).getTime()"
                        relative
                      />
                    </div>
                  </div>
                  <Icon
                    class="text-lg text-[#e3769b]"
                    name="tabler:clock"
                  />
                </div>
                <!-- 右侧文章详情 -->
                <div class="flex justify-between items-end w-full">
                  <div class="flex flex-col items-start gap-2">
                    <NuxtLink
                      class="text-xl font-semibold tracking-tight"
                      :to="`/post/${articles.short_id}`"
                      >{{ articles.title }}
                      <span class="absolute inset-0 z-0"></span>
                    </NuxtLink>
                    <div
                      class="text-[13px] flex gap-3 whitespace-nowrap flex-wrap z-10 text-secondary"
                    >
                      <span class="flex items-center">
                        <Icon
                          class="text-base text-[#e3769b]"
                          name="tabler:mist"
                        />
                        <span class="px-1.5"> {{ articles.word_count }}字 </span>
                      </span>
                      <span class="flex items-center">
                        <Icon
                          class="text-base text-[#e3769b]"
                          name="tabler:category"
                        />
                        <Switch.Root
                          v-model="query_category"
                          class="px-1.5 data-[state=checked]:text-[#e3769b]"
                          false-value=""
                          :true-value="articles.category"
                          @click.prevent.stop
                          >{{ articles.category }}</Switch.Root
                        >
                      </span>
                      <span class="flex items-center flex-wrap">
                        <Icon
                          class="text-base text-[#e3769b]"
                          name="tabler:tag"
                        />
                        <ToggleGroup.Root
                          v-model="query_tag"
                          class="flex items-center"
                        >
                          <ToggleGroup.Item
                            v-for="tag in articles.tags"
                            :key="tag"
                            class="border-r border-olive-600 last:border-none px-1.5 data-[state=on]:text-[#e3769b]"
                            :value="tag"
                            @click.prevent.stop
                            >{{ tag }}
                          </ToggleGroup.Item>
                        </ToggleGroup.Root>
                      </span>
                    </div>
                    <p class="text-sm text-primary font-normal max-w-sm leading-relaxed">
                      {{ articles.desc }}
                    </p>
                  </div>
                </div>
              </div>
              <span
                class="absolute right-0 bottom-4 text-[11px] tracking-wider text-[#e3769b] whitespace-nowrap z-10"
              >
                开始阅读 ->
              </span>
            </div>
          </li>
        </ul>
      </div>
      <div class="sticky bottom-8 flex justify-center">
        <Pagination.Root
          v-model="query_page"
          class="inline-block p-2 rounded-xl bg-white/30 backdrop-blur-sm"
          :items-per-page="page_size"
          :sibling-count="4"
          :total="post_list_total"
        >
          <Pagination.List
            v-slot="{ items }"
            class="flex items-center gap-1 text-stone-700 dark:text-white"
          >
            <Pagination.First
              class="w-8 h-8 flex items-center justify-center bg-transparent hover:bg-white dark:hover:bg-stone-700/70 transition disabled:opacity-50 rounded-lg"
            >
              <Icon name="tabler:chevrons-left" />
            </Pagination.First>
            <Pagination.Prev
              class="w-8 h-8 flex items-center justify-center bg-transparent hover:bg-white dark:hover:bg-stone-700/70 transition mr-4 disabled:opacity-50 rounded-lg"
            >
              <Icon name="tabler:chevron-left" />
            </Pagination.Prev>
            <template v-for="(page, index) in items">
              <Pagination.ListItem
                v-if="page.type === 'page'"
                :key="index"
                class="w-9 h-9 border dark:border-stone-800 rounded-xl text-zinc-800 data-selected:bg-white! data-selected:shadow-sm data-selected:text-blackA11 hover:bg-white dark:hover:bg-stone-700/70 transition"
                :value="page.value"
              />
              <Pagination.Ellipsis
                v-else
                :key="page.type"
                :index="index"
              >
                &#8230;
              </Pagination.Ellipsis>
            </template>
            <Pagination.Next
              class="w-8 h-8 flex items-center justify-center bg-transparent hover:bg-white dark:hover:bg-stone-700/70 transition ml-4 disabled:opacity-50 rounded-lg"
            >
              <Icon name="tabler:chevron-right" />
            </Pagination.Next>
            <Pagination.Last
              class="w-8 h-8 flex items-center justify-center bg-transparent hover:bg-white dark:hover:bg-stone-700/70 transition disabled:opacity-50 rounded-lg"
            >
              <Icon name="tabler:chevrons-right" />
            </Pagination.Last>
          </Pagination.List>
        </Pagination.Root>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Combobox, Label, Pagination, Switch, ToggleGroup } from 'reka-ui/namespaced'
  import type { ApiArticleStats, ApiResponse, PageResponse } from '~/types'
  definePageMeta({
    title: '文章列表',
    name: 'list',
  })
  const { fetchStats } = usePostStore()
  const post_stats_res = await fetchStats()
  const post_stats = computed(() => {
    return post_stats_res?.value ?? ({} as ApiArticleStats)
  })

  const query_category = useRouteQuery('category', '', { transform: String })
  const categorylist = computed<Record<string, number>>(() => {
    if (post_stats.value) {
      return {
        '': post_stats.value.total,
        ...post_stats.value.total_by_category,
      }
    }
    return { '': 0 }
  })

  const query_tag = useRouteQuery<string, string[]>('tags', '', {
    transform: {
      get: (v) => (v ? v.split(',') : []),
      set: (v) => v.join(','),
    },
  })
  const tagList = computed(() => {
    return post_stats.value.total_by_tag || {}
  })

  const query_page = useRouteQuery('page', 1, { transform: Number })
  const res_posts = await useAPI<ApiResponse<PageResponse<ArticleDisplay>>>('articles', {
    query: { query_page, tags: query_tag, category: query_category },
    transform: (res) => {
      res.data.list = res.data.list.map((a) => {
        return formatArticle(a)
      })
      return res
    },
    watch: false,
  })
  watch([query_page, query_tag, query_category], () => {
    res_posts.refresh()
  })
  const page_size = computed<number>(() => res_posts.data.value?.data.page_size ?? 10)
  const post_list_total = computed<number>(() => res_posts.data.value?.data.total ?? 0)
  const post_list = computed(() => res_posts.data.value?.data.list ?? [])
</script>
