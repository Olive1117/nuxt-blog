<template>
  <div>
    <PageHeader
      class="px-[12vw]"
      title="友链"
      desc="或许不应该称之为友链，只是我常看的博客便会收录在这。"
      label="friend&nbsp;/&nbsp;link"
    />
    <ul class="grid md:grid-cols-4 gap-4">
      <!-- 展示卡片 -->
      <li
        v-for="link in flList"
        :key="link.id"
      >
        <!-- 改为整体卡片流式布局，增强点击区域和视觉整体感 -->
        <a
          class="group flex flex-col justify-between p-4 border rounded-lg gap-2 hover:-translate-y-0.5 transition-transform duration-200"
          :href="link.url"
        >
          <div class="flex items-start gap-4">
            <NuxtImg
              class="h-14 w-14 rounded-xl border shrink-0 object-cover"
              :src="link.logo"
              alt="头像"
            />
            <div class="flex-1 min-w-0 flex flex-col gap-1">
              <p class="text-base font-medium truncate">{{ link.name }}</p>
              <p
                class="text-sm opacity-70 line-clamp-1 group-hover:line-clamp-none leading-relaxed"
              >
                {{ link.description }}
              </p>
            </div>
          </div>
          <!-- 底部链接展示，增强仪式感 -->
          <div class="pt-2 border-t flex items-center justify-between text-xs opacity-50">
            <span class="truncate max-w-[80%]">{{ link.url.replace(/^https?:\/\//, '') }}</span>
            <span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import type { ApiFriendLink } from '~/types'

  useHead({ title: '友链' })
  const flData = await useAsyncData('friendlinks:all', async () => {
    try {
      const res = await fetchAllParallel<ApiFriendLink>('friendlinks')
      return res
    } catch (err) {
      console.error(err)
    }
    return null
  })

  const flList = computed(() => flData.data.value ?? [])
</script>
