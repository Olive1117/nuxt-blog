<template>
  <div class="relative py-16 flex flex-col gap-4 z-0">
    <PageHeader
      class="px-[10vw]"
      :stats="{ 文章总数: post_stats.data.value?.data.total ?? 0 }"
    />
    <div class="relative px-[10vw] flex flex-col gap-6 py-4">
      <ToggleGroup.Root
        v-model="query_category"
        class="flex flex-wrap gap-4"
        default-value=""
      >
        <template
          v-for="(count_cate, cat) in categorylist"
          :key="cat"
        >
          <ToggleGroup.Item
            class="relative overflow-hidden border-b border-zinc-700 rounded-xl px-3 py-1 flex items-center gap-1"
            :value="cat"
          >
            <Icon
              v-show="cat === query_category"
              class="absolute top-0 left-0"
              name="tabler:bookmark"
            />
            {{ cat || '全部' }}&nbsp;{{ count_cate }}
          </ToggleGroup.Item>
        </template>
      </ToggleGroup.Root>
      <div>
        <Combobox.Root
          v-model="query_tag"
          class="relative inline-block"
          multiple
          open-on-click
          open-on-focus
        >
          <Combobox.Anchor class="flex justify-between border rounded-xl p-2 w-xs">
            <TagsInput.Root
              v-model="query_tag"
              class="flex gap-2 flex-wrap"
            >
              <TagsInput.Item
                v-for="tag in query_tag"
                :key="tag"
                class="flex flex-nowrap text-nowrap items-center bg-zinc-950 text-white p-1 rounded"
                :value="tag"
              >
                <TagsInput.ItemText />
                <TagsInput.ItemDelete class="flex items-center justify-center">
                  <Icon name="tabler:x" />
                </TagsInput.ItemDelete>
              </TagsInput.Item>
              <Combobox.Input as-child>
                <TagsInput.Input
                  class="focus:outline-none border-b"
                  placeholder="+按标签浏览"
                />
              </Combobox.Input>
            </TagsInput.Root>
            <Combobox.Trigger><Icon name="tabler:chevron-down" /></Combobox.Trigger>
          </Combobox.Anchor>
          <Combobox.Content class="absolute bg-white w-full mt-2 border rounded shadow-xl z-10">
            <Combobox.Viewport>
              <Combobox.Empty>暂时没有此标签哦</Combobox.Empty>
              <Combobox.Item
                v-for="(_, tag) in tagList"
                :key="tag"
                class="relative flex items-center h-6.25 pr-8.75 pl-6.25 select-none data-highlighted:bg-zinc-950 data-highlighted:text-white"
                :value="tag"
              >
                <Combobox.ItemIndicator
                  class="absolute left-0 w-6.25 inline-flex items-center justify-center"
                >
                  <Icon name="tabler:check" />
                </Combobox.ItemIndicator>
                {{ tag }}
              </Combobox.Item>
            </Combobox.Viewport>
          </Combobox.Content>
        </Combobox.Root>
      </div>
      <!-- 文章列表栏 -->
      <ul class="flex flex-col tracking-[0.15rem]">
        <li
          v-for="articles in post_list"
          :key="articles.short_id"
          class="relative border-t border-olive-400/70 last:border-b"
        >
          <div class="relative z-0 h-full w-full">
            <div class="p-4 flex gap-8">
              <!-- 左侧创建时间 -->
              <div class="flex flex-col items-center justify-between gap-1">
                <div class="flex flex-col items-center justify-start gap-1">
                  <time
                    class="text-base text-[#e3769b]"
                    :datetime="
                      articles.created_at_display?.month + '-' + articles.created_at_display?.day
                    "
                    >{{ articles.created_at_display?.month }}.{{ articles.created_at_display?.day }}
                  </time>
                  <time
                    class="text-xs font-light"
                    :datetime="articles.created_at_display?.year"
                    >{{ articles.created_at_display?.year }}
                  </time>
                </div>
                <Icon
                  class="text-xl text-[#e3769b]"
                  name="tabler:clock"
                />
              </div>
              <!-- 右侧文章详情 -->
              <div class="flex justify-between items-end w-full">
                <div class="flex flex-col items-start gap-1">
                  <NuxtLink
                    class="text-2xl font-medium"
                    :to="`/post/${articles.short_id}`"
                    >{{ articles.title }}
                    <span
                      aria-hidden="true"
                      class="absolute inset-0 z-0"
                    ></span>
                  </NuxtLink>
                  <div class="text-xs flex gap-2 whitespace-nowrap flex-wrap z-10">
                    <span class="flex items-center">
                      <Icon
                        class="text-base text-[#e3769b]"
                        name="tabler:mist"
                      />
                      <span class="px-2">
                        <!-- 总字数&nbsp; -->
                        {{ articles.word_count }}字</span
                      >
                    </span>
                    <span class="flex items-center">
                      <Icon
                        class="text-base text-[#e3769b]"
                        name="tabler:books"
                      />
                      <Switch.Root
                        v-model="query_category"
                        class="px-2 data-[state=checked]:text-[#e3769b]"
                        false-value=""
                        :true-value="articles.category"
                        @click.prevent.stop
                        >{{ articles.category }}</Switch.Root
                      >
                    </span>
                    <span class="text-xs flex items-center flex-wrap">
                      <Icon
                        class="text-base text-[#e3769b]"
                        name="tabler:tag"
                      />
                      <ToggleGroup.Root v-model="query_tag">
                        <ToggleGroup.Item
                          v-for="tag in articles.tags"
                          :key="tag"
                          class="border-r border-olive-600 last:border-none px-2 data-[state=on]:text-[#e3769b]"
                          :value="tag"
                          @click.prevent.stop
                          >{{ tag }}
                        </ToggleGroup.Item>
                      </ToggleGroup.Root>
                    </span>
                  </div>
                  <p class="text-sm font-light">{{ articles.desc }}</p>
                </div>
                <!-- <div class="flex h-full">收藏</div> -->
              </div>
            </div>
            <span class="absolute right-0 bottom-4 text-xs text-[#e3769b] whitespace-nowrap z-10">
              开始阅读 ->
            </span>
          </div>
        </li>
      </ul>
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
                class="w-9 h-9 border dark:border-stone-800 rounded-xl data-selected:bg-white! data-selected:shadow-sm data-selected:text-blackA11 hover:bg-white dark:hover:bg-stone-700/70 transition"
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
  import { Combobox, Pagination, Switch, TagsInput, ToggleGroup } from 'reka-ui/namespaced'
  import type { ApiArticleStats, ApiResponse, PageResponse } from '~/types'

  const query_category = useRouteQuery('category', '', { transform: String })
  const categorylist = computed<Record<string, number>>(() => {
    if (post_stats.data.value) {
      return {
        '': post_stats.data.value.data.total,
        ...post_stats.data.value.data.total_by_category,
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
    return post_stats.data.value?.data?.total_by_tag || {}
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
  })
  const page_size = computed<number>(() => res_posts.data.value?.data.page_size ?? 10)
  const post_list_total = computed<number>(() => res_posts.data.value?.data.total ?? 0)
  const post_list = computed(() => res_posts.data.value?.data.list ?? [])
  console.log('总页数', post_list_total.value)

  const post_stats = await useAPI<ApiResponse<ApiArticleStats>>('articles/stats')
</script>
