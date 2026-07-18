<template>
  <div>
    <div class="relative">
      <PageHeader
        class="px-[12vw]"
        desc="收好那些散落的碎片，还有漫长岁月里不该被遗忘的名字。"
        label="article&nbsp;/&nbsp;index"
        :stats="{
          文章总数: post_stats.total,
        }"
        title="归档"
      />
      <div class="absolute right-[12vw] top-0 flex items-center justify-end gap-4">
        <button
          v-if="isEdit"
          class="text-sm text-red-600 active:bg-red-600 active:text-background border rounded p-1"
          @click="deletePostHandler"
        >
          确认
        </button>
        <button
          class="text-sm text-secondary hover:text-primary active:text-accent border rounded p-1"
          @click="toggle"
        >
          {{ isEdit ? '取消' : '删除文章' }}
        </button>
      </div>
    </div>
    <Listbox.Root
      v-model="deletePostList"
      class="px-[6vw] md:px-[12vw] py-6"
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
                class="p-0.5 group relative"
                :key="art.short_id"
                :value="art.short_id"
              >
                <div class="flex items-center gap-4 h-6 px-2 whitespace-nowrap w-full">
                  <Icon
                    :class="[
                      {
                        'group-data-[state=checked]:scale-100 group-data-[state=checked]:w-auto':
                          isEdit,
                      },
                      'scale-0 absolute right-full  transition-transform',
                    ]"
                    name="tabler:trash-x"
                  />
                  <!-- 时间 -->
                  <NuxtTime
                    class="text-sm font-bold font-mono text-secondary tracking-tighter"
                    :datetime="art.created_at"
                    day="2-digit"
                    month="2-digit"
                  />
                  <div class="flex flex-1 items-center justify-between">
                    <!-- 分类 -->
                    <span class="hidden md:flex items-center text-[#e3769b]">
                      <NuxtLink
                        class="text-sm font-normal font-mono cursor-pointer"
                        :to="
                          isEdit ? undefined : { name: 'list', query: { category: art.category } }
                        "
                      >
                        {{ art.category }}
                      </NuxtLink>
                    </span>
                    <div class="hidden md:block mx-2 w-px self-stretch"></div>
                    <!-- 标题标签 -->
                    <span class="flex flex-4 justify-between">
                      <!-- 标题 -->
                      <NuxtLink
                        class="text-lg w-full font-medium font-serif text-primary hover:text-[#e3769b] transition-colors duration-200"
                        :to="isEdit ? undefined : { name: 'post', params: { id: art.short_id } }"
                      >
                        {{ art.title }}
                      </NuxtLink>
                      <!-- 标签 -->
                      <span class="hidden md:flex items-center text-secondary">
                        <Icon
                          class="text-base text-[#e3769b]/80"
                          name="tabler:tag"
                        />
                        <NuxtLink
                          v-for="(tag, index) in art.tags"
                          :key="index"
                          class="flex items-center px-1 text-xs font-mono text-secondary hover:text-[#e3769b] cursor-pointer transition-colors"
                          :to="isEdit ? undefined : { name: 'list', query: { tags: tag } }"
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
  const { data: post_data, refresh } = await useAsyncData('posts:all', async () => {
    const result: ArticleTree = {}

    try {
      const articles = await fetchAllParallel<ApiArticle>('articles')
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
  const { fetchStats, refreshStats } = usePostStore()
  const post_stats_res = await fetchStats()
  const post_stats = computed(() => {
    return post_stats_res?.value ?? ({} as ApiArticleStats)
  })
  const allArticle = computed(() => post_data.value ?? {})
  const { isLoggedIn, openLogin } = useAuthStore()
  const isEdit = ref(false)
  const toggle = () => {
    if (!isLoggedIn) {
      openLogin()
      return
    }
    isEdit.value = !isEdit.value
    deletePostList.value = []
  }
  const { $api } = useNuxtApp()
  const deletePostList = ref<string[]>([])
  const isDeleteing = ref<boolean>(false)
  const deletePostHandler = async () => {
    if (isDeleteing.value) return
    if (deletePostList.value.length === 0) return
    isDeleteing.value = true
    try {
      await Promise.all(
        deletePostList.value.map((item) => {
          return $api(`articles/${item}`, { method: 'DELETE' })
        })
      )
      deletePostList.value = []
      isEdit.value = false
      await nextTick()
      await Promise.all([refreshStats(), refreshNuxtData(['posts:all', 'posts:list'])])
    } catch (err) {
      alert(`删除失败：${err}`)
    } finally {
      isDeleteing.value = false
    }
  }
</script>
