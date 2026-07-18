<template>
  <div class="default relative z-0 transition-bg duration-200">
    <!-- <Background /> -->
    <AppHeader class="fixed top-0 w-full z-10" />
    <div :class="[contentClass, 'relative z-5']">
      <slot />
    </div>
    <AppFooter class="relative z-5" />
    <LoginDialog />
  </div>
</template>

<script setup lang="ts">
  const route = useRoute()

  const contentClass = computed(() => {
    if (route.name === 'home') return ''
    return 'py-20'
  })
</script>
