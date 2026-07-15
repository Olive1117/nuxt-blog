<template>
  <div class="h-screen">
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
          <NuxtCodeMirror
            ref="codemirrorRef"
            v-model="markdownText"
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
      class="h-2 w-full bg-muted hover:bg-primary/50 active:bg-primary cursor-row-resize transition-colors flex items-center justify-center"
      @mousedown="startDrag"
    >
      <!-- 拖拽视觉提示（三个小点或一条细线） -->
      <div class="w-12 h-1 rounded-full bg-black/20"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ComarkTree } from 'comark'

  const markdownText = useState(
    'edit:md',
    () =>
      '- [x] Write the docs\n- [ ] Fix the bug\n- [x] Ship it\nComark supports footnotes[^1] with back-references.\n[^1]: The Standard Model of particle physics classifies all known elementary particles.\n> [!WARNING]\n> **Breaking change** in v2.0: the `parse()` function is now async.\n> Update all call sites to use `await parse(...)`.\n\nInline $x^2$ and display $$E = mc^2$$'
  )
  const comarkTree = ref<ComarkTree>({} as ComarkTree)
  comarkTree.value = await useMarkdown(markdownText.value)
  const codemirrorRef = useTemplateRef('codemirrorRef')
  const pRef = useTemplateRef('pEle')
  const cRef = useTemplateRef('cEle')
  console.log('ssr')
  const parseMarkdown = async (text: string) => {
    comarkTree.value = await useMarkdown(text)
    triggerScrollSync()
  }
  const debouncedParse = useDebounceFn(parseMarkdown, 100)

  const { editorExtensions, triggerScrollSync } = useCodemirror({ codemirrorRef, cRef })
  watch(
    () => markdownText.value,
    (newText) => {
      if (import.meta.client) {
        debouncedParse(newText)
      } else {
        parseMarkdown(newText)
      }
    }
  )
  console.log('SSR!!!!!!!!!', comarkTree.value)
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
