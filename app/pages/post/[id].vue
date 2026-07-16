<template>
  <div class="details">
    <div class="px-[12vw] pt-0 md:pt-10 pb-4 md:pb-8 border-b flex flex-col gap-2 md:gap-4">
      <h1 class="text-3xl font-serif md:text-4xl font-bold">{{ post_details.title }}</h1>
      <p class="text-base font-serif md:text-lg">{{ post_details.desc }}</p>
      <div
        class="text-nowrap flex font-mono flex-col items-start gap-1 text-sm md:text-md md:gap-0 md:flex-row md:justify-between"
      >
        <div class="flex gap-2">
          <div class="flex items-center gap-1">
            <Icon
              class="flex items-center justify-center"
              name="tabler:clock"
            />
            <NuxtTime :datetime="new Date()">
              {{ post_details.created_at }}
            </NuxtTime>
          </div>
          <div class="flex items-center gap-1">
            <Icon
              class="flex items-center justify-center"
              name="tabler:category"
            />
            <NuxtLink :to="{ name: 'list', query: { category: post_details.category } }">
              {{ post_details.category }}
            </NuxtLink>
          </div>
          <div class="flex items-center gap-1">
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
          <div class="flex items-center gap-1">
            <Icon
              class="flex items-center justify-center"
              name="tabler:mist"
            />
            {{ post_details.word_count }}字
          </div>
        </div>
      </div>
    </div>
    <ComarkRenderer
      class="px-[6vw] pt-8 md:px-[12vw] md:pt-16 prose prose-sm md:prose-base prose-stone dark:prose-invert max-w-none"
      :tree="res"
    />
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
  useHead({ title: post_details.value.title })
</script>
