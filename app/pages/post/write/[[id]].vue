<template>
  <div class="h-screen flex flex-col relative text-primary z-0 px-[12vw] py-16 gap-4">
    <div class="flex justify-center">
      <AlertDialog.Root v-model="alert_dialog_stats.open">
        <AlertDialog.Trigger
          class="p-2 border rounded bg-background hover:bg-block active:text-background active:bg-accent"
          @click.stop.prevent="verifyHandle"
        >
          提交
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            class="bg-black/50 dark:bg-white/50 data-[state=open]:animate-overlayShow fixed inset-0 z-50"
          />
          <AlertDialog.Content
            class="fixed flex flex-col top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-100 rounded bg-background focus:outline-none p-8 gap-4"
          >
            <AlertDialog.Title
              v-if="alert_dialog_stats.title"
              class="font-bold whitespace-pre-line"
              >{{ alert_dialog_stats.title }}
            </AlertDialog.Title>
            <AlertDialog.Description
              v-if="alert_dialog_stats.desc"
              class="whitespace-pre-line"
              >{{ alert_dialog_stats.desc }}
            </AlertDialog.Description>
            <div class="flex justify-end gap-4">
              <AlertDialog.Cancel
                class="p-1 rounded hover:bg-block"
                @click="() => (alert_dialog_stats.open = false)"
                >取消</AlertDialog.Cancel
              >
              <AlertDialog.Action
                :disabled="alert_dialog_stats.disable"
                :class="[
                  { 'disabled:bg-weak': alert_dialog_stats.disable },
                  'p-1 rounded bg-accent',
                ]"
                @click="submitHandle"
                >确定
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
    <div class="flex flex-col gap-4 text-nowrap">
      <div class="flex items-center gap-2">
        <Label for="slug">slug:</Label>
        <div
          class="relative border px-1 rounded-lg w-full bg-background focus-within:bg-block shadow-sm flex"
        >
          <input
            id="slug"
            v-model="md.slug"
            placeholder="文章唯一索引"
            class="text-xs focus:outline-none flex-1 rounded placeholder:text-mauve9 p-2"
            type="text"
          />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Label for="cat">分类:</Label>
        <Autocomplete.Root
          v-model="md.category"
          class="relative border rounded-lg w-full px-1 bg-background focus-within:bg-block shadow-sm"
        >
          <Autocomplete.Anchor class="flex flex-1 gap-2">
            <Autocomplete.Input
              id="cat"
              placeholder="技术"
              class="text-xs focus:outline-none flex-1 rounded placeholder:text-mauve9 p-2"
            />
            <Autocomplete.Trigger
              class="self-stretch px-1 flex items-center justify-center data-[state=open]:rotate-180 transition-transform"
            >
              <Icon name="tabler:chevron-down" />
            </Autocomplete.Trigger>
          </Autocomplete.Anchor>
          <Autocomplete.Content
            class="absolute z-10 w-full top-full left-0 mt-1 min-w-40 bg-background overflow-hidden rounded-lg shadow border"
            side="bottom"
          >
            <Autocomplete.Viewport>
              <Autocomplete.Empty class="h-6.25 flex justify-center items-center"
                >暂时没有此标签哦
              </Autocomplete.Empty>
              <Autocomplete.Item
                v-for="(_, cat) in catList"
                :key="cat"
                :value="cat"
                class="data-highlighted:bg-selection/40 text-xs h-6.25 pr-8.75 pl-6.25 select-none flex items-center"
                >{{ cat }}
              </Autocomplete.Item>
            </Autocomplete.Viewport>
          </Autocomplete.Content>
        </Autocomplete.Root>
      </div>
      <div class="flex items-center gap-2">
        <Label for="tag">标签:</Label>
        <Autocomplete.Root class="relative border p-1.5 rounded-lg w-full bg-background shadow-sm">
          <Autocomplete.Anchor as-child>
            <TagsInput.Root
              v-model="md.tags"
              class="flex gap-2 items-center flex-wrap"
            >
              <TagsInput.Item
                v-for="tag in md.tags"
                :key="tag"
                :value="tag"
                class="font-medium flex items-center border border-primary justify-center aria-current:bg-selection/40 rounded p-1"
              >
                <TagsInput.ItemText class="text-xs" />
                <TagsInput.ItemDelete
                  class="flex items-center justify-center p-1 rounded bg-transparent hover:bg-selection/40"
                >
                  <Icon
                    class="flex items-center justify-center"
                    size="10"
                    name="tabler:x"
                  />
                </TagsInput.ItemDelete>
              </TagsInput.Item>
              <TagsInput.Input as-child>
                <Autocomplete.Input
                  id="tag"
                  placeholder="博客，教程"
                  class="text-xs focus:outline-none flex-1 rounded bg-background focus:bg-block placeholder:text-mauve9 p-2"
                />
              </TagsInput.Input>
              <Autocomplete.Trigger
                class="self-stretch px-1 flex items-center justify-center data-[state=open]:rotate-180 transition-transform"
              >
                <Icon name="tabler:chevron-down" />
              </Autocomplete.Trigger>
            </TagsInput.Root>
          </Autocomplete.Anchor>
          <Autocomplete.Content
            class="absolute z-10 w-full top-full left-0 mt-1 min-w-40 bg-background overflow-hidden rounded-lg shadow border"
            side="bottom"
          >
            <Autocomplete.Viewport>
              <Autocomplete.Empty class="h-6.25 flex justify-center items-center"
                >暂时没有此标签哦
              </Autocomplete.Empty>
              <Autocomplete.Item
                v-for="(_, tag) in tagList"
                :key="tag"
                :value="tag"
                class="data-highlighted:bg-selection/40 text-xs h-6.25 pr-8.75 pl-6.25 select-none flex items-center"
                >{{ tag }}
              </Autocomplete.Item>
            </Autocomplete.Viewport>
          </Autocomplete.Content>
        </Autocomplete.Root>
      </div>
    </div>
    <div class="flex flex-col border">
      <div
        class="flex h-full w-full resize-y"
        :style="{ height: panelHeight + 'px' }"
      >
        <ClientOnly
          fallback-tag="span"
          fallback="Loading codemirror..."
          class="flex-1"
        >
          <div
            ref="pEle"
            class="flex-1"
          >
            <LazyNuxtCodeMirror
              ref="codemirrorRef"
              v-model="md.content"
              class="h-full"
              :basic-setup="true"
              :editable="true"
              :extensions="editorExtensions"
              theme="none"
            />
          </div>
        </ClientOnly>
        <div
          ref="cEle"
          class="flex-1 overflow-y-auto relative bg-background"
        >
          <ComarkRenderer
            class="prose wrap-break-word prose-stone dark:prose-invert max-w-none bg-background"
            :tree="comarkTree"
          />
        </div>
      </div>
      <div
        class="h-4 w-full border-t border-primary bg-background hover:bg-selection/50 active:bg-selection cursor-row-resize transition-colors flex items-center justify-center"
        @mousedown="startDrag"
      >
        <!-- 拖拽视觉提示（三个小点或一条细线） -->
        <div class="w-12 h-1 rounded-full bg-primary/20"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ComarkTree } from 'comark'
  import { AlertDialog, Autocomplete, Label, TagsInput } from 'reka-ui/namespaced'
  import type { ApiArticle, ApiArticleStats, ApiResponse, ArticleDTO } from '~/types'
  const { $api } = useNuxtApp()
  const DEFAULT_ARTICLE: ArticleDTO = {
    title: '',
    desc: '',
    slug: '',
    content: '$$\nx = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\n$$',
    category: '',
    tags: [],
    status: 1,
    image_count: 0,
  }
  const route = useRoute()
  const asyneKey = computed(() => `write:${route.params.id}`)
  const articleId = computed(() => {
    const id = route.params.id
    return (Array.isArray(id) ? id[0] : id) ?? ''
  })
  const { fetchStats } = usePostStore()
  const post_stats_res = await fetchStats()
  const post_stats = computed(() => {
    return post_stats_res?.value ?? ({} as ApiArticleStats)
  })
  const tagList = computed(() => {
    return post_stats.value.total_by_tag || {}
  })
  const catList = computed(() => {
    return post_stats.value.total_by_category || {}
  })
  const { data: articleDetail } = await useAsyncData<ApiArticle | null>(
    asyneKey,
    async () => {
      // 如果没有 id，直接返回 null，不走 useAPI 请求
      if (!articleId.value) return null
      const res = await useAPI<ApiResponse<ApiArticle>>(`articles/${articleId.value}`)
      if (res.data.value) return res.data.value.data
      return null
    },
    {
      watch: [articleId],
    }
  )

  const md = useState<ArticleDTO>('edit:md', () =>
    articleDetail.value ? { ...articleDetail.value } : { ...DEFAULT_ARTICLE }
  )
  const comarkTree = ref<ComarkTree>({} as ComarkTree)
  // SSR初始化解析
  comarkTree.value = await useMarkdown(md.value.content)
  const codemirrorRef = useTemplateRef('codemirrorRef')
  const pRef = useTemplateRef('pEle')
  const cRef = useTemplateRef('cEle')

  const alert_dialog_stats = ref({
    open: false,
    title: '',
    desc: '',
    disable: false,
  })
  const verifyHandle = () => {
    if (md.value.category && md.value.tags && md.value.tags.length > 0 && md.value.slug) {
      alert_dialog_stats.value.title = '正在提交...'
      alert_dialog_stats.value.desc = '提交完成会进行跳转'
      alert_dialog_stats.value.disable = false
    } else {
      alert_dialog_stats.value.disable = true
      alert_dialog_stats.value.title = '分类和标签未填写！'
      alert_dialog_stats.value.desc = ''
      alert_dialog_stats.value.open = true
      return
    }

    if (!comarkTree.value.frontmatter.title || !comarkTree.value.frontmatter.desc) {
      alert_dialog_stats.value.title = '确定提交吗'
      alert_dialog_stats.value.desc =
        '您的标题或简介还没填写，使用frontmatter语法填写\n---\ntitle: 标题\ndesc: 简介\n---'
      alert_dialog_stats.value.open = true
      return
    }
    submitHandle()
  }
  const submitHandle = async () => {
    if (alert_dialog_stats.value.disable) return
    await parseMarkdown(md.value.content)
    md.value.title = comarkTree.value.frontmatter.title
    md.value.desc = comarkTree.value.frontmatter.desc
    if (articleId.value) {
      try {
        const res = await $api<ApiResponse<ArticleDTO>>(`articles/${articleId.value}`, {
          method: 'PUT',
          body: md.value,
        })

        if (res.code === 200) {
          await navigateTo({ name: 'post', params: { id: articleId.value } })
          alert_dialog_stats.value.open = false
        } else {
          alert_dialog_stats.value.desc = `提交失败${res.msg}`
        }
      } catch (err) {
        alert_dialog_stats.value.title = 'ERROR'
        alert_dialog_stats.value.desc = `${err}`
      }
    } else {
      try {
        const res = await $api<ApiResponse<ArticleDTO>>('articles', {
          method: 'POST',
          body: md.value,
        })

        if (res.code === 200) {
          await navigateTo({ name: 'list' })
          alert_dialog_stats.value.open = false
        } else {
          alert_dialog_stats.value.desc = `提交失败${res.msg}`
        }
      } catch (err) {
        alert_dialog_stats.value.title = 'ERROR'
        alert_dialog_stats.value.desc = `${err}`
      }
    }
  }

  const parseMarkdown = async (text: string) => {
    comarkTree.value = await useMarkdown(text)
    triggerScrollSync()
  }
  const debouncedParse = useDebounceFn(parseMarkdown, 100)

  const { editorExtensions, triggerScrollSync } = useCodemirror({ codemirrorRef, cRef })
  watch(
    () => md.value.content,
    (newText) => {
      if (import.meta.client) {
        debouncedParse(newText)
      } else {
        parseMarkdown(newText)
      }
    }
  )

  const panelHeight = ref(450)
  const minHeight = 200 // 限制最小高度
  const maxHeight = 800 // 限制最大高度（可根据 window.innerHeight 动态计算）

  const startDrag = (event: MouseEvent) => {
    const startY = event.clientY
    const startHeight = panelHeight.value

    const doDrag = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY
      // 限制拖拽范围
      panelHeight.value = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY))
    }

    const stopDrag = () => {
      document.removeEventListener('mousemove', doDrag)
      document.removeEventListener('mouseup', stopDrag)
    }

    document.addEventListener('mousemove', doDrag)
    document.addEventListener('mouseup', stopDrag)
  }
</script>
