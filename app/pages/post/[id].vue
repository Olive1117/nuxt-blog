<template>
  <div class="details">
    <div class="px-[10vw] pt-32 pb-8 border-b flex flex-col gap-4">
      <h1 class="text-4xl font-bold">{{ res.frontmatter?.title }}</h1>
      <p class="text-lg">{{ res.frontmatter?.desc }}</p>
      <div class="flex gap-2">
        <div class="flex items-center">
          <Icon
            class="flex items-center justify-center"
            name="tabler:clock"
          />
          <NuxtTime :datetime="new Date()">{{
            res.frontmatter.time ?? post_details.created_at
          }}</NuxtTime>
        </div>
        <div class="flex items-center">
          <Icon
            class="flex items-center justify-center"
            name="tabler:category"
          />
          <NuxtLink :to="`/`">
            {{ post_details.category }}
          </NuxtLink>
        </div>
        <div class="flex items-center">
          <Icon
            class="flex items-center justify-center"
            name="tabler:tag"
          />
          <NuxtLink
            v-for="tag in post_details.tags"
            :key="tag"
          >
            {{ tag }}
          </NuxtLink>
        </div>
      </div>
    </div>
    <ComarkRenderer
      class="px-[10vw] pt-16 prose prose-stone dark:prose-invert prose-pre:bg-stone-100 dark:prose-pre:bg-stone-900 max-w-none"
      :tree="res"
    />
  </div>
</template>

<script setup lang="ts">
  import type { ApiResponse } from '~/types'
  const route = useRoute()
  const res_post = await useAPI<ApiResponse<ArticleDisplay>>(`articles/${route.params.id}`, {
    transform: (res) => {
      res.data = formatArticle(res.data)
      return res
    },
  })
  const post_details = computed(() => res_post.data.value?.data ?? ({} as ArticleDisplay))
  const res = await useMarkdown(post_details.value.content)
</script>

<style scoped>
  html.dark .details :deep(.shiki span) {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }
</style>
