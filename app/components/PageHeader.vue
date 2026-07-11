<template>
  <div class="relative flex flex-col gap-3 py-6 border-b border-primary">
    <span class="text-[10px] uppercase tracking-[0.3em] text-secondary font-medium">
      {{ props.label ?? 'Index&nbsp;/&nbsp;Posts' }}
    </span>

    <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
      <div class="flex flex-col md:flex-row md:items-baseline gap-4">
        <h1 class="text-4xl md:text-5xl font-light font-serif tracking-wide text-primary">
          {{ props.title ?? '文章' }}
        </h1>
        <p class="text-xs md:text-sm text-secondary font-normal max-w-sm leading-relaxed">
          {{ props.desc ?? '写下游戏里的余韵，还有普通日子里值得记住的小事。' }}
        </p>
      </div>

      <div class="flex flex-col gap-1">
        <div
          v-for="(count, key) in props.stats"
          :key="key"
          class="text-[11px] font-mono text-weak tracking-wider md:self-end"
        >
          {{ key ?? 'TOTAL_POSTS' }}&nbsp;//&nbsp;<span
            class="text-zinc-500 dark:text-zinc-400 font-bold"
            >{{ count ?? 24 }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    label?: string
    title?: string
    desc?: string
    stats?: Record<string, number | string>
  }>()
</script>
