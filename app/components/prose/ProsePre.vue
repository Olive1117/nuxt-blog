<template>
  <pre
    class="flex flex-col relative"
    :filename="filename"
    :language="language"
  >
    <div class="not-prose text-black flex items-center justify-between ">
      <div class="flex items-center gap-2">
        <Icon :name="`vscode-icons:file-type-${language}`" size="24"/>
        <span class="dark:text-white">{{ filename }}</span>
      </div>
      <Icon name="tabler:copy" @click="copyCode"/>
    </div>
    <div class="py-2 before:h-px before:right-0 before:absolute before:left-0 before:border-b before:border-zinc-400 before:dark:border-zinc-800"></div>
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

  async function copyCode() {
    if (!codeBlock.value) return
    // 获取纯文本内容（去掉 Icon 等元素的干扰）
    const text = codeBlock.value.innerText
    try {
      await navigator.clipboard.writeText(text)
      console.log(text)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }
</script>
