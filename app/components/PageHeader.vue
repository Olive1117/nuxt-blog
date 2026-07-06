<template>
    <div class="relative flex flex-col gap-3 pb-12 pt-6 border-b border-zinc-100 dark:border-zinc-800">
        <!-- 顶部微型标签 -->
        <span class="text-[10px] uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500 font-medium">
            Index / Posts
        </span>

        <!-- 使用 justify-between 将两端拉开 -->
        <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
            <div class="flex flex-col md:flex-row md:items-baseline gap-4">
                <h1 class="text-4xl md:text-5xl font-light font-serif tracking-wide text-zinc-800 dark:text-zinc-100">
                    文章
                </h1>
                <p class="text-xs md:text-sm text-zinc-400 dark:text-zinc-500 font-normal max-w-sm leading-relaxed">
                    写下游戏里的余韵，还有普通日子里值得记住的小事。
                </p>
            </div>

            <!-- 右侧填空：一个极其精致的数字标签或小字 -->
            <div class="text-[11px] font-mono text-zinc-300 dark:text-zinc-600 tracking-wider md:self-end">
                TOTAL_POSTS // <span class="text-zinc-500 dark:text-zinc-400 font-bold">24</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>