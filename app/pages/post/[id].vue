<template>
  <div class="details">
    <div class="px-[12vw] pt-16 pb-8 border-b flex flex-col gap-4">
      <h1 class="text-4xl font-bold">{{ res.frontmatter?.title }}</h1>
      <p class="text-lg">{{ res.frontmatter?.desc }}</p>
      <div class="flex justify-between">
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
            <NuxtLink :to="{ name: 'list', query: { category: post_details.category } }">
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
              :to="{ name: 'list', query: { tags: tag } }"
            >
              {{ tag }}
            </NuxtLink>
          </div>
        </div>
        <div>
          <div>
            <Icon name="tabler:mist" />
            {{ post_details.word_count }}字
          </div>
        </div>
      </div>
    </div>
    <ComarkRenderer
      class="px-[12vw] pt-16 prose prose-stone dark:prose-invert max-w-none"
      :tree="res"
    />
    <div>{{ res }}</div>
  </div>
</template>

<script setup lang="ts">
  import type { ApiResponse } from '~/types'
  definePageMeta({
    title: '文章详细',
    name: 'post',
  })
  const route = useRoute()
  const res_post = await useAPI<ApiResponse<ArticleDisplay>>(`articles/${route.params.id}`, {
    transform: (res) => {
      res.data = formatArticle(res.data)
      return res
    },
  })
  const post_details = computed(() => res_post.data.value?.data ?? ({} as ArticleDisplay))
  const res = await useMarkdown(post_details.value.content)
  console.log('meta', res.meta, 'frontmatter', res.frontmatter)
</script>
