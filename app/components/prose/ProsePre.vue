<template>
  <pre
    class="flex flex-col relative bg-block text-primary"
    :filename="filename"
    :language="language"
  >
    <div class="not-prose text-primary flex items-center justify-between ">
      <div class="flex items-center gap-2">
        <Icon :name="`vscode-icons:file-type-${language}`" size="24"/>
        <span >{{ filename }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="showCopyInfo">已复制！</span>
        <Icon name="tabler:copy" @click="copyCode"/>
      </div>
    </div>
    <div class="py-2 before:h-px before:left-0 before:right-0 before:absolute before:border-b before:border-primary"></div>
    <div ref="codeBlock" class="flex flex-col">
      <slot/>
    </div>
  </pre>
</template>

<script setup lang="ts">
  defineProps<{
    language?: string
    filename?: string
  }>()
  const codeBlock = ref<HTMLPreElement | null>(null)
  const showCopyInfo = ref(false)
  const { start } = useCountdown(3, {
    onComplete() {
      showCopyInfo.value = false
    },
  })
  async function copyCode() {
    if (!codeBlock.value) return
    // 获取纯文本内容（去掉 Icon 等元素的干扰）
    const text = codeBlock.value.innerText
    try {
      await navigator.clipboard.writeText(text)
      showCopyInfo.value = true
      start()
    } catch (err) {
      console.error('复制失败:', err)
    }
  }
</script>
