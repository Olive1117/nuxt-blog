<template>
  <Math v-bind="props" />
</template>

<script setup lang="ts">
  import { Math } from '@comark/nuxt/plugins/math'
  import 'katex/dist/katex.min.css'

  const props = defineProps<{
    content: string
  }>()
</script>
