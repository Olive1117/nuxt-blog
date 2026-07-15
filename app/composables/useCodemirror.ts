import { EditorView } from '@codemirror/view'
import { markdown } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { Compartment } from '@codemirror/state'
import type { ComarkTree } from 'comark'
import type { Extension } from '@codemirror/state/dist'

import { oneDark } from '~/codemirror/theme-one-dark'
import { oneLight } from '~/codemirror/theme-one-light'
import type { CodeMirrorRef } from '#build/nuxt-codemirror'

export function useCodemirror(options: {
  codemirrorRef: Ref<CodeMirrorRef | null>
  cRef: Ref<HTMLElement | null>
}) {
  const { codemirrorRef, cRef } = options

  const editorExtensions = shallowRef<Extension[]>()

  // 2. 主题与配置
  const themeCompartment = new Compartment()
  const colorMode = useColorMode()

  const scrollTheme = EditorView.theme({
    '&': { height: '100%' },
  })

  editorExtensions.value = [
    EditorView.lineWrapping,
    scrollTheme,
    markdown({ codeLanguages: languages }),
    themeCompartment.of(colorMode.value === 'dark' ? oneDark : oneLight),
  ]

  watch(
    () => colorMode.value,
    (newMode) => {
      const view = codemirrorRef.value?.view

      if (view) {
        const targetTheme = newMode === 'dark' ? oneDark : oneLight
        view.dispatch({
          effects: themeCompartment.reconfigure(targetTheme),
        })
      }
    }
  )

  let initScroll = () => {}
  let clearScroll = () => {}

  onMounted(() => {
    watch(
      () => [codemirrorRef.value?.view, cRef.value] as const,
      ([view, dom]) => {
        if (!dom) return
        if (!view) return

        const actualScrollDOM = view.scrollDOM
        if (actualScrollDOM) {
          const res = scrollAuto(actualScrollDOM, dom, codemirrorRef.value!)
          if (res) {
            initScroll = res[0] ?? initScroll
            clearScroll = res[1] ?? clearScroll
          }
          initScroll()
        }
      },
      { immediate: true }
    )
  })

  onUnmounted(() => {
    clearScroll()
  })

  const triggerScrollSync = async () => {
    if (codemirrorRef.value?.view) {
      await nextTick()
      initScroll()
    }
  }
  // 返回组件需要用到的所有属性和引用
  return {
    triggerScrollSync,
    editorExtensions,
  }
}
