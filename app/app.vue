<template>
  <div class="main">
    <NuxtLayout>
      <NuxtPage :keepalive />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
  const keepalive = {
    include: ['archive', 'home'],
  }
</script>
